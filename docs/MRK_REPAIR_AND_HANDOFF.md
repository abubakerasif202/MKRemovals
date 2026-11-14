# MRK Removals Adelaide — Repair & Handoff

**Branch:** `fix/mrk-repair-premium-upgrade` · **Functional head:** `8ad100e` · **PR:** https://github.com/abubakerasif202/MKRemovals/pull/2
**Preview (Vercel-protected):** https://mkremovals-git-fix-mrk-repair-c1bfc6-abubakerasif202s-projects.vercel.app
**Production:** NOT deployed. Production still serves `ba25884` (PR #1). Nothing has been merged or promoted.

## 1. Executive summary

The live site already had correct prerendered, indexable route HTML (verified against the custom domain). The real defects were in lead delivery, inventory defaults, unverified claims and image weight. These are repaired on the branch, covered by unit and browser tests, and verified on a Vercel preview. The owner reports the live test enquiry is already done (not independently verified by me).

## 2. Initial defects

| # | Defect | Severity | Status |
|---|---|---|---|
| 1 | Browser posted to Web3Forms **and** `/api/quote`; the latter could also email via Resend (possible duplicate delivery) | High | Fixed |
| 2 | Network failure and "preview" states showed a success screen though nothing was delivered | High | Fixed |
| 3 | Web3Forms key hard-coded in client bundle; `/api/quote` had `Access-Control-Allow-Origin: *` | Medium | Fixed |
| 4 | No rate limit/idempotency on the live path; no audit record | Medium | Fixed (rate limit, idempotency, PII-free log). No persistent lead store (owner decision) |
| 5 | Inventory started with 2 queen beds, sofa, fridge, ~30 boxes; quote defaulted to 3–4 bedrooms | High | Fixed (live evidence: 9 items pre-filled, size `3–4 Bedroom Home`) |
| 6 | Unverified claims: "Licensed & Insured", "White-Glove", "Fully Weatherproof", "STANDARD INCLUSION", "No automated third-party broker" | High | Removed / reworded |
| 7 | ~8.1 MB of images on the homepage; 1.3 MB favicon; AI config `.md` files served from `/assets` | Medium | Fixed |
| 8 | Hero scene with three toggles and lighting modes; text-heavy page | Medium | Replaced |

## 3. Quote delivery architecture

`browser → POST /api/quote → src/lib/quote-delivery.ts → Web3Forms (primary) → Resend (fallback only if primary fails)`

- Shared by `api/quote.ts` (Vercel) and `server.ts` (local dev).
- `delivered` is returned only when the provider confirms (`success:true` / Resend `id`). Otherwise `ok:false` with `delivery_failed` (502), `not_configured` (503), `rate_limited` (429), `validation_error`/`spam_rejected` (400).
- First confirmed success stops the chain, so no duplicate email. A retry with the same `attemptId` returns the earlier result without resending (best effort per serverless instance; in-memory).
- Rate limit: 6 requests / 10 min / IP (in-memory, per instance).
- Audit: one JSON log line per request (reference, provider, service, suburbs — no name/phone/email) in Vercel runtime logs.
- Key: `WEB3FORMS_ACCESS_KEY`, or the existing Vercel production secret `web3form_key`. No key in client code. Preview has no key → honest `not_configured`.
- UI: failure keeps all entered data and offers *Try Sending Again*, *Email Instead* (mailto with the brief) and *Call 0423 653 342*.

## 3a. Known gap in this flow

Web3Forms is now called **server-side**. Web3Forms may restrict server-side calls on some plans. This has **not** been proven in production (a test would email the live inbox). If it is rejected, the site fails safely (user sees email/call fallback, never a false success). Remedies: upgrade plan, or set `RESEND_API_KEY` as the fallback.

## 4. Files changed (high level)

- Delivery: `src/lib/quote-delivery.ts` (+tests), `api/quote.ts`, `server.ts`, `src/lib/quote-validation.ts`, `src/components/forms/QuoteForm.tsx`, `.env.example`; removed `api/quote/config.ts`.
- Inventory: `src/components/interactive/MoveScopeBuilder.tsx` (+tests), `PricingPage.tsx`, `QuotePage.tsx`.
- UI: `src/pages/HomePage.tsx`, `src/components/brand/TrustBanner.tsx`, `src/components/ui/ResponsiveImage.tsx`, `ServiceDetailPage.tsx`; removed `CinematicTruckScene.tsx`.
- Performance: `scripts/optimize-images.mjs`, `public/assets/**` (WebP), `assets-src/**` (source art, not deployed).
- Tests/docs: `e2e/site.spec.ts`, `playwright.config.ts`, `docs/**`, `src/pages/PrivacyPage.tsx` (delivery disclosure rewritten; still draft for legal review).

## 5. UI/UX changes

Hero: Adelaide skyline image, one dominant "Get a Free Quote" CTA, one click-to-call, visible indicative-rate line. Homepage order: hero → trust → services → pricing & inclusions → process → quote form → (reviews omitted: none verified) → coverage → optional inventory → FAQ + closing CTA. Touch targets ≥44px. Reduced motion respected (`useReducedMotion`).

**Owner-supplied imagery (round 2):** the supplied logo, boulevard/midnight truck renders, crew and armchair images are now used (header/footer wordmark crop, hero logo card, process section, closing CTA). They are AI-style renders, so they stay captioned "Illustrative image" until real MRK photos exist. **Animation (round 2):** hero slow zoom, staggered text, floating logo card, glow on the main CTA, scroll-reveal (CSS, Chromium; other browsers show content statically), image hover zoom, drifting CTA background. All disabled under `prefers-reduced-motion`. **Not done:** video.

## 6. SEO & performance

- Live check of the custom domain (before changes): `/` and `/services` return 200 with route-specific `<title>`, `index, follow`, per-route canonical; `robots.txt` allows `/` and lists the sitemap; `sitemap.xml` 200. The Vercel catch-all rewrite does **not** override prerendered files. Preview deployments return `X-Robots-Tag: noindex` and `Disallow: /` (verified on this branch's preview).
- Open item: `robots.txt` disallows `/privacy` and `/terms`, which are also `noindex` by meta. A disallowed page cannot show its noindex; harmless but could be tidied.
- Images: homepage image transfer 8.1 MB → WebP 20–150 KB each (640/960/1376 srcset); only the hero is eager/`fetchpriority=high`.
- Not done: JS is still one ~527 KB chunk (153 KB gzip); route-level code splitting would need prerender changes. No Lighthouse/INP run was performed.

## 7. Verification evidence (actually executed)

| Check | Result |
|---|---|
| `npm run lint` (tsc) | pass |
| `npm test` | 37/37 pass (baseline was 20) |
| `npm run build` + prerender | pass, 24 routes |
| `npm run test:e2e` (production build, Chrome, quote API mocked) | 26/26 pass (re-run after the final code fix) |
| Overflow check | 8 routes × 320/360/375/390/430/768/1024/1440/1920 px: no horizontal overflow |
| Preview | build READY; `/` serves new content; `/robots.txt` noindex; `/api/quote` GET → 405 JSON (function loads) |

A real defect was caught by the preview check: the first deploy crashed `/api/quote` (`FUNCTION_INVOCATION_FAILED`) because new modules lacked `.js` import extensions. Fixed in `8ad100e`, with a guard test.

**Not verified:** POST to the deployed `/api/quote` (needs a live or mocked provider; would email the inbox in production); screen-reader behaviour beyond roles/labels/keyboard checks; Safari/Firefox; Lighthouse.

## 8. Screenshots

`docs/screenshots/before/` (live site, full page, 375/1440) and `docs/screenshots/after/` (home 375/768/1440, hero 390/1440).

## 9. Outstanding owner approvals / actions

1. ~~Live test enquiry~~ Owner states this is done.
2. Confirm inbox: `mkremovalsadelaide@gmail.com` vs an `mrk…` address (MK/MRK spelling not changed).
3. Owner confirmed: rate **includes GST**, **3-hour minimum + 1-hour call-out fee**, **$1M insurance coverage** (now published; policy type/insurer not supplied). ABN entity name is "MRK Removals Adelaide". Still open: crew/truck inclusions per rate.
4. Optional: policy type/insurer wording if you want more than the $1M amount shown.
5. Verified Google reviews (the reviews section is intentionally absent); real MRK photos when available.
6. Legal review of Privacy/Terms drafts.
7. Whether to keep a persistent lead record (database/CRM) beyond the runtime log.

## 10. Production release checklist

- [ ] Confirm inbox spelling (item 2)
- [ ] PR #2 reviewed; checks green
- [ ] Merge to `main` (Vercel auto-deploys production)
- [ ] Send one enquiry after deploy to confirm email still arrives
- [ ] `curl -I` home and `/services`, `robots.txt`, `sitemap.xml` on the custom domain
- [ ] Confirm production env: `web3form_key` (or `WEB3FORMS_ACCESS_KEY`), `VITE_MRK_PRODUCTION_INDEXING`, `MRK_PRODUCTION_INDEXING`

## 11. Rollback & maintenance

- Rollback: Vercel → Deployments → promote the previous production deployment (`dpl_2PUvsfMz4AhJ1ywzULG7Y9CyyzCv`, commit `ba25884`) or revert the PR merge.
- Add/replace images: put sources in `assets-src/`, run `npm run images`.
- Run tests: `npm test`; browser: `npx playwright test` (set `PW_CHANNEL=chrome` to use installed Chrome). The suite mocks `/api/quote` and never sends real email.
- Do not point any provider at HF Removals or Noor Removals; `business.test.ts` enforces identity isolation.
