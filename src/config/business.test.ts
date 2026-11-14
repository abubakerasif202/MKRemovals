import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mrkBusiness,
  isValidAbnFormat,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from './business';
import { MRK_SERVICES } from '../content/services';
import { MRK_SERVICE_AREAS } from '../content/service-areas';
import { MRK_FAQS } from '../content/faqs';
import {
  resolveRouteSeo,
  generateSitemapXml,
  generateRobotsTxt,
  buildMovingCompanyJsonLd,
} from '../lib/seo';

test('MRK business identity matches exact owner-supplied specification', () => {
  assert.equal(mrkBusiness.brandName, 'MRK Removals Adelaide');
  assert.equal(mrkBusiness.ownerContactName.value, 'Mubashar Riaz');
  assert.equal(mrkBusiness.phoneDisplay, '0423 653 342');
  assert.equal(mrkBusiness.phoneHref, 'tel:+61423653342');
  assert.equal(mrkBusiness.domain, 'mrkremovalsadelaide.com.au');
  assert.equal(mrkBusiness.canonicalOrigin, 'https://mrkremovalsadelaide.com.au');
  assert.equal(mrkBusiness.bookingMode, 'quote-only');
});

test('Owner-supplied ABN 95 685 822 473 is preserved and passes 11-digit checksum format', () => {
  assert.equal(mrkBusiness.abn.value, '95 685 822 473');
  assert.equal(mrkBusiness.abn.approvalStatus, 'supplied');
  assert.equal(isValidAbnFormat(mrkBusiness.abn.value), true);
  assert.equal(isValidAbnFormat('12 345 678 901'), false);
});

test('Indicative hourly rate preserves AUD $130-$135 range with unconfirmed GST and package rules', () => {
  const rate = mrkBusiness.indicativeHourlyAUD.value;
  assert.equal(rate.min, 130);
  assert.equal(rate.max, 135);
  assert.equal(rate.currency, 'AUD');
  assert.equal(rate.unit, 'hour');
  assert.equal(rate.gst, 'unconfirmed');
  assert.equal(rate.package, 'unconfirmed');
  assert.equal(
    formatIndicativeRateHeadline(),
    'Indicative hourly rates: $130–$135. Request a quote for your move.'
  );
  assert.ok(getMandatoryRateDisclaimer().includes('confirm inclusions, minimums, travel charges and GST'));
});

test('Zero HF Removals or Noor Removals brand leakage across all content, config, and SEO outputs', () => {
  const serializedPayload = JSON.stringify({
    mrkBusiness,
    services: MRK_SERVICES,
    areas: MRK_SERVICE_AREAS,
    faqs: MRK_FAQS,
    homeSeo: resolveRouteSeo('/'),
    sitemap: generateSitemapXml(),
    robots: generateRobotsTxt(),
  });

  const forbiddenPatterns = [
    /hf\s*removals/i,
    /hfremovalsadelaide/i,
    /noor\s*removals/i,
    /noorremovals/i,
    /muhammad\s*rasheed/i,
    /20\s*prunus\s*ave/i,
    /elizabeth\s*vale\s*operations/i,
    /moving\s*made\s*easy\s*with\s*us/i,
  ];

  for (const pattern of forbiddenPatterns) {
    assert.equal(
      pattern.test(serializedPayload),
      false,
      `Forbidden reference identity pattern matched: ${pattern.toString()}`
    );
  }
});

test('Structured data omits unverified aggregateRating, review, priceRange, and PostalAddress', () => {
  const jsonLd = buildMovingCompanyJsonLd() as Record<string, unknown>;
  assert.equal(jsonLd.name, 'MRK Removals Adelaide');
  assert.equal(jsonLd.url, 'https://mrkremovalsadelaide.com.au');
  assert.equal('aggregateRating' in jsonLd, false);
  assert.equal('review' in jsonLd, false);
  assert.equal('priceRange' in jsonLd, false);
  assert.equal('address' in jsonLd, false);
});

test('All service and service-area slugs are unique and resolve valid SEO metadata', () => {
  const serviceSlugs = new Set(MRK_SERVICES.map((s) => s.slug));
  assert.equal(serviceSlugs.size, MRK_SERVICES.length);

  const areaSlugs = new Set(MRK_SERVICE_AREAS.map((a) => a.slug));
  assert.equal(areaSlugs.size, MRK_SERVICE_AREAS.length);

  for (const service of MRK_SERVICES) {
    const seo = resolveRouteSeo(`/services/${service.slug}`);
    assert.ok(seo.title.includes(service.title));
    assert.equal(seo.canonicalUrl, `https://mrkremovalsadelaide.com.au/services/${service.slug}`);
  }
});
