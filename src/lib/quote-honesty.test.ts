import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { handleQuoteRequest, createQuoteStore } from './quote-delivery';

const body = {
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
  estimatedSize: 'Not sure yet (described below)',
  attemptId: 'honesty-1',
  honeypotWebsite: '',
};

const accept = (async () => ({ ok: true, status: 200, json: async () => ({ success: true }) })) as unknown as typeof fetch;

test('a success response states provider acceptance and never claims inbox receipt', async () => {
  const res = await handleQuoteRequest({
    body,
    ip: '10.0.0.1',
    env: { WEB3FORMS_ACCESS_KEY: 'k' },
    fetchImpl: accept,
    store: createQuoteStore(),
    log: () => undefined,
  });
  assert.equal(res.body.status, 'delivered');
  assert.equal(res.body.acceptance, 'provider_accepted');
  assert.equal(res.body.inboxReceipt, 'unverified');
  assert.equal(res.body.provider, 'web3forms');
});

test('customer-facing success copy says "accepted" and offers a call fallback, not "received in inbox"', () => {
  const src = fs.readFileSync('src/components/forms/QuoteForm.tsx', 'utf-8');
  assert.match(src, /accepted by our email delivery service/);
  assert.match(src, /if you have not heard from us within one business day/);
  assert.doesNotMatch(src, /received (?:in|by)/i);
  assert.doesNotMatch(src, /DELIVERY CONFIRMED/);
});

import { submitBrowserQuote } from './quote-browser-client';
const dispatch = {
  ticket: 'signed-ticket', referenceId: 'MRK-2026-TEST1',
  payload: { access_key: '00000000-0000-4000-8000-000000000001', message: 'TEST — mocked transport only' },
};
test('browser success needs a positive provider acknowledgement and records only one email-producing call', async () => {
  const calls: string[] = [];
  const mock = (async (url: string) => { calls.push(url); return { ok: true, json: async () => ({ success: true }) }; }) as unknown as typeof fetch;
  const result = await submitBrowserQuote(dispatch, mock);
  assert.equal(result.confirmed, true);
  assert.deepEqual(calls, ['https://api.web3forms.com/submit', '/api/quote']);
});
test('browser provider rejection and malformed success responses never show success', async () => {
  for (const data of [{ success: false }, {}, { success: 'true' }]) {
    const mock = (async () => ({ ok: true, json: async () => data })) as unknown as typeof fetch;
    assert.equal((await submitBrowserQuote(dispatch, mock)).confirmed, false);
  }
});
test('browser network ambiguity is honest and never automatically resends', async () => {
  let sends = 0;
  const mock = (async (url: string) => {
    if (url.startsWith('https:')) { sends++; throw new Error('lost response'); }
    return { ok: true };
  }) as unknown as typeof fetch;
  const result = await submitBrowserQuote(dispatch, mock);
  assert.equal(result.confirmed, false);
  assert.equal(result.uncertain, true);
  assert.equal(sends, 1);
});
test('receipt bookkeeping failure does not convert provider acceptance into a retry or another send', async () => {
  let sends = 0;
  const mock = (async (url: string) => {
    if (url.startsWith('https:')) { sends++; return { ok: true, json: async () => ({ success: true }) }; }
    throw new Error('receipt unavailable');
  }) as unknown as typeof fetch;
  assert.equal((await submitBrowserQuote(dispatch, mock)).confirmed, true);
  assert.equal(sends, 1);
});
test('malformed browser dispatch cannot select a different endpoint or contact a provider', async () => {
  let called = false;
  const mock = (async () => { called = true; }) as unknown as typeof fetch;
  await assert.rejects(submitBrowserQuote({ ...dispatch, payload: { access_key: 'YOUR_ACCESS_KEY_HERE', message: 'test' } }, mock));
  assert.equal(called, false);
});
