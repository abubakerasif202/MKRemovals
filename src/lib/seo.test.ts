import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveRouteSeo,
  generateRobotsTxt,
  generateSitemapXml,
  buildCanonicalUrl,
  APPROVED_PUBLIC_CANONICAL_PATHS,
  RESTRICTED_NON_INDEXABLE_PATHS,
  getRobotsDirectiveForRoute,
  isApprovedPublicRoute,
} from './seo';
import { mrkBusiness } from '../config/business';
import { MRK_SERVICES } from '../content/services';
import { MRK_SERVICE_AREAS } from '../content/service-areas';

test('Default safe preview mode: all routes return noindex, nofollow', () => {
  // Safe preview mode when production indexing is NOT authorized
  const homeSeo = resolveRouteSeo('/', false);
  assert.equal(homeSeo.robots, 'noindex, nofollow');

  const servicesSeo = resolveRouteSeo('/services', false);
  assert.equal(servicesSeo.robots, 'noindex, nofollow');

  const houseRemovalsSeo = resolveRouteSeo('/services/house-removals', false);
  assert.equal(houseRemovalsSeo.robots, 'noindex, nofollow');

  const areaSeo = resolveRouteSeo('/service-areas/adelaide-cbd-park-lands', false);
  assert.equal(areaSeo.robots, 'noindex, nofollow');

  const pricingSeo = resolveRouteSeo('/pricing', false);
  assert.equal(pricingSeo.robots, 'noindex, nofollow');

  const quoteSeo = resolveRouteSeo('/quote', false);
  assert.equal(quoteSeo.robots, 'noindex, nofollow');

  const previewRobotsTxt = generateRobotsTxt(false);
  assert.ok(previewRobotsTxt.includes('Disallow: /'));
  assert.equal(previewRobotsTxt.includes('Allow: /'), false);
});

test('Authorized production mode: genuine public routes become index, follow', () => {
  for (const path of APPROVED_PUBLIC_CANONICAL_PATHS) {
    const seo = resolveRouteSeo(path, true);
    assert.equal(
      seo.robots,
      'index, follow',
      `Expected approved route ${path} to be index, follow in production mode`
    );
  }
});

test('Restricted routes protection: legal drafts, 404s, and unknown paths remain noindex, nofollow even in production mode', () => {
  // Unapproved legal drafts
  const privacySeo = resolveRouteSeo('/privacy', true);
  assert.equal(privacySeo.robots, 'noindex, nofollow');

  const termsSeo = resolveRouteSeo('/terms', true);
  assert.equal(termsSeo.robots, 'noindex, nofollow');

  // 404 and unknown routes
  const notFoundSeo = resolveRouteSeo('/404', true);
  assert.equal(notFoundSeo.robots, 'noindex, nofollow');

  const randomSeo = resolveRouteSeo('/some-random-unknown-endpoint', true);
  assert.equal(randomSeo.robots, 'noindex, nofollow');

  // Internal API paths
  assert.equal(getRobotsDirectiveForRoute('/api/quote', true), 'noindex, nofollow');
  assert.equal(getRobotsDirectiveForRoute('/api/quote/config', true), 'noindex, nofollow');
});

test('Production robots.txt allows public routes while explicitly protecting drafts and APIs', () => {
  const prodRobotsTxt = generateRobotsTxt(true);
  assert.ok(prodRobotsTxt.includes('Allow: /'));
  assert.ok(prodRobotsTxt.includes('Disallow: /api/'));
  assert.ok(prodRobotsTxt.includes('Disallow: /privacy'));
  assert.ok(prodRobotsTxt.includes('Disallow: /terms'));
  assert.ok(prodRobotsTxt.includes('Disallow: /404'));
  assert.ok(prodRobotsTxt.includes(`Sitemap: ${mrkBusiness.canonicalOrigin}/sitemap.xml`));
});

test('Canonical URL integrity: every approved route has its own unique canonical URL', () => {
  const canonicalSet = new Set<string>();

  for (const path of APPROVED_PUBLIC_CANONICAL_PATHS) {
    const seo = resolveRouteSeo(path, false);
    const expectedCanonical = buildCanonicalUrl(path);

    assert.equal(
      seo.canonicalUrl,
      expectedCanonical,
      `Canonical URL mismatch for path ${path}`
    );

    if (path !== '/') {
      assert.notEqual(
        seo.canonicalUrl,
        mrkBusiness.canonicalOrigin,
        `Path ${path} must not inherit root canonical origin`
      );
    }

    assert.equal(
      canonicalSet.has(seo.canonicalUrl),
      false,
      `Duplicate canonical URL detected: ${seo.canonicalUrl}`
    );
    canonicalSet.add(seo.canonicalUrl);
  }

  // Exactly 21 approved canonical pages (1 home + 1 services index + 6 services + 1 areas index + 7 areas + 1 pricing + 1 about + 1 contact + 1 quote + 1 faq)
  assert.equal(canonicalSet.size, 21);
});

test('XML Sitemap contains only approved public canonical indexable routes and excludes drafts', () => {
  const sitemapXml = generateSitemapXml();

  assert.ok(sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(sitemapXml.includes('<urlset'));
  assert.ok(sitemapXml.includes('</urlset>'));

  // Must include all approved canonical public routes
  for (const path of APPROVED_PUBLIC_CANONICAL_PATHS) {
    const loc = buildCanonicalUrl(path);
    assert.ok(
      sitemapXml.includes(`<loc>${loc}</loc>`),
      `Expected sitemap to contain approved route: ${loc}`
    );
  }

  // Must NOT include draft policies, 404, or internal APIs
  for (const restricted of RESTRICTED_NON_INDEXABLE_PATHS) {
    const loc = buildCanonicalUrl(restricted);
    assert.equal(
      sitemapXml.includes(`<loc>${loc}</loc>`),
      false,
      `Sitemap must never contain restricted draft or 404 route: ${loc}`
    );
  }

  assert.equal(sitemapXml.includes('/api/'), false);
});
