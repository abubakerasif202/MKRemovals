import { validateQuoteSubmission, formatMoveBriefText } from './quote-validation.js';
import { mrkBusiness } from '../config/business.js';
import { getQuoteStore, type QuoteStore } from './quote-store.js';
import { createBrowserTicket, verifyBrowserTicket, hasBrowserSigningSecret } from './quote-browser-ticket.js';

export { createMemoryStore as createQuoteStore, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from './quote-store.js';
export type { QuoteStore } from './quote-store.js';

/**
 * Single authoritative quote-delivery flow, shared by the Vercel function (api/quote.ts)
 * and the local Express server (server.ts).
 *
 * Contract:
 *  - `delivered` is only returned when a provider confirms acceptance of the message.
 *  - Server providers stop after the first confirmed success. Browser mode prepares one
 *    Web3Forms dispatch and records a signed browser report, never a second server send.
 *  - Known acceptance is deduplicated; an ambiguous browser response cannot guarantee
 *    exactly-once email delivery and the UI warns before a manual retry.
 *  - Every non-delivered outcome is an `ok: false` response; the client keeps the form data.
 */

export type QuoteOutcomeStatus =
  | 'delivered'
  | 'validation_error'
  | 'spam_rejected'
  | 'rate_limited'
  | 'in_progress'
  | 'delivery_failed'
  | 'not_configured'
  | 'bad_request'
  | 'browser_already_reported';

export interface QuoteEnv {
  WEB3FORMS_ACCESS_KEY?: string;
  WEB3FORMS_DELIVERY_MODE?: 'browser' | 'server';
  QUOTE_BROWSER_SIGNING_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export interface QuoteResult {
  statusCode: number;
  body: Record<string, unknown>;
}

const PROVIDER_TIMEOUT_MS = 8000;

export function readQuoteEnv(env: NodeJS.ProcessEnv = process.env): QuoteEnv {
  return {
    // `web3form_key` is the name already configured as a sensitive production variable on Vercel.
    WEB3FORMS_ACCESS_KEY: env.WEB3FORMS_ACCESS_KEY || env.web3form_key,
    WEB3FORMS_DELIVERY_MODE: env.WEB3FORMS_DELIVERY_MODE === 'browser' ? 'browser' : 'server',
    QUOTE_BROWSER_SIGNING_SECRET: env.QUOTE_BROWSER_SIGNING_SECRET,
    RESEND_API_KEY: env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: env.RESEND_FROM_EMAIL,
  };
}

function fallbackContact() {
  return {
    fallbackPhone: mrkBusiness.phoneDisplay,
    fallbackPhoneHref: mrkBusiness.phoneHref,
    fallbackEmail: mrkBusiness.enquiryEmail,
    fallbackEmailHref: mrkBusiness.enquiryEmailHref,
  };
}

function fail(
  statusCode: number,
  status: QuoteOutcomeStatus,
  message: string,
  extra: Record<string, unknown> = {}
): QuoteResult {
  return { statusCode, body: { ok: false, status, message, ...extra, ...fallbackContact() } };
}

export function generateReferenceId(now: Date = new Date()): string {
  const rand = Math.floor(Math.random() * 36 ** 5)
    .toString(36)
    .toUpperCase()
    .padStart(5, '0');
  return `MRK-${now.getFullYear()}-${rand}`;
}

async function postJson(
  fetchImpl: typeof fetch,
  url: string,
  headers: Record<string, string>,
  payload: unknown
): Promise<{ ok: boolean; status: number; data: any }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { ok: res.ok, status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

interface ProviderAttempt {
  provider: 'web3forms' | 'resend';
  confirmed: boolean;
  detail: string;
}

async function sendViaWeb3Forms(
  fetchImpl: typeof fetch,
  accessKey: string,
  subject: string,
  replyTo: string,
  customerName: string,
  brief: string
): Promise<ProviderAttempt> {
  try {
    const res = await postJson(fetchImpl, 'https://api.web3forms.com/submit', {}, {
      access_key: accessKey,
      subject,
      from_name: 'MRK Removals Adelaide Website',
      name: customerName,
      ...(replyTo ? { email: replyTo, replyto: replyTo } : {}),
      message: brief,
    });
    const confirmed = res.ok && res.data?.success === true;
    return { provider: 'web3forms', confirmed, detail: `http_${res.status}` };
  } catch (err) {
    return { provider: 'web3forms', confirmed: false, detail: err instanceof Error ? err.name : 'error' };
  }
}

async function sendViaResend(
  fetchImpl: typeof fetch,
  apiKey: string,
  from: string,
  subject: string,
  replyTo: string,
  brief: string
): Promise<ProviderAttempt> {
  try {
    const res = await postJson(
      fetchImpl,
      'https://api.resend.com/emails',
      { Authorization: `Bearer ${apiKey}` },
      {
        from,
        to: [mrkBusiness.enquiryEmail],
        reply_to: replyTo || undefined,
        subject,
        text: brief,
      }
    );
    const confirmed = res.ok && typeof res.data?.id === 'string';
    return { provider: 'resend', confirmed, detail: `http_${res.status}` };
  } catch (err) {
    return { provider: 'resend', confirmed: false, detail: err instanceof Error ? err.name : 'error' };
  }
}

export interface HandleQuoteOptions {
  body: unknown;
  ip: string;
  env: QuoteEnv;
  fetchImpl?: typeof fetch;
  store?: QuoteStore;
  now?: () => number;
  log?: (entry: Record<string, unknown>) => void;
}

const defaultLog = (entry: Record<string, unknown>) => {
  // Structured, PII-free audit line (visible in Vercel runtime logs).
  console.info(JSON.stringify({ event: 'mrk_quote', ...entry }));
};

/** Same-instance concurrent duplicates share one in-flight send; cross-instance ones use the store lock. */
const inFlight = new Map<string, Promise<QuoteResult>>();

export async function handleQuoteRequest(options: HandleQuoteOptions): Promise<QuoteResult> {
  const log = options.log ?? defaultLog;
  const store =
    options.store ?? getQuoteStore(undefined, (op, err) => log({ status: 'store_fallback', op, err: String(err) }));
  const now = options.now ?? Date.now;
  const fetchImpl = options.fetchImpl ?? fetch;

  if (!options.body || typeof options.body !== 'object') {
    return fail(400, 'bad_request', 'The request could not be read. Please try again.');
  }

  // A signed receipt authorizes bookkeeping for one reserved attempt. It is a browser report,
  // not independent server evidence that the provider accepted or delivered an email.
  const requestBody = options.body as Record<string, unknown>;
  if (requestBody.action === 'browser-result') {
    const ticket = verifyBrowserTicket(requestBody.ticket, options.env.QUOTE_BROWSER_SIGNING_SECRET, now());
    if (!ticket || typeof requestBody.accepted !== 'boolean') {
      return fail(400, 'bad_request', 'The submission receipt is invalid or expired.');
    }
    if (requestBody.accepted) {
      try {
        const existing = await store.getDelivered(ticket.attemptId);
        if (!existing) await store.setDelivered(ticket.attemptId, {
          referenceId: ticket.referenceId, timestamp: new Date(now()).toISOString(), provider: 'web3forms-browser',
        });
      } catch (err) {
        log({ status: 'browser_record_failed', referenceId: ticket.referenceId, err: String(err) });
        // Keep the lease until it expires if acceptance could not be recorded.
        return fail(503, 'delivery_failed', 'Submission bookkeeping is temporarily unavailable.');
      }
    }
    await store.release(ticket.attemptId);
    log({ status: requestBody.accepted ? 'browser_reported_accepted' : 'browser_dispatch_not_confirmed',
      referenceId: ticket.referenceId, inboxReceipt: 'unverified' });
    return { statusCode: 200, body: { ok: true, status: 'browser_report_recorded', acceptance: 'browser_reported' } };
  }

  if (!(await store.rateLimit(options.ip, now()))) {
    log({ status: 'rate_limited' });
    return fail(
      429,
      'rate_limited',
      `Too many attempts from this connection. Please wait a few minutes, or call ${mrkBusiness.phoneDisplay}.`
    );
  }

  const validation = validateQuoteSubmission(options.body as Record<string, never>);
  if (validation.isSpam) {
    log({ status: 'spam_rejected' });
    return fail(400, 'spam_rejected', 'This submission could not be accepted.');
  }
  if (!validation.valid || !validation.sanitized) {
    return fail(400, 'validation_error', 'Please check the highlighted fields and try again.', {
      errors: validation.errors,
    });
  }

  const sanitized = validation.sanitized;
  const attemptId = sanitized.attemptId || '';
  const moveBrief = formatMoveBriefText(sanitized);

  // Idempotency: a retry of an attempt that was already delivered never sends a second email.
  if (attemptId) {
    const prior = await store.getDelivered(attemptId);
    if (prior?.provider === 'web3forms-browser') {
      return fail(409, 'browser_already_reported', 'This attempt was already reported as accepted. Please call before sending another copy.', { referenceId: prior.referenceId, moveBrief });
    }
    if (prior) {
      return {
        statusCode: 200,
        body: {
          ok: true,
          status: 'delivered',
          deduplicated: true,
          acceptance: 'provider_accepted',
          inboxReceipt: 'unverified',
          referenceId: prior.referenceId,
          timestamp: prior.timestamp,
          moveBrief,
          ...fallbackContact(),
        },
      };
    }
    const pending = inFlight.get(attemptId);
    if (pending) return pending;
    if (!(await store.claim(attemptId))) {
      // Another instance is sending this attempt right now. Never send a second copy.
      log({ status: 'in_progress' });
      return fail(
        409,
        'in_progress',
        'Your request is already being sent. Please wait a few seconds before trying again.',
        { moveBrief }
      );
    }
  }

  let browserLeaseHandedOff = false;
  const work = async (): Promise<QuoteResult> => {
    const web3Key = options.env.WEB3FORMS_ACCESS_KEY?.trim();
    const resendKey = options.env.RESEND_API_KEY?.trim();

    if (!web3Key && !resendKey) {
      log({ status: 'not_configured' });
      return fail(
        503,
        'not_configured',
        `Online quote delivery is not available right now. Please email ${mrkBusiness.enquiryEmail} or call ${mrkBusiness.phoneDisplay}.`,
        { moveBrief }
      );
    }

    const referenceId = generateReferenceId(new Date(now()));
    const subject = `MRK Removals Quote Request: ${sanitized.pickupSuburb} to ${sanitized.destinationSuburb} [${referenceId}]`;
    if (options.env.WEB3FORMS_DELIVERY_MODE === 'browser') {
      const secret = options.env.QUOTE_BROWSER_SIGNING_SECRET;
      if (!web3Key || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(web3Key) || !hasBrowserSigningSecret(secret)) {
        return fail(503, 'not_configured', 'Online quote delivery is temporarily unavailable.', { moveBrief });
      }
      if (!attemptId) return fail(400, 'validation_error', 'Please refresh the page and try again.');
      const ticket = createBrowserTicket(attemptId, referenceId, secret, now());
      browserLeaseHandedOff = true;
      log({ status: 'browser_dispatch_prepared', referenceId });
      return { statusCode: 200, body: {
        ok: false, status: 'browser_delivery_required', referenceId, moveBrief,
        message: 'Please refresh this page to load the updated quote form if submission does not continue.',
        browserDelivery: { ticket, referenceId, payload: {
          access_key: web3Key, subject, from_name: 'MRK Removals Adelaide Website',
          name: sanitized.fullName,
          ...(sanitized.email ? { email: sanitized.email, replyto: sanitized.email } : {}),
          message: `${moveBrief}\n\nReference: ${referenceId}`, botcheck: false,
        } },
      } };
    }
    const attempts: ProviderAttempt[] = [];
    let confirmed: ProviderAttempt | undefined;

    if (web3Key) {
      const a = await sendViaWeb3Forms(
        fetchImpl,
        web3Key,
        subject,
        sanitized.email,
        sanitized.fullName,
        `${moveBrief}\n\nReference: ${referenceId}`
      );
      attempts.push(a);
      if (a.confirmed) confirmed = a;
    }

    if (!confirmed && resendKey) {
      const a = await sendViaResend(
        fetchImpl,
        resendKey,
        options.env.RESEND_FROM_EMAIL || 'MRK Removals Quotes <onboarding@resend.dev>',
        subject,
        sanitized.email,
        `${moveBrief}\n\nReference: ${referenceId}`
      );
      attempts.push(a);
      if (a.confirmed) confirmed = a;
    }

    const timestamp = new Date(now()).toISOString();

    if (!confirmed) {
      log({
        status: 'delivery_failed',
        referenceId,
        attempts: attempts.map((a) => `${a.provider}:${a.detail}`),
      });
      return fail(
        502,
        'delivery_failed',
        `We could not confirm delivery of your request, so it has not been sent. Your details are still in the form. Please try again, email ${mrkBusiness.enquiryEmail}, or call ${mrkBusiness.phoneDisplay}.`,
        { referenceId, moveBrief }
      );
    }

    if (attemptId) {
      try {
        await store.setDelivered(attemptId, { referenceId, timestamp, provider: confirmed.provider });
      } catch (err) {
        // The email WAS accepted by the provider; failing to remember it must not turn that into an error.
        log({ status: 'record_failed', referenceId, err: String(err) });
      }
    }
    log({
      status: 'delivered',
      acceptance: 'provider_accepted',
      inboxReceipt: 'unverified',
      referenceId,
      provider: confirmed.provider,
      store: store.kind,
      service: sanitized.serviceType,
      pickup: sanitized.pickupSuburb,
      destination: sanitized.destinationSuburb,
    });
    return {
      statusCode: 200,
      // delivered means the provider ACCEPTED the message. Inbox receipt cannot be observed by this site.
      body: {
        ok: true,
        status: 'delivered',
        acceptance: 'provider_accepted',
        inboxReceipt: 'unverified',
        provider: confirmed.provider,
        referenceId,
        timestamp,
        moveBrief,
        ...fallbackContact(),
      },
    };
  };

  // Release the lock before resolving so an immediate retry after a failure is never blocked.
  const run = (async (): Promise<QuoteResult> => {
    try {
      return await work();
    } finally {
      if (attemptId) {
        inFlight.delete(attemptId);
        try {
          if (!browserLeaseHandedOff) await store.release(attemptId);
        } catch {
          // The claim expires on its own after CLAIM_TTL_SECONDS.
        }
      }
    }
  })();

  if (attemptId) inFlight.set(attemptId, run);
  return run;
}