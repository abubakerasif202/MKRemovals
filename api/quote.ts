import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleQuoteRequest, readQuoteEnv } from '../src/lib/quote-delivery.js';

interface QuoteRequest extends IncomingMessage {
  body?: unknown;
}

const MAX_BODY_BYTES = 64 * 1024;

function send(res: ServerResponse, statusCode: number, body: Record<string, unknown>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req: QuoteRequest): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    return req.body;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer);
    size += buf.length;
    if (size > MAX_BODY_BYTES) return null;
    chunks.push(buf);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  } catch {
    return null;
  }
}

function clientIp(req: QuoteRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

/**
 * POST /api/quote — the single authoritative lead-submission endpoint.
 * Same-origin only: no CORS headers are emitted, so other sites cannot post through it from a browser.
 */
export default async function handler(req: QuoteRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    send(res, 405, { ok: false, status: 'bad_request', message: 'Method not allowed.' });
    return;
  }

  const body = await readBody(req);
  const result = await handleQuoteRequest({ body, ip: clientIp(req), env: readQuoteEnv() });
  send(res, result.statusCode, result.body);
}
