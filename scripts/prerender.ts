import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import {
  APPROVED_PUBLIC_CANONICAL_PATHS,
  RESTRICTED_NON_INDEXABLE_PATHS,
  resolveRouteSeo,
  generateRobotsTxt,
  generateSitemapXml,
  isProductionIndexingEnabled,
} from '../src/lib/seo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const publicDir = path.resolve(projectRoot, 'public');

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

async function prerender() {
  const isProdAuthorized = isProductionIndexingEnabled();
  console.log(`[SEO Prerender] Starting static HTML generation...`);
  console.log(`[SEO Prerender] Production Indexing Authorized: ${isProdAuthorized}`);

  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`dist/index.html not found. Please run 'vite build' before prerendering.`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // 1. Write robots.txt and sitemap.xml to both dist/ and public/
  const robotsContent = generateRobotsTxt(isProdAuthorized);
  const sitemapContent = generateSitemapXml();

  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  console.log(`[SEO Prerender] Wrote robots.txt and sitemap.xml`);

  // 2. Collect all routes to render
  const routesToRender = [
    ...APPROVED_PUBLIC_CANONICAL_PATHS,
    ...RESTRICTED_NON_INDEXABLE_PATHS,
  ];

  let renderedCount = 0;

  for (const route of routesToRender) {
    const seo = resolveRouteSeo(route, isProdAuthorized);
    const appHtml = renderToString(
      React.createElement(App as React.ComponentType<{ initialPath?: string }>, { initialPath: route })
    );

    let pageHtml = template;

    // Replace Title
    pageHtml = pageHtml.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeXml(seo.title)}</title>`
    );

    // Replace Meta Description
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="description" content="${escapeXml(seo.description)}" />`
    );

    // Replace Canonical Link
    pageHtml = pageHtml.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
      `<link rel="canonical" href="${seo.canonicalUrl}" />`
    );

    // Replace Robots Directive
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="robots" content="${seo.robots}" />`
    );

    // Replace OpenGraph Title & Description & URL & Type
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:title" content="${escapeXml(seo.title)}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:description" content="${escapeXml(seo.description)}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:url" content="${seo.canonicalUrl}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:type" content="${seo.ogType}" />`
    );

    // Replace Twitter Title & Description
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeXml(seo.title)}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeXml(seo.description)}" />`
    );

    // Inject Route JSON-LD structured data before </head>
    const jsonLdTag = `\n    <script type="application/ld+json">${JSON.stringify(
      seo.jsonLd
    )}</script>\n  </head>`;
    pageHtml = pageHtml.replace(/<\/head>/i, jsonLdTag);

    // Replace Root element with SSR pre-rendered content
    pageHtml = pageHtml.replace(
      /<div id=["']root["']>[\s\S]*?<\/div>/i,
      `<div id="root">${appHtml}</div>`
    );

    // Determine destination file paths
    if (route === '/') {
      const targetPath = path.join(distDir, 'index.html');
      fs.writeFileSync(targetPath, pageHtml, 'utf-8');
    } else if (route === '/404') {
      const targetPath = path.join(distDir, '404.html');
      fs.writeFileSync(targetPath, pageHtml, 'utf-8');
    } else {
      const cleanSubDir = route.replace(/^\/+/, '');
      const fullDir = path.join(distDir, cleanSubDir);
      if (!fs.existsSync(fullDir)) {
        fs.mkdirSync(fullDir, { recursive: true });
      }
      // 1. Directory index: dist/<route>/index.html
      const dirIndexPath = path.join(fullDir, 'index.html');
      fs.writeFileSync(dirIndexPath, pageHtml, 'utf-8');

      // 2. Direct clean URL file: dist/<route>.html (for static cleanUrl hosting)
      const cleanHtmlPath = path.join(distDir, `${cleanSubDir}.html`);
      const parentDir = path.dirname(cleanHtmlPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(cleanHtmlPath, pageHtml, 'utf-8');
    }

    renderedCount++;
  }

  console.log(
    `[SEO Prerender] ✓ Successfully generated ${renderedCount} static route HTML pages.`
  );
}

prerender().catch((err) => {
  console.error('[SEO Prerender] Error during prerendering:', err);
  process.exit(1);
});
