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
