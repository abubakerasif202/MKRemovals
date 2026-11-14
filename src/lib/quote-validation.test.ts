import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateQuoteSubmission,
  isValidAustralianPhone,
  isValidEmailAddress,
  formatMoveBriefText,
} from './quote-validation';

test('required_field_error: rejects empty quote submission with clear field errors', () => {
  const result = validateQuoteSubmission({});
  assert.equal(result.valid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.pickupSuburb);
  assert.ok(result.errors.destinationSuburb);
  assert.ok(result.errors.moveDate);
});

test('phone_format: validates domestic and E.164 Australian phone numbers', () => {
  assert.equal(isValidAustralianPhone('0423 653 342'), true);
  assert.equal(isValidAustralianPhone('0423653342'), true);
  assert.equal(isValidAustralianPhone('+61 423 653 342'), true);
  assert.equal(isValidAustralianPhone('+61423653342'), true);
  assert.equal(isValidAustralianPhone('08 8123 4567'), true);
  assert.equal(isValidAustralianPhone('12345'), false);
  assert.equal(isValidAustralianPhone('abc-def-ghij'), false);
});

test('invalid_email: rejects malformed email addresses and requires email when preferredContact is email', () => {
  assert.equal(isValidEmailAddress('client@domain.com.au'), true);
  assert.equal(isValidEmailAddress('invalid-email'), false);

  const missingEmailWhenPreferred = validateQuoteSubmission({
    fullName: 'Sarah Jenkins',
    phone: '0412 345 678',
    email: '',
    preferredContact: 'email',
    pickupSuburb: 'Norwood 5067',
    destinationSuburb: 'Unley 5061',
    moveDate: '2026-12-01',
    dateFlexibility: 'exact-date',
  });
  assert.equal(missingEmailWhenPreferred.valid, false);
  assert.ok(missingEmailWhenPreferred.errors.email);
});

test('optional_details & valid submission: sanitizes inputs and formats Move Brief cleanly', () => {
  const validPayload = validateQuoteSubmission({
    fullName: 'Alex Mercer',
    phone: '0423 653 342',
    email: 'alex@example.com.au',
    preferredContact: 'phone',
    pickupSuburb: 'North Adelaide 5006',
    pickupAccess: 'apartment-with-lift',
    destinationSuburb: 'Burnside 5066',
    destinationAccess: 'two-storey-house',
    moveDate: '2026-12-10',
    dateFlexibility: 'flexible-3-days',
    serviceType: 'apartment-strata-moves',
    estimatedSize: '2 Bedroom Apartment',
    stairsOrLiftDetails: 'Reserved service lift 9am-12pm',
    packingRequired: true,
    disassemblyRequired: true,
    heavyItemsNotes: 'Solid oak dining table',
    inventoryNotes: 'Approx 25 boxes, queen bed, 3-seater sofa, fridge',
  });

  assert.equal(validPayload.valid, true);
  assert.equal(Object.keys(validPayload.errors).length, 0);
  assert.ok(validPayload.sanitized);

  const brief = formatMoveBriefText(validPayload.sanitized!);
  assert.ok(brief.includes('MRK REMOVALS ADELAIDE'));
  assert.ok(brief.includes('0423 653 342'));
  assert.ok(brief.includes('North Adelaide 5006'));
  assert.ok(brief.includes('Burnside 5066'));
  assert.ok(brief.includes('AUD $130–$135/hr'));
});

test('anti-spam honeypot: rejects submissions that fill hidden honeypotWebsite field', () => {
  const spamAttempt = validateQuoteSubmission({
    fullName: 'Spam Bot',
    phone: '0423 653 342',
    pickupSuburb: 'Adelaide',
    destinationSuburb: 'Glenelg',
    moveDate: '2026-12-01',
    honeypotWebsite: 'https://spam-link.example',
  });
  assert.equal(spamAttempt.valid, false);
  assert.equal(spamAttempt.isSpam, true);
});
