import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resolveIndexingAuthorized, generateRobotsTxt, generateSitemapXml, resolveRouteSeo, getAllCanonicalPaths, buildCanonicalUrl } from './seo';
import { verifyDist, pageFileFor } from '../../scripts/verify-seo';

test('production host is always indexable, even with no env or a hostile env', () => {
  for (const host of ['mrkremovalsadelaide.com.au', 'www.mrkremovalsadelaide.com.au', 'MRKRemovalsAdelaide.com.au']) {
    assert.equal(resolveIndexingAuthorized({ host, env: {} }), true, host);
    assert.equal(resolveIndexingAuthorized({ host, env: { VERCEL_ENV: 'preview', MRK_PREVIEW_ONLY: 'true' } }), true, host);
  }
});

test('non-production hosts are noindex', () => {
  for (const host of ['mkremovals-git-x.vercel.app', 'localhost', '127.0.0.1', 'mrkremovalsadelaide.com.au.evil.com']) {
    assert.equal(resolveIndexingAuthorized({ host, env: { VERCEL_ENV: 'production' } }), false, host);
  }
});

test('build-time: VERCEL_ENV decides; preview and unset stay noindex; production indexes without any MRK flag', () => {
  assert.equal(resolveIndexingAuthorized({ env: { VERCEL_ENV: 'production' } }), true);
  assert.equal(resolveIndexingAuthorized({ env: { VERCEL_ENV: 'preview' } }), false);
  assert.equal(resolveIndexingAuthorized({ env: { VERCEL_ENV: 'preview', MRK_PRODUCTION_INDEXING: 'true' } }), false);
  assert.equal(resolveIndexingAuthorized({ env: {} }), false);
  assert.equal(resolveIndexingAuthorized({ env: { MRK_PRODUCTION_INDEXING: 'true' } }), true);
  assert.equal(resolveIndexingAuthorized({ env: { VERCEL_ENV: 'production', MRK_PREVIEW_ONLY: 'true' } }), false);
});

test('every sitemap URL is index,follow with a self-canonical on the apex origin in production', () => {
  const paths = getAllCanonicalPaths();
  assert.equal(paths.length, 21);
  for (const p of paths) {
    const seo = resolveRouteSeo(p, true);
    assert.equal(seo.robots, 'index, follow', p);
    assert.equal(seo.canonicalUrl, buildCanonicalUrl(p), p);
    assert.match(seo.canonicalUrl, /^https:\/\/mrkremovalsadelaide\.com\.au(\/|$)/, p);
    assert.doesNotMatch(seo.canonicalUrl, /www\.|vercel\.app/, p);
  }
});

test('production robots.txt blocks no sitemap URL; preview robots.txt disallows everything', () => {
  const prod = generateRobotsTxt(true);
  const disallows = prod.split('\n').flatMap((l) => l.match(/^Disallow:\s*(\S+)/)?.[1] ?? []);
  for (const p of getAllCanonicalPaths()) {
    assert.equal(disallows.some((d) => p.startsWith(d)), false, `${p} blocked by robots.txt`);
  }
  assert.match(generateRobotsTxt(false), /^Disallow: \/$/m);
  assert.doesNotMatch(generateRobotsTxt(false), /^Allow:/m);
});

test('vercel.json: noindex header only on non-production hosts; robots.txt rewritten by host', () => {
  const cfg = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../../vercel.json'), 'utf-8'));
  const entry = cfg.headers.find((h: any) => h.headers.some((x: any) => x.key === 'X-Robots-Tag'));
  assert.ok(entry, 'X-Robots-Tag header entry missing');
  assert.equal(entry.has, undefined);
  const rule = new RegExp(entry.missing[0].value);
  assert.equal(rule.test('mrkremovalsadelaide.com.au'), true);
  assert.equal(rule.test('www.mrkremovalsadelaide.com.au'), true);
  assert.equal(rule.test('mkremovals-abc.vercel.app'), false);
  const robotsRules = cfg.rewrites.filter((r: any) => r.source === '/robots.txt');
  assert.equal(robotsRules[0].destination, '/robots.production.txt');
  assert.equal(robotsRules[1].destination, '/robots.preview.txt');
});

function writeFixture(homeRobots: string): string {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'mrk-dist-'));
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), generateSitemapXml());
  fs.writeFileSync(path.join(dist, 'robots.production.txt'), generateRobotsTxt(true));
  fs.writeFileSync(path.join(dist, 'robots.preview.txt'), generateRobotsTxt(false));
  for (const p of getAllCanonicalPaths()) {
    const file = pageFileFor(dist, p);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const robots = p === '/' ? homeRobots : 'index, follow';
    fs.writeFileSync(file, `<head><meta name="robots" content="${robots}" /><link rel="canonical" href="${buildCanonicalUrl(p)}" /></head>`);
  }
  return dist;
}

test('build guard FAILS a production build whose homepage ships noindex, and passes a clean one', () => {
  const bad = writeFixture('noindex, nofollow');
  const good = writeFixture('index, follow');
  try {
    const failures = verifyDist(bad, true);
    assert.ok(failures.some((e) => e.includes('meta robots is "noindex, nofollow"')), failures.join('\n'));
    assert.deepEqual(verifyDist(good, true), []);
  } finally {
    fs.rmSync(bad, { recursive: true, force: true });
    fs.rmSync(good, { recursive: true, force: true });
  }
});

test('build guard FAILS when a shadowing dist/robots.txt exists', () => {
  const dist = writeFixture('index, follow');
  try {
    fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /');
    assert.ok(verifyDist(dist, true).some((e) => e.includes('dist/robots.txt must not exist')));
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});
