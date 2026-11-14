# Exporting & Migrating MRK Removals Adelaide to Next.js App Router

This interactive preview runs on Google AI Studio's native **React 19 + TypeScript + Tailwind CSS v4 + Express (`server.ts`)** stack on port 3000. Every module has been architected with clean separation between **config**, **content**, **validation/SEO logic**, and **UI components** so it maps 1:1 to a standalone **Next.js 15/16 App Router** repository.

## 1. Direct Directory Mapping

| Current AI Studio Path | Target Next.js App Router Path | Notes |
| :--- | :--- | :--- |
| `src/config/business.ts` | `config/business.ts` | Zero changes required. Pure TypeScript single source of truth. |
| `src/content/services.ts` | `content/services.ts` | Zero changes required. Drives `generateStaticParams()` for `/services/[slug]`. |
| `src/content/service-areas.ts` | `content/service-areas.ts` | Zero changes required. Drives `generateStaticParams()` for `/service-areas/[slug]`. |
| `src/content/faqs.ts` | `content/faqs.ts` | Zero changes required. |
| `src/lib/quote-validation.ts` | `lib/quote-validation.ts` | Pure TypeScript validation & sanitization shared by client form and `app/api/quote/route.ts`. |
| `src/lib/seo.ts` | `lib/seo.ts` | Maps directly to Next.js `Metadata` objects, JSON-LD `<script type="application/ld+json">`, `app/sitemap.ts`, and `app/robots.ts`. |
| `src/pages/HomePage.tsx` | `app/page.tsx` | Convert route wrapper to Server Component; keep interactive children (`QuoteForm`, `MoveScopeBuilder`) as `'use client'`. |
| `src/pages/ServicesPage.tsx` | `app/services/page.tsx` | Server Component with route-specific `metadata`. |
| `src/pages/ServiceDetailPage.tsx` | `app/services/[slug]/page.tsx` | Add `export async function generateStaticParams()` returning `MRK_SERVICES.map(s => ({ slug: s.slug }))` and call `notFound()` from `next/navigation` when slug is unknown. |
| `src/pages/ServiceAreasPage.tsx` | `app/service-areas/page.tsx` | Server Component directory. |
| `src/pages/ServiceAreaDetailPage.tsx` | `app/service-areas/[slug]/page.tsx` | Add `export async function generateStaticParams()` returning `MRK_SERVICE_AREAS.map(a => ({ slug: a.slug }))`. |
| `src/pages/PricingPage.tsx` | `app/pricing/page.tsx` | Server Component + interactive `MoveScopeBuilder`. |
| `src/pages/AboutPage.tsx` | `app/about/page.tsx` | Server Component. |
| `src/pages/ContactPage.tsx` | `app/contact/page.tsx` | Server Component + interactive `QuoteForm`. |
| `src/pages/FaqPage.tsx` | `app/faq/page.tsx` | Server Component + interactive accordion. |
| `src/pages/PrivacyPage.tsx` | `app/privacy/page.tsx` | Server Component. |
| `src/pages/TermsPage.tsx` | `app/terms/page.tsx` | Server Component. |
| `src/pages/NotFoundPage.tsx` | `app/not-found.tsx` | Next.js custom 404 boundary. |
| `server.ts` (`/api/quote`) | `app/api/quote/route.ts` | Wrap `validateQuoteSubmission` and provider dispatch inside `export async function POST(request: Request)`. |
| `server.ts` (`/robots.txt`, `/sitemap.xml`) | `app/robots.ts`, `app/sitemap.ts` | Call `generateRobotsTxt()` and `generateSitemapEntries()` from `lib/seo.ts`. |

## 2. Step-by-Step Next.js Migration Commands

```bash
# 1. Initialize clean Next.js App Router project
npx create-next-app@latest mrk-removals-adelaide --typescript --tailwind --app --eslint

# 2. Copy modular directories
cp -r src/config src/content src/lib src/components public/assets mrk-removals-adelaide/

# 3. Run unit test suite (Node built-in test runner via tsx)
npx tsx --test src/config/business.test.ts src/lib/quote-validation.test.ts
```
