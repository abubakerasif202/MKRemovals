/**
 * Build-time SEO guard. Runs after prerender and FAILS the build when the output
 * contradicts the indexing mode the environment resolved to.
 *
 *   production mode (VERCEL_ENV=production, or MRK_EXPECT_INDEXABLE=true):
 *     every sitemap URL must be `index, follow`, self-canonical on the canonical origin,
 *     and not disallowed by robots.production.txt.
 *   preview mode: every page must be `noindex, nofollow`; robots.preview.txt must disallow all.
 *
 * `MRK_EXPECT_INDEXABLE=true` lets an off-Vercel build (e.g. `vercel build --prebuilt`) assert
 * production output even when VERCEL_ENV is not set.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mrkBusiness } from '../src/config/business';
import { resolveIndexingAuthorized } from '../src/lib/seo';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

export function pageFileFor(dist: string, pathname: string): string {
  return pathname === '/'
    ? path.join(dist, 'index.html')
    : path.join(dist, `${pathname.replace(/^\/+/, '')}.html`);
}

export function readMetaRobots(html: string): string | undefined {
  return html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i)?.[1];
}

export function readCanonical(html: string): string | undefined {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i)?.[1];
}

function robotsDisallows(robotsTxt: string, pathname: string): boolean {
  return robotsTxt
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*Disallow:\s*(\S+)/i)?.[1])
    .filter((v): v is string => Boolean(v))
    .some((rule) => pathname.startsWith(rule));
}

export function verifyDist(dist: string, indexable: boolean, vercelJsonPath = path.join(root, 'vercel.json')): string[] {
  const errors: string[] = [];
  const read = (p: string) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : undefined);

  const sitemap = read(path.join(dist, 'sitemap.xml'));
  if (!sitemap) return [`dist/sitemap.xml is missing`];
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) errors.push('sitemap.xml contains no <loc> entries');

  const productionRobots = read(path.join(dist, 'robots.production.txt'));
  const previewRobots = read(path.join(dist, 'robots.preview.txt'));
  if (!productionRobots) errors.push('dist/robots.production.txt is missing');
  if (!previewRobots) errors.push('dist/robots.preview.txt is missing');
  if (fs.existsSync(path.join(dist, 'robots.txt'))) {
    errors.push('dist/robots.txt must not exist (it would shadow the host-based rewrite in vercel.json)');
  }
  if (previewRobots && !/^\s*Disallow:\s*\/\s*$/im.test(previewRobots)) {
    errors.push('robots.preview.txt must contain "Disallow: /"');
  }
  if (productionRobots && /^\s*Disallow:\s*\/\s*$/im.test(productionRobots)) {
    errors.push('robots.production.txt must not contain "Disallow: /"');
  }
  if (productionRobots && !productionRobots.includes(`Sitemap: ${mrkBusiness.canonicalOrigin}/sitemap.xml`)) {
    errors.push('robots.production.txt must reference the canonical sitemap');
  }

  const expectedRobots = indexable ? 'index, follow' : 'noindex, nofollow';
  for (const loc of locs) {
    if (!loc.startsWith(`${mrkBusiness.canonicalOrigin}/`) && loc !== mrkBusiness.canonicalOrigin) {
      errors.push(`sitemap URL is off the canonical origin: ${loc}`);
      continue;
    }
    const pathname = new URL(loc).pathname;
    const file = pageFileFor(dist, pathname);
    const html = read(file);
    if (!html) {
      errors.push(`${loc}: prerendered file missing (${path.relative(root, file)})`);
      continue;
    }
    const robots = readMetaRobots(html);
    if (robots !== expectedRobots) errors.push(`${loc}: meta robots is "${robots}", expected "${expectedRobots}"`);
    const canonical = readCanonical(html);
    if (canonical !== loc) errors.push(`${loc}: canonical is "${canonical}", expected self-canonical`);
    if (productionRobots && robotsDisallows(productionRobots, pathname)) {
      errors.push(`${loc}: sitemap URL is blocked by robots.production.txt`);
    }
  }

  const vercelJson = read(vercelJsonPath);
  if (vercelJson) {
    const cfg = JSON.parse(vercelJson) as {
      headers?: { missing?: { type: string }[]; headers?: { key: string; value: string }[] }[];
      rewrites?: { source: string; destination: string }[];
    };
    const previewHeader = cfg.headers?.find(
      (h) => h.missing?.some((m) => m.type === 'host') && h.headers?.some((x) => x.key === 'X-Robots-Tag' && /noindex/.test(x.value)),
    );
    if (!previewHeader) errors.push('vercel.json: missing host-conditional X-Robots-Tag noindex header for non-production hosts');
    const unconditional = cfg.headers?.some((h) => !h.missing && h.headers?.some((x) => x.key === 'X-Robots-Tag'));
    if (unconditional) errors.push('vercel.json: unconditional X-Robots-Tag header would apply to production');
  }
  return errors;
}

function main() {
  const env = process.env;
  const indexable = env.MRK_EXPECT_INDEXABLE === 'true' || resolveIndexingAuthorized({ env });
  console.log(`[SEO Verify] Expecting ${indexable ? 'index, follow (production)' : 'noindex, nofollow (preview)'}`);
  const errors = verifyDist(distDir, indexable);
  if (errors.length > 0) {
    console.error(`[SEO Verify] FAILED with ${errors.length} problem(s):\n - ${errors.join('\n - ')}`);
    process.exit(1);
  }
  console.log('[SEO Verify] OK');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
