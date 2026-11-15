import test from 'node:test';
import assert from 'node:assert/strict';
import { createRedisStore, hashIp, RATE_LIMIT_MAX_REQUESTS, DELIVERED_TTL_SECONDS } from './quote-store';
import { handleQuoteRequest, type QuoteEnv } from './quote-delivery';

/**
 * Opt-in integration test against a REAL Redis (Upstash REST). It never contacts an email provider:
 * the provider is a local mock. Run with:
 *   MRK_REDIS_TEST_URL=... MRK_REDIS_TEST_TOKEN=... npm run test:redis
 * Without those variables the whole file is skipped (so CI and normal runs never touch Redis).
 */
const URL_ = process.env.MRK_REDIS_TEST_URL;
const TOKEN = process.env.MRK_REDIS_TEST_TOKEN;
const skip = !URL_ || !TOKEN;

async function raw(cmd: unknown[]) {
  const res = await fetch(URL_!, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(cmd) });
  return ((await res.json()) as { result: unknown }).result;
}

const body = (attemptId: string) => ({
  fullName: 'Integration Test',
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
  estimatedSize: 'Not sure yet (described below)',
  attemptId,
  honeypotWebsite: '',
});

function mockProvider() {
  let calls = 0;
  const impl = (async () => {
    calls += 1;
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  }) as unknown as typeof fetch;
  return { impl, count: () => calls };
}

const env: QuoteEnv = { WEB3FORMS_ACCESS_KEY: 'mock-key' };
const silent = () => undefined;
const uniq = () => `it-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

test('REAL REDIS: dedupe across two independent store instances sends exactly one email', { skip }, async () => {
  const a = createRedisStore(URL_!, TOKEN!);
  const b = createRedisStore(URL_!, TOKEN!);
  const id = uniq();
  const provider = mockProvider();
  try {
    const first = await handleQuoteRequest({ body: body(id), ip: `203.0.113.${Math.floor(Math.random() * 200)}`, env, fetchImpl: provider.impl, store: a, log: silent });
    const second = await handleQuoteRequest({ body: body(id), ip: `198.51.100.${Math.floor(Math.random() * 200)}`, env, fetchImpl: provider.impl, store: b, log: silent });
    assert.equal(first.body.status, 'delivered');
    assert.equal(first.body.inboxReceipt, 'unverified');
    assert.equal(second.body.deduplicated, true);
    assert.equal(provider.count(), 1);
    const ttl = Number(await raw(['TTL', `mrk:done:${id}`]));
    assert.ok(ttl > 0 && ttl <= DELIVERED_TTL_SECONDS, `idempotency record must expire (ttl=${ttl})`);
  } finally {
    await raw(['DEL', `mrk:done:${id}`, `mrk:claim:${id}`]);
  }
});

test('REAL REDIS: rate limit is shared across instances and the window expires', { skip }, async () => {
  const a = createRedisStore(URL_!, TOKEN!);
  const b = createRedisStore(URL_!, TOKEN!);
  const ip = `192.0.2.${Math.floor(Math.random() * 250)}-${uniq()}`;
  const provider = mockProvider();
  const ids: string[] = [];
  let last = 0;
  try {
    for (let i = 0; i <= RATE_LIMIT_MAX_REQUESTS; i++) {
      const id = uniq();
      ids.push(id);
      const r = await handleQuoteRequest({ body: body(id), ip, env, fetchImpl: provider.impl, store: i % 2 ? a : b, log: silent });
      last = r.statusCode;
    }
    assert.equal(last, 429);
    const ttl = Number(await raw(['TTL', `mrk:rl:${hashIp(ip)}`]));
    assert.ok(ttl > 0 && ttl <= 600, `rate-limit window must expire (ttl=${ttl})`);
  } finally {
    await raw(['DEL', `mrk:rl:${hashIp(ip)}`, ...ids.map((i) => `mrk:done:${i}`), ...ids.map((i) => `mrk:claim:${i}`)]);
  }
});

test('REAL REDIS: an attempt claimed by another instance is not sent, then succeeds once released', { skip }, async () => {
  const a = createRedisStore(URL_!, TOKEN!);
  const b = createRedisStore(URL_!, TOKEN!);
  const id = uniq();
  const provider = mockProvider();
  const ip = `203.0.113.${Math.floor(Math.random() * 200)}-${uniq()}`;
  try {
    assert.equal(await a.claim(id), true);
    assert.equal(await b.claim(id), false, 'second claim must lose (SET NX)');
    const blocked = await handleQuoteRequest({ body: body(id), ip, env, fetchImpl: provider.impl, store: b, log: silent });
    assert.equal(blocked.statusCode, 409);
    assert.equal(provider.count(), 0);
    await a.release(id);
    const ok = await handleQuoteRequest({ body: body(id), ip, env, fetchImpl: provider.impl, store: b, log: silent });
    assert.equal(ok.body.status, 'delivered');
    assert.equal(provider.count(), 1);
  } finally {
    await raw(['DEL', `mrk:rl:${hashIp(ip)}`, `mrk:done:${id}`, `mrk:claim:${id}`]);
  }
});

test('REAL REDIS: claim lock expires on its own (crashed instance cannot block a retry forever)', { skip }, async () => {
  const a = createRedisStore(URL_!, TOKEN!);
  const id = uniq();
  try {
    assert.equal(await a.claim(id), true);
    const ttl = Number(await raw(['TTL', `mrk:claim:${id}`]));
    assert.ok(ttl > 0 && ttl <= 60, `claim must carry a TTL (ttl=${ttl})`);
  } finally {
    await raw(['DEL', `mrk:claim:${id}`]);
  }
});
