import test from 'node:test';
import assert from 'node:assert/strict';
import {
  handleQuoteRequest,
  createQuoteStore,
  RATE_LIMIT_MAX_REQUESTS,
  type QuoteEnv,
} from './quote-delivery';

const validBody = {
  fullName: 'Test Customer',
  phone: '0400 000 000',
  email: '',
  preferredContact: 'phone',
  pickupSuburb: 'Norwood',
  pickupAccess: 'single-storey-house',
  destinationSuburb: 'Glenelg',
  destinationAccess: 'single-storey-house',
  moveDate: '2030-01-01',
  dateFlexibility: 'exact-date',
  serviceType: 'house-removals',
  estimatedSize: '2 Bedroom Home / Apartment',
  attemptId: 'attempt-1',
  honeypotWebsite: '',
};

type Call = { url: string; body: any };

function mockFetch(handler: (url: string) => { ok: boolean; status: number; json: unknown } | 'throw') {
  const calls: Call[] = [];
  const impl = (async (url: string, init: { body: string }) => {
    calls.push({ url, body: JSON.parse(init.body) });
    const r = handler(url);
    if (r === 'throw') throw new Error('network down');
    return { ok: r.ok, status: r.status, json: async () => r.json };
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const silent = () => undefined;
const web3Env: QuoteEnv = { WEB3FORMS_ACCESS_KEY: 'test-key' };

test('delivered only when the provider confirms success', async () => {
  const { impl, calls } = mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));
  const res = await handleQuoteRequest({ body: validBody, ip: '1.1.1.1', env: web3Env, fetchImpl: impl, store: createQuoteStore(), log: silent });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.status, 'delivered');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.access_key, 'test-key');
});

test('provider rejection is never reported as success', async () => {
  const { impl } = mockFetch(() => ({ ok: false, status: 403, json: { success: false } }));
  const res = await handleQuoteRequest({ body: validBody, ip: '1.1.1.2', env: web3Env, fetchImpl: impl, store: createQuoteStore(), log: silent });
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.status, 'delivery_failed');
  assert.equal(res.body.fallbackPhone, '0423 653 342');
});

test('200 with success:false is not delivery', async () => {
  const { impl } = mockFetch(() => ({ ok: true, status: 200, json: { success: false } }));
  const res = await handleQuoteRequest({ body: validBody, ip: '1.1.1.3', env: web3Env, fetchImpl: impl, store: createQuoteStore(), log: silent });
  assert.equal(res.body.ok, false);
});

test('network failure is reported as failure, not preview success', async () => {
  const { impl } = mockFetch(() => 'throw');
  const res = await handleQuoteRequest({ body: validBody, ip: '1.1.1.4', env: web3Env, fetchImpl: impl, store: createQuoteStore(), log: silent });
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.ok, false);
});

test('no provider configured returns not_configured, never delivered', async () => {
  const { impl, calls } = mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));
  const res = await handleQuoteRequest({ body: validBody, ip: '1.1.1.5', env: {}, fetchImpl: impl, store: createQuoteStore(), log: silent });
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.status, 'not_configured');
  assert.equal(calls.length, 0);
});

test('fallback provider is used only after the primary fails (no duplicate delivery)', async () => {
  const both: QuoteEnv = { WEB3FORMS_ACCESS_KEY: 'k', RESEND_API_KEY: 'r' };
  const ok = mockFetch((url) =>
    url.includes('web3forms') ? { ok: true, status: 200, json: { success: true } } : { ok: true, status: 200, json: { id: 'x' } }
  );
  await handleQuoteRequest({ body: validBody, ip: '2.2.2.1', env: both, fetchImpl: ok.impl, store: createQuoteStore(), log: silent });
  assert.equal(ok.calls.length, 1, 'primary success must stop the chain');

  const failover = mockFetch((url) =>
    url.includes('web3forms') ? { ok: false, status: 500, json: {} } : { ok: true, status: 200, json: { id: 'abc' } }
  );
  const res = await handleQuoteRequest({ body: validBody, ip: '2.2.2.2', env: both, fetchImpl: failover.impl, store: createQuoteStore(), log: silent });
  assert.equal(res.body.status, 'delivered');
  assert.equal(failover.calls.length, 2);
});

test('retrying a delivered attempt does not send again (idempotency)', async () => {
  const store = createQuoteStore();
  const { impl, calls } = mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));
  const first = await handleQuoteRequest({ body: validBody, ip: '3.3.3.1', env: web3Env, fetchImpl: impl, store, log: silent });
  const second = await handleQuoteRequest({ body: validBody, ip: '3.3.3.1', env: web3Env, fetchImpl: impl, store, log: silent });
  assert.equal(calls.length, 1);
  assert.equal(second.body.deduplicated, true);
  assert.equal(second.body.referenceId, first.body.referenceId);
});

test('a failed attempt can be retried with the same attemptId', async () => {
  const store = createQuoteStore();
  let n = 0;
  const { impl, calls } = mockFetch(() => (n++ === 0 ? { ok: false, status: 500, json: {} } : { ok: true, status: 200, json: { success: true } }));
  const a = await handleQuoteRequest({ body: validBody, ip: '3.3.3.2', env: web3Env, fetchImpl: impl, store, log: silent });
  const b = await handleQuoteRequest({ body: validBody, ip: '3.3.3.2', env: web3Env, fetchImpl: impl, store, log: silent });
  assert.equal(a.body.ok, false);
  assert.equal(b.body.ok, true);
  assert.equal(calls.length, 2);
});

test('honeypot submissions are rejected without contacting any provider', async () => {
  const { impl, calls } = mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));
  const res = await handleQuoteRequest({ body: { ...validBody, honeypotWebsite: 'http://spam' }, ip: '4.4.4.1', env: web3Env, fetchImpl: impl, store: createQuoteStore(), log: silent });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.status, 'spam_rejected');
  assert.equal(calls.length, 0);
});

test('invalid input returns field errors and never reaches a provider', async () => {
  const { impl, calls } = mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));
  const res = await handleQuoteRequest({ body: { ...validBody, phone: 'abc' }, ip: '4.4.4.2', env: web3Env, fetchImpl: impl, store: createQuoteStore(), log: silent });
  assert.equal(res.statusCode, 400);
  assert.ok((res.body.errors as Record<string, string>).phone);
  assert.equal(calls.length, 0);
});

test('per-IP rate limiting engages after the configured maximum', async () => {
  const store = createQuoteStore();
  const { impl } = mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));
  let last = 0;
  for (let i = 0; i <= RATE_LIMIT_MAX_REQUESTS; i++) {
    const r = await handleQuoteRequest({ body: { ...validBody, attemptId: `a-${i}` }, ip: '5.5.5.5', env: web3Env, fetchImpl: impl, store, log: silent });
    last = r.statusCode;
  }
  assert.equal(last, 429);
});

test('audit log lines contain no customer PII', async () => {
  const lines: string[] = [];
  const { impl } = mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));
  await handleQuoteRequest({ body: { ...validBody, email: 'private@example.com' }, ip: '6.6.6.6', env: web3Env, fetchImpl: impl, store: createQuoteStore(), log: (e) => lines.push(JSON.stringify(e)) });
  const joined = lines.join('');
  assert.ok(!joined.includes('Test Customer'));
  assert.ok(!joined.includes('0400 000 000'));
  assert.ok(!joined.includes('private@example.com'));
});

// ---- Shared-store (serverless-safe) behaviour -------------------------------------------------
import { createRedisStore, withFallback, createMemoryStore } from './quote-store';

/** Minimal in-memory Redis speaking the Upstash REST dialect (INCR/EXPIRE/SET NX/GET/DEL). */
function fakeUpstash() {
  const kv = new Map<string, string>();
  const ttl = new Map<string, number>();
  const exec = (cmd: unknown[]): { result: unknown } => {
    const [op, key, ...rest] = cmd as string[];
    switch (op) {
      case 'INCR': {
        const n = Number(kv.get(key) ?? 0) + 1;
        kv.set(key, String(n));
        return { result: n };
      }
      case 'EXPIRE':
        if (!ttl.has(key)) ttl.set(key, 1);
        return { result: 1 };
      case 'GET':
        return { result: kv.get(key) ?? null };
      case 'DEL':
        return { result: kv.delete(key) ? 1 : 0 };
      case 'SET': {
        if (rest.includes('NX') && kv.has(key)) return { result: null };
        kv.set(key, rest[0]);
        return { result: 'OK' };
      }
      default:
        throw new Error(`unsupported ${op}`);
    }
  };
  let down = false;
  const impl = (async (url: string, init: { body: string }) => {
    if (down) throw new Error('redis unreachable');
    const body = JSON.parse(init.body);
    const out = url.endsWith('/pipeline') ? (body as unknown[][]).map(exec) : exec(body);
    return { ok: true, status: 200, json: async () => out };
  }) as unknown as typeof fetch;
  return { impl, setDown: (v: boolean) => (down = v), kv };
}

const okProvider = () => mockFetch(() => ({ ok: true, status: 200, json: { success: true } }));

test('a delivered attempt is deduplicated across separate serverless instances', async () => {
  const redis = fakeUpstash();
  const instanceA = createRedisStore('https://redis.example', 't', redis.impl);
  const instanceB = createRedisStore('https://redis.example', 't', redis.impl);
  const provider = okProvider();
  const first = await handleQuoteRequest({ body: validBody, ip: '9.9.9.1', env: web3Env, fetchImpl: provider.impl, store: instanceA, log: silent });
  const second = await handleQuoteRequest({ body: validBody, ip: '9.9.9.2', env: web3Env, fetchImpl: provider.impl, store: instanceB, log: silent });
  assert.equal(first.body.ok, true);
  assert.equal(second.body.deduplicated, true);
  assert.equal(provider.calls.length, 1, 'second instance must not send a second email');
});

test('the rate limit is shared across instances', async () => {
  const redis = fakeUpstash();
  const a = createRedisStore('https://redis.example', 't', redis.impl);
  const b = createRedisStore('https://redis.example', 't', redis.impl);
  const provider = okProvider();
  let last = 0;
  for (let i = 0; i <= RATE_LIMIT_MAX_REQUESTS; i++) {
    const store = i % 2 ? a : b;
    const r = await handleQuoteRequest({ body: { ...validBody, attemptId: `x-${i}` }, ip: '9.9.9.3', env: web3Env, fetchImpl: provider.impl, store, log: silent });
    last = r.statusCode;
  }
  assert.equal(last, 429);
});

test('an in-progress attempt on another instance is not sent twice', async () => {
  const redis = fakeUpstash();
  const a = createRedisStore('https://redis.example', 't', redis.impl);
  const b = createRedisStore('https://redis.example', 't', redis.impl);
  await a.claim('attempt-1'); // instance A is mid-send
  const provider = okProvider();
  const res = await handleQuoteRequest({ body: validBody, ip: '9.9.9.4', env: web3Env, fetchImpl: provider.impl, store: b, log: silent });
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.status, 'in_progress');
  assert.equal(provider.calls.length, 0);
});

test('Redis outage falls back to memory and never fakes delivery', async () => {
  const redis = fakeUpstash();
  redis.setDown(true);
  const store = withFallback(createRedisStore('https://redis.example', 't', redis.impl), createMemoryStore());
  const failing = mockFetch(() => ({ ok: false, status: 500, json: {} }));
  const bad = await handleQuoteRequest({ body: validBody, ip: '9.9.9.5', env: web3Env, fetchImpl: failing.impl, store, log: silent });
  assert.equal(bad.body.ok, false);
  assert.equal(bad.body.status, 'delivery_failed');
  const good = okProvider();
  const ok = await handleQuoteRequest({ body: validBody, ip: '9.9.9.5', env: web3Env, fetchImpl: good.impl, store, log: silent });
  assert.equal(ok.body.ok, true);
  assert.equal(good.calls.length, 1);
});

test('failure to record a confirmed delivery still reports delivered (the provider accepted it)', async () => {
  const store = createMemoryStore();
  store.setDelivered = async () => {
    throw new Error('store write failed');
  };
  const { impl } = okProvider();
  const res = await handleQuoteRequest({ body: validBody, ip: '9.9.9.6', env: web3Env, fetchImpl: impl, store, log: silent });
  assert.equal(res.body.ok, true);
});

test('redis keys never contain the raw client IP', async () => {
  const redis = fakeUpstash();
  const store = createRedisStore('https://redis.example', 't', redis.impl);
  await store.rateLimit('203.0.113.77', Date.now());
  for (const key of redis.kv.keys()) assert.ok(!key.includes('203.0.113.77'));
});

// Browser transport is required for Web3Forms public/free access keys.
const noProviderFetch = (async () => { throw new Error('Unexpected server provider call'); }) as typeof fetch;
const browserEnv: QuoteEnv = {
  WEB3FORMS_ACCESS_KEY: '00000000-0000-4000-8000-000000000001',
  WEB3FORMS_DELIVERY_MODE: 'browser',
  QUOTE_BROWSER_SIGNING_SECRET: 'test-signing-secret-with-at-least-32-characters',
};

test('browser preparation validates and reserves an attempt without sending email or claiming success', async () => {
  const store = createQuoteStore();
  const { impl, calls } = mockFetch(() => { throw new Error('Server must not contact Web3Forms'); });
  const result = await handleQuoteRequest({ body: validBody, ip: 'browser-1', env: browserEnv, fetchImpl: impl, store, log: silent });
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.status, 'browser_delivery_required');
  assert.equal(result.body.ok, false);
  assert.equal(calls.length, 0);
  const dispatch = result.body.browserDelivery as { ticket: string; payload: { access_key: string; message: string } };
  assert.equal(dispatch.payload.access_key, browserEnv.WEB3FORMS_ACCESS_KEY);
  assert.match(dispatch.payload.message, /Norwood/);
  assert.ok(dispatch.ticket);
  assert.equal(await store.getDelivered(validBody.attemptId), null);
  const concurrent = await handleQuoteRequest({ body: validBody, ip: 'browser-1', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  assert.equal(concurrent.statusCode, 409);
});

test('browser receipt deduplicates a reported acceptance without calling it server-confirmed delivery', async () => {
  const store = createQuoteStore();
  const prepare = await handleQuoteRequest({ body: validBody, ip: 'browser-2', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  const { ticket } = prepare.body.browserDelivery as { ticket: string };
  const result = await handleQuoteRequest({ body: { action: 'browser-result', ticket, accepted: true }, ip: 'browser-2', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  assert.equal(result.body.status, 'browser_report_recorded');
  assert.equal(result.body.acceptance, 'browser_reported');
  assert.equal((await store.getDelivered(validBody.attemptId))?.provider, 'web3forms-browser');
  const duplicate = await handleQuoteRequest({ body: validBody, ip: 'browser-2', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  assert.equal(duplicate.body.status, 'browser_already_reported');
  assert.equal(duplicate.body.ok, false);
});

test('a rejected browser dispatch releases its claim and allows retry with the same attempt id', async () => {
  const store = createQuoteStore();
  const prepare = await handleQuoteRequest({ body: validBody, ip: 'browser-3', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  const { ticket } = prepare.body.browserDelivery as { ticket: string };
  await handleQuoteRequest({ body: { action: 'browser-result', ticket, accepted: false }, ip: 'browser-3', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  assert.equal(await store.getDelivered(validBody.attemptId), null);
  const retry = await handleQuoteRequest({ body: validBody, ip: 'browser-3', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  assert.equal(retry.body.status, 'browser_delivery_required');
});

test('forged and expired browser receipts cannot mark an attempt accepted', async () => {
  const store = createQuoteStore();
  let clock = Date.now();
  const prepare = await handleQuoteRequest({ body: validBody, ip: 'browser-4', env: browserEnv, fetchImpl: noProviderFetch, store, now: () => clock, log: silent });
  const { ticket } = prepare.body.browserDelivery as { ticket: string };
  for (const value of ['forged', ticket.slice(0, -2) + 'XX']) {
    const bad = await handleQuoteRequest({ body: { action: 'browser-result', ticket: value, accepted: true }, ip: 'browser-4', env: browserEnv, fetchImpl: noProviderFetch, store, now: () => clock, log: silent });
    assert.equal(bad.statusCode, 400);
  }
  clock += 61_000;
  const expired = await handleQuoteRequest({ body: { action: 'browser-result', ticket, accepted: true }, ip: 'browser-4', env: browserEnv, fetchImpl: noProviderFetch, store, now: () => clock, log: silent });
  assert.equal(expired.statusCode, 400);
  assert.equal(await store.getDelivered(validBody.attemptId), null);
});

test('browser mode refuses missing signing configuration, invalid keys and spam before dispatch', async () => {
  const store = createQuoteStore();
  for (const env of [{ ...browserEnv, QUOTE_BROWSER_SIGNING_SECRET: undefined }, { ...browserEnv, WEB3FORMS_ACCESS_KEY: 'YOUR_ACCESS_KEY_HERE' }]) {
    const result = await handleQuoteRequest({ body: validBody, ip: 'browser-5', env, fetchImpl: noProviderFetch, store, log: silent });
    assert.equal(result.statusCode, 503);
    assert.equal(result.body.browserDelivery, undefined);
  }
  const spam = await handleQuoteRequest({ body: { ...validBody, honeypotWebsite: 'spam' }, ip: 'browser-5', env: browserEnv, fetchImpl: noProviderFetch, store, log: silent });
  assert.equal(spam.body.status, 'spam_rejected');
});

test('memory browser leases expire instead of blocking abandoned submissions forever', async () => {
  let clock = 1000;
  const store = createMemoryStore(() => clock);
  assert.equal(await store.claim('abandoned'), true);
  assert.equal(await store.claim('abandoned'), false);
  clock += 61_000;
  assert.equal(await store.claim('abandoned'), true);
});
