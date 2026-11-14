import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateQuoteSubmission, formatMoveBriefText, type QuoteFormInput } from './src/lib/quote-validation';
import { generateRobotsTxt, generateSitemapXml } from './src/lib/seo';
import { mrkBusiness } from './src/config/business';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory rate limiter and idempotency store (safe for preview & single-instance container)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const processedAttempts = new Map<string, { referenceId: string; status: string; timestamp: string }>();
const previewQuoteLedger: Array<{
  referenceId: string;
  receivedAt: string;
  pickupSuburb: string;
  destinationSuburb: string;
  serviceType: string;
  status: 'recorded_preview' | 'delivered';
}> = [];

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 10;

  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  // SEO endpoints
  app.get('/robots.txt', (_req, res) => {
    const isProdAuthorized = process.env.MRK_PRODUCTION_INDEXING === 'true';
    res.type('text/plain').send(generateRobotsTxt(isProdAuthorized));
  });

  app.get('/sitemap.xml', (_req, res) => {
    res.type('application/xml').send(generateSitemapXml());
  });

  // Quote system configuration status endpoint
  app.get('/api/quote/config', (_req, res) => {
    const providerConfigured = Boolean(
      process.env.MRK_QUOTE_PROVIDER_URL && process.env.MRK_QUOTE_PROVIDER_URL.trim().length > 0
    );
    res.json({
      brandName: mrkBusiness.brandName,
      bookingMode: mrkBusiness.bookingMode,
      providerConfigured,
      directPhoneDisplay: mrkBusiness.phoneDisplay,
      directPhoneHref: mrkBusiness.phoneHref,
      recentPreviewEnquiriesCount: previewQuoteLedger.length,
    });
  });

  // Quote submission endpoint (strictly adheres to AGENT.md Section 10)
  app.post('/api/quote', async (req, res) => {
    const clientIp =
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0]
        : req.socket.remoteAddress) || 'local';

    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        ok: false,
        status: 'rate_limited',
        message: `Too many quote attempts from this connection. Please wait a few minutes or call ${mrkBusiness.phoneDisplay} directly.`,
        fallbackPhone: mrkBusiness.phoneDisplay,
        fallbackPhoneHref: mrkBusiness.phoneHref,
      });
      return;
    }

    const validation = validateQuoteSubmission(req.body as Partial<QuoteFormInput>);
    if (!validation.valid || !validation.sanitized) {
      res.status(400).json({
        ok: false,
        status: 'validation_error',
        message: 'Please check the highlighted fields and try again.',
        errors: validation.errors,
        fallbackPhone: mrkBusiness.phoneDisplay,
        fallbackPhoneHref: mrkBusiness.phoneHref,
      });
      return;
    }

    const sanitized = validation.sanitized;

    // Idempotent duplicate check
    if (sanitized.attemptId && processedAttempts.has(sanitized.attemptId)) {
      const existing = processedAttempts.get(sanitized.attemptId)!;
      res.status(200).json({
        ok: true,
        status: existing.status,
        referenceId: existing.referenceId,
        timestamp: existing.timestamp,
        deduplicated: true,
        moveBrief: formatMoveBriefText(sanitized),
        fallbackPhone: mrkBusiness.phoneDisplay,
        fallbackPhoneHref: mrkBusiness.phoneHref,
      });
      return;
    }

    const referenceId = `MRK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();
    const moveBrief = formatMoveBriefText(sanitized);

    const providerUrl = process.env.MRK_QUOTE_PROVIDER_URL?.trim();

    if (providerUrl) {
      // Safety check: Never allow accidental routing to HF or Noor endpoints
      if (/hfremovals|noorremovals/i.test(providerUrl)) {
        res.status(500).json({
          ok: false,
          status: 'configuration_blocked',
          message: `External quote provider blocked by MRK brand isolation guard. Please call ${mrkBusiness.phoneDisplay} directly.`,
          fallbackPhone: mrkBusiness.phoneDisplay,
          fallbackPhoneHref: mrkBusiness.phoneHref,
        });
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
            enquiry: sanitized,
            formattedBrief: moveBrief,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!upstreamRes.ok) {
          res.status(502).json({
            ok: false,
            status: 'provider_error',
            message: `Our quote delivery service returned an error (HTTP ${upstreamRes.status}). Your form entries have been retained—please call ${mrkBusiness.phoneDisplay} directly.`,
            fallbackPhone: mrkBusiness.phoneDisplay,
            fallbackPhoneHref: mrkBusiness.phoneHref,
          });
          return;
        }

        if (sanitized.attemptId) {
          processedAttempts.set(sanitized.attemptId, {
            referenceId,
            status: 'delivered',
            timestamp,
          });
        }

        previewQuoteLedger.unshift({
          referenceId,
          receivedAt: timestamp,
          pickupSuburb: sanitized.pickupSuburb,
          destinationSuburb: sanitized.destinationSuburb,
          serviceType: sanitized.serviceType,
          status: 'delivered',
        });

        res.status(200).json({
          ok: true,
          status: 'delivered',
          referenceId,
          timestamp,
          message: 'Your moving quote request has been delivered to MRK Removals Adelaide.',
          moveBrief,
          fallbackPhone: mrkBusiness.phoneDisplay,
          fallbackPhoneHref: mrkBusiness.phoneHref,
        });
        return;
      } catch {
        res.status(504).json({
          ok: false,
          status: 'provider_timeout',
          message: `We could not confirm live delivery due to a network timeout. Your details are still in the form—please retry or call ${mrkBusiness.phoneDisplay}.`,
          fallbackPhone: mrkBusiness.phoneDisplay,
          fallbackPhoneHref: mrkBusiness.phoneHref,
        });
        return;
      }
    }

    // Honest preview behavior when MRK_QUOTE_PROVIDER_URL is not yet connected:
    // Record in preview session and return status: 'recorded_preview' (never falsely claiming live inbox delivery).
    if (sanitized.attemptId) {
      processedAttempts.set(sanitized.attemptId, {
        referenceId,
        status: 'recorded_preview',
        timestamp,
      });
    }

    previewQuoteLedger.unshift({
      referenceId,
      receivedAt: timestamp,
      pickupSuburb: sanitized.pickupSuburb,
      destinationSuburb: sanitized.destinationSuburb,
      serviceType: sanitized.serviceType,
      status: 'recorded_preview',
    });

    res.status(200).json({
      ok: true,
      status: 'recorded_preview',
      referenceId,
      timestamp,
      message:
        'Quote details validated and formatted in preview mode. Because live email delivery awaits owner inbox activation, please call 0423 653 342 with your Move Brief below for immediate scheduling.',
      moveBrief,
      fallbackPhone: mrkBusiness.phoneDisplay,
      fallbackPhoneHref: mrkBusiness.phoneHref,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MRK Removals Adelaide server running on http://localhost:${PORT}`);
  });
}

createServer();
