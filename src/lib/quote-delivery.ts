import { validateQuoteSubmission, formatMoveBriefText } from './quote-validation';
import { mrkBusiness } from '../config/business';

/**
 * Single authoritative quote-delivery flow, shared by the Vercel function (api/quote.ts)
 * and the local Express server (server.ts).
 *
 * Contract:
 *  - `delivered` is only returned when a provider confirms acceptance of the message.
 *  - Providers are tried in order and the first confirmed success stops the chain,
 *    so one enquiry can never be delivered twice.
 *  - Every non-delivered outcome is an `ok: false` response; the client keeps the form data.
 */

export type QuoteOutcomeStatus =
  | 'delivered'
  | 'validation_error'
  | 'spam_rejected'
  | 'rate_limited'
  | 'delivery_failed'
  | 'not_configured'
  | 'bad_request';

export interface QuoteEnv {
  WEB3FORMS_ACCESS_KEY?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export interface QuoteResult {
  statusCode: number;
  body: Record<string, unknown>;
}

interface AttemptRecord {
  referenceId: string;
  timestamp: string;
  provider: string;
}

export interface QuoteStore {
  rate: Map<string, { count: number; windowStart: number }>;
  delivered: Map<string, AttemptRecord>;
  inFlight: Map<string, Promise<QuoteResult>>;
}

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 6;
const PROVIDER_TIMEOUT_MS = 8000;
const MAX_STORE_ENTRIES = 500;

export function createQuoteStore(): QuoteStore {
  return { rate: new Map(), delivered: new Map(), inFlight: new Map() };
}

const defaultStore = createQuoteStore();

export function readQuoteEnv(env: NodeJS.ProcessEnv = process.env): QuoteEnv {
  return {
    // `web3form_key` is the name already configured as a sensitive production variable on Vercel.
    WEB3FORMS_ACCESS_KEY: env.WEB3FORMS_ACCESS_KEY || env.web3form_key,
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

function trim(map: Map<string, unknown>) {
  while (map.size > MAX_STORE_ENTRIES) {
    const oldest = map.keys().next().value;
    if (oldest === undefined) break;
    map.delete(oldest);
  }
}

export function checkRateLimit(store: QuoteStore, ip: string, now: number): boolean {
  const entry = store.rate.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    store.rate.set(ip, { count: 1, windowStart: now });
    trim(store.rate);
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
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

export async function handleQuoteRequest(options: HandleQuoteOptions): Promise<QuoteResult> {
  const store = options.store ?? defaultStore;
  const now = options.now ?? Date.now;
  const log = options.log ?? defaultLog;
  const fetchImpl = options.fetchImpl ?? fetch;

  if (!options.body || typeof options.body !== 'object') {
    return fail(400, 'bad_request', 'The request could not be read. Please try again.');
  }

  if (!checkRateLimit(store, options.ip, now())) {
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
    const prior = store.delivered.get(attemptId);
    if (prior) {
      return {
        statusCode: 200,
        body: {
          ok: true,
          status: 'delivered',
          deduplicated: true,
          referenceId: prior.referenceId,
          timestamp: prior.timestamp,
          moveBrief,
          ...fallbackContact(),
        },
      };
    }
    const pending = store.inFlight.get(attemptId);
    if (pending) return pending;
  }

  const run = (async (): Promise<QuoteResult> => {
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
      store.delivered.set(attemptId, { referenceId, timestamp, provider: confirmed.provider });
      trim(store.delivered);
    }
    log({
      status: 'delivered',
      referenceId,
      provider: confirmed.provider,
      service: sanitized.serviceType,
      pickup: sanitized.pickupSuburb,
      destination: sanitized.destinationSuburb,
    });
    return {
      statusCode: 200,
      body: { ok: true, status: 'delivered', referenceId, timestamp, moveBrief, ...fallbackContact() },
    };
  })();

  if (attemptId) {
    store.inFlight.set(attemptId, run);
    run.finally(() => store.inFlight.delete(attemptId)).catch(() => undefined);
  }
  return run;
}
