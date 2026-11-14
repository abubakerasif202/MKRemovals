import type { IncomingMessage, ServerResponse } from 'node:http';
import { validateQuoteSubmission, formatMoveBriefText, type QuoteFormInput } from '../src/lib/quote-validation.js';
import { mrkBusiness } from '../src/config/business.js';

interface ExtendedRequest extends IncomingMessage {
  body?: any;
  query?: Record<string, string>;
  headers: Record<string, string | string[] | undefined>;
}

interface ExtendedResponse extends ServerResponse {
  status: (code: number) => ExtendedResponse;
  json: (data: any) => void;
  send: (data: any) => void;
}

export default async function handler(req: ExtendedRequest, res: ExtendedResponse) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        brandName: mrkBusiness.brandName,
        bookingMode: mrkBusiness.bookingMode,
        deliveryEmail: mrkBusiness.enquiryEmail,
        directPhoneDisplay: mrkBusiness.phoneDisplay,
        directPhoneHref: mrkBusiness.phoneHref,
        status: 'ready',
      })
    );
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use as is
      }
    } else if (!body) {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      try {
        body = JSON.parse(raw);
      } catch {
        body = {};
      }
    }

    const validation = validateQuoteSubmission((body || {}) as Partial<QuoteFormInput>);
    if (!validation.valid || !validation.sanitized) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ok: false,
          status: 'validation_error',
          message: 'Please check the highlighted fields and try again.',
          errors: validation.errors,
          fallbackPhone: mrkBusiness.phoneDisplay,
          fallbackPhoneHref: mrkBusiness.phoneHref,
        })
      );
      return;
    }

    const sanitized = validation.sanitized;
    const referenceId = `MRK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();
    const moveBrief = formatMoveBriefText(sanitized);

    // 1. Live direct email delivery via Resend if RESEND_API_KEY is configured
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (resendKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'MRK Moving Quotes <onboarding@resend.dev>',
            to: [mrkBusiness.enquiryEmail],
            reply_to: sanitized.email || undefined,
            subject: `New Moving Quote: ${sanitized.pickupSuburb} to ${sanitized.destinationSuburb} [${referenceId}]`,
            text: moveBrief,
          }),
        });

        if (emailRes.ok) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: true,
              status: 'delivered',
              referenceId,
              timestamp,
              deliveryEmail: mrkBusiness.enquiryEmail,
              message: `Your moving quote request has been delivered directly to ${mrkBusiness.enquiryEmail}.`,
              moveBrief,
              fallbackPhone: mrkBusiness.phoneDisplay,
              fallbackPhoneHref: mrkBusiness.phoneHref,
            })
          );
          return;
        }
      } catch (err) {
        console.error('Error delivering quote email via Resend:', err);
      }
    }

    // 2. Upstream provider webhook if MRK_QUOTE_PROVIDER_URL is configured
    const providerUrl = process.env.MRK_QUOTE_PROVIDER_URL?.trim();
    if (providerUrl) {
      if (/hfremovals|noorremovals/i.test(providerUrl)) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            ok: false,
            status: 'configuration_blocked',
            message: `External quote provider blocked by MRK brand isolation guard. Please call ${mrkBusiness.phoneDisplay} directly.`,
            fallbackPhone: mrkBusiness.phoneDisplay,
            fallbackPhoneHref: mrkBusiness.phoneHref,
          })
        );
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const upstreamRes = await fetch(providerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.MRK_QUOTE_PROVIDER_API_KEY
              ? { Authorization: `Bearer ${process.env.MRK_QUOTE_PROVIDER_API_KEY}` }
              : {}),
          },
          body: JSON.stringify({
            referenceId,
            brand: mrkBusiness.brandName,
            deliveryEmail: mrkBusiness.enquiryEmail,
            enquiry: sanitized,
            formattedBrief: moveBrief,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (upstreamRes.ok) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: true,
              status: 'delivered',
              referenceId,
              timestamp,
              deliveryEmail: mrkBusiness.enquiryEmail,
              message: `Your moving quote request has been delivered to ${mrkBusiness.enquiryEmail}.`,
              moveBrief,
              fallbackPhone: mrkBusiness.phoneDisplay,
              fallbackPhoneHref: mrkBusiness.phoneHref,
            })
          );
          return;
        }
      } catch (err) {
        console.error('Error forwarding to upstream webhook:', err);
      }
    }

    // 3. Honest validated preview format with direct one-click mailto & call fallback
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        ok: true,
        status: 'recorded_preview',
        referenceId,
        timestamp,
        deliveryEmail: mrkBusiness.enquiryEmail,
        message: `Quote details validated and formatted for ${mrkBusiness.enquiryEmail}. You can send your brief using the email button below or call ${mrkBusiness.phoneDisplay} directly.`,
        moveBrief,
        fallbackPhone: mrkBusiness.phoneDisplay,
        fallbackPhoneHref: mrkBusiness.phoneHref,
      })
    );
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        ok: false,
        status: 'server_error',
        message: `An unexpected error occurred. Please call ${mrkBusiness.phoneDisplay} directly.`,
        fallbackPhone: mrkBusiness.phoneDisplay,
        fallbackPhoneHref: mrkBusiness.phoneHref,
      })
    );
  }
}
