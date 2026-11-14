# AGENT.md — MRK Removals Adelaide | AB Web Studio Build Agent

> **Purpose:** Production-oriented instructions for Codex CLI, Claude Code, Gemini CLI or Google AI Studio coding workflows to create an **original, premium and conversion-focused MRK Removals Adelaide website** directed by **AB Web Studio**. Inspect HF Removals Adelaide only as a **read-only architectural and journey reference**. This document does not authorize any modification or deployment of HF.
>
> **Source reviewed:** [`abubakerasif202/HF`](https://github.com/abubakerasif202/HF), `main`, inspected 11 November 2026. Recheck the live branch and deployment before relying on any version-specific observation. The companion `HF_SOURCE_REVIEW.md` records findings and limits.
>
> **Target identity:** **MRK Removals Adelaide** · Owner/contact: **Mubashar Riaz** · Phone: **0423 653 342** (`tel:+61423653342`) · Website/domain: **mrkremovalsadelaide.com.au** · Owner-supplied ABN: **95 685 822 473** · Indicative hourly rate supplied by owner: **AUD $130–$135/hour** (package, GST, surcharges and minimums not yet confirmed).
>
> **Deliverable:** A new and independently branded, responsive, accessible and tested MRK website; dedicated repository, environment, domain settings, quote leads and analytics. A live booking engine is out of scope until separately authorized. **Never clone HF branding, policies, credentials, testimonials, or backend connectivity.**

---

## 0. Non-negotiable operating rules

1. **Read first, change later.** Audit the reference repository, the current target workspace, supplied artwork, and any existing target site before modifying files. Note source commit SHA, branch, package versions, and working-tree status.
2. **Reference is read-only.** Never alter, commit to, push to, or deploy `abubakerasif202/HF` while carrying out this task. Never point the new site at HF's production databases, APIs, forms, calendars, analytics, email, maps, or hosting project.
3. **MRK identity only.** The target business is **MRK Removals Adelaide** at **mrkremovalsadelaide.com.au**. Contact name: **Mubashar Riaz**. Phone: **0423 653 342**. Do not accidentally display HF or Noor branding, contact information, ABNs, SEO metadata, analytics, or imagery. Never invent another address, email, phone, or domain.
4. **Facts require evidence.** No fabricated reviews, review totals, staff, insurance, licences, service areas, operating hours, years, pricing, discounts, fleet capacities, job counts, physical addresses, awards, guarantees, or accreditation.
5. **Distinct design, comparable quality.** Reuse information architecture, interaction patterns, accessibility approaches, and legitimate code patterns where authorized; make the new design original. Do not reuse HF logos, testimonials, customer names, CEO portrait, truck liveries, photos, legal copy, analytics IDs, or slogans.
6. **Protect existing work.** Never run `git reset --hard`, force-push, delete unstaged changes, or rewrite history. Use a clean new repository or an isolated worktree/branch when appropriate.
7. **No secret propagation.** Never copy real `.env`, private keys, Supabase service-role keys, signing secrets, Google OAuth refresh tokens, Stripe secrets, or Resend keys. Even public identifiers (Web3Forms ID, Google Analytics ID, Ahrefs ID, Google Place ID) must belong specifically to **MRK Removals Adelaide**.
8. **No speculative bookings.** A quote form may be delivered before business policies are confirmed; a live booking engine may not. The absence of credentials or policy must fail safely to an honest quote/call journey, not a simulated reservation.
9. **No surprise external actions.** Do not submit live enquiries, provision paid services, alter DNS, run live migrations, send messages, merge, publish, change external accounts or deploy without the owner's explicit instruction for that action. Build and test locally or in a safe preview by default.
10. **Tests are evidence.** Report only checks actually executed and their results. Failed/unavailable checks must be recorded, not silently described as passed.
11. **Use Superpowers methodology.** Discover available project skills, formulate a short design/spec and actionable implementation plan, use test-first increments for behavior, isolate risky work, systematically debug failures, perform code review, and verify before completion. If executing autonomously with an approved brief, proceed using reasonable documented decisions instead of repeatedly re-asking settled questions.

## 1. The actual HF reference: inspect these files, not generic assumptions

According to the *source document supplied for this brief*, the HF repository on 11 November 2026 used **Next.js 16 App Router + React 19 + TypeScript 5.9 + Tailwind CSS 4**, Node **>=22.13**, npm, Vercel, Supabase, Web3Forms, Resend, Google APIs and legacy/optional Stripe code. **These are historical observations from the supplied file, not a fresh verification.** Inspect current versions and source before choosing implementation dependencies.

| Reference path | What to learn | What must **not** transfer |
| --- | --- | --- |
| `package.json`, `package-lock.json` | framework versions, scripts, test stack | unreviewed dependencies and deployment linkage |
| `README.md`, `DESIGN_AUDIT.md` | project history, design corrections, verified vs unverified integrations | claims about target business and old verification results |
| `app/page.tsx`, `app/layout.tsx` | homepage metadata, structured data, page shell, fonts, analytics | HF metadata, tracking IDs, business schema |
| `app/components/Site.tsx` | page narrative, service components, quote surfaces, reviews, visual rhythms | HF content, customer names and oversized monolith structure |
| `app/components/SiteClient.tsx` | mobile menu, form states, CTA tracking, animations | HF form destination and event configuration |
| `app/globals.css`, `app/components/fleet.css` | colors, spacing, responsive breakpoints, motion, card styles | original palette if not chosen; accumulated one-off CSS |
| `lib/site-data.ts` | centralized business, packages, FAQs, pages, URLs, brand assets | ALL HF rates, names, policies, emails, keys, vehicle facts |
| `lib/hf-service-areas.ts` | grouped Adelaide location directory and data-driven area pages | assumed coverage and thin/duplicated suburb content |
| `app/[...slug]/page.tsx`, `app/areas/[slug]/page.tsx` | page factory, static params, metadata, breadcrumbs, schema | hardcoded HF titles and target-inappropriate routes |
| `app/robots.ts`, `app/sitemap.ts`, `next.config.ts` | canonicalization, sitemap generation, redirects, security headers | HF domains and HF-specific legacy redirects |
| `app/book/`, `app/api/booking/`, `lib/booking/` | booking UX, server-side validation, holds, pricing, idempotency | HF no-deposit rule, price math, schedules and booking identifiers |
| `app/admin/`, `proxy.ts`, `lib/admin-access.ts` | staff authorization, dashboard organization | HF users, roles, existing staff access and credentials |
| `supabase/migrations/0001*`–`0017*`, `lib/server/` | database rules, RLS, private server boundaries, notifications | connection to HF's database or reusing unreviewed migrations |
| `app/api/quote/capture/route.ts` | optional best-effort quote mirror | assumption that mirrored records prove provider delivery |
| `.github/workflows/ci.yml`, `tests/`, `audit/final/` | source-integrity guard, unit, rendered-page and Playwright checks | old labels, old acceptance assertions, stale snapshots |

### 1.1 Evidence-based architectural observations

- HF's public site combines **a multi-section marketing homepage, service pages, Adelaide-area pages, interstate-route pages, guides, pricing, about, contact, quote, and booking**, with noindex operational routes.
- The source holds business facts, packages and most content in **`lib/site-data.ts`**, but additional HF-specific text also appears in page modules, layout, navigation, schema, redirects, CSS, asset paths, tests and integrations. A single-file search-and-replace cannot make a clean new brand.
- At the reviewed source version, `app/components/Site.tsx` is approximately **1,474 lines**, `SiteClient.tsx` approximately **835 lines**, `app/globals.css` approximately **4,020 lines**, and `lib/site-data.ts` approximately **826 lines**. Treat these as evidence for extracting **cohesive new modules**, not as ideal file-size targets.
- The source includes a working *implementation design* for configurable booking, with Supabase tables/RPCs, staff admin, resource availability, server-side price snapshots, optional Resend email and Google Calendar mirror. **Do not infer that the live target account/credentials are connected or that all external flows are presently operational.**
- HF's README documents a **3-hour service minimum, separate 1-hour call-out billed at the package rate, no advance payment, and 5am–6pm allowed booking start times**. Those are **HF policies only**, absolutely not defaults for the new company.
- HF's quote form uses Web3Forms and can optionally mirror a submission to Supabase; mirrored delivery state is `unknown`, not a proof of email delivery. A new site needs its own explicitly tested destination.
- HF's checkout code includes legacy Stripe support; Stripe is **not a default prerequisite** for the new removalist site.
- HF's canonical domain is `https://www.hfremovalsadelaide.com.au`; the project carries host/legacy-path redirects. None belongs in the new website.
- HF's Google review figure is supplied in source data, with an older verification timestamp. It is a company-specific snapshot, **not a live reviews API**. Never display it for the target; choose a new verified source and visible as-of date if useful.
- Historical HF design notes describe a removed heavy 3D viewer, fixed mobile overflow, improved keyboard menu, and generated truck photography with known lettering imperfections. Prefer **real branded media**, restrained motion, and clean layout rather than recreating those issues.

## 2. The correct implementation choice

**Preferred approach: a clean, new MRK-branded Next.js project**, borrowing only HF's proven user-journey and architectural ideas without sharing production backend, imagery, customer data or company-specific content. Match the relevant source framework if current and appropriate, but validate versions and toolchain before scaffolding.

Alternative: copy only explicitly authorized, reviewed, business-agnostic components and re-test them in the new repository. **Never fork the complete HF project into a different production business without a complete secrets, licensing, ownership, database, redirect, brand and legal-content review.**

### 2.1 MVP scope

Build the following in the first independently deployable release:

1. premium responsive homepage;
2. services index and one genuinely useful page per **confirmed** service;
3. Adelaide coverage directory and selected meaningful suburb pages only for **confirmed** service areas;
4. About MRK, transparent indicative pricing (only with a precise disclaimer), contact, privacy and terms/legal-review pages;
5. accessible **Request a Quote** form, with validated dedicated MRK delivery when enabled, and a verified **Call 0423 653 342** fallback;
6. original MRK-branded artwork and a curated logo pack, favicon, optimized cinematic hero, mobile menu and mobile call/quote CTA;
7. canonical/SEO/schema/robots/sitemap, analytics only with new identifiers and consent considerations;
8. tests, visual QA, CI and release notes.

**Phase 2 only when separately approved:** live truck/time booking, fleet resource management, staff dashboard, server-side pricing, external calendar synchronization, transactional email, payment integration, CRM, dynamic Google reviews. Never make Phase 1 depend on Phase 2.

## 3. MRK owner facts, provenance and launch decision register

Create `docs/decisions/brand-facts.md` as the **single evidence ledger** for company-specific claims. Every claim records `{value, source, verifiedAt, approvalStatus, publicationRule}`. Values below were supplied directly by the owner in the creative brief; they have **not** been independently verified against public registers or third-party business systems. Record them faithfully; do not silently add missing policy terms.

### 3.1 Confirmed inputs from the owner for the MRK brief

| Field | Owner-provided value | How to implement |
| --- | --- | --- |
| Trading/brand display name | **MRK Removals Adelaide** | Use verbatim in H1 alternatives, logo labels, metadata and contact areas. Do not claim it is a legally registered business name without registry evidence. |
| Owner/contact name | **Mubashar Riaz** | Use for internal contact metadata; display publicly only if approved in site copy. Do not invent job title beyond owner/contact. |
| Phone, domestic | **0423 653 342** (`0423653342`) | Visible click-to-call CTA, contact page and mobile action bar. |
| Phone, E.164 | **+61423653342** | Exact `tel:+61423653342` and validated phone references. |
| Website/domain | **mrkremovalsadelaide.com.au** | Intended canonical `https://mrkremovalsadelaide.com.au` once confirmed under MRK control and serving correctly; configure via single constant. |
| ABN | **95 685 822 473** | User-supplied identifier; checksum-format is consistent, but check the Australian Business Register for status and matching entity before representing it as registry-verified. Use on footer or invoices only if owner wants it published and identity linkage is established. |
| Hourly price guidance | **AUD $130–$135 per hour** | An **indicative range**, not verified as an all-inclusive package or a fixed binding rate. Do not invent movers, truck size, call-out, GST, minimum, or exclusions. |
| Creative direction | **AB Web Studio premium MRK branding** | Ruby red, platinum silver, sapphire blue, midnight black; champagne gold used sparingly. Cinematic truck-led visuals, controlled motion, minimal heavy 3D. |
| Agency/creative director | **AB Web Studio** | Production credit in internal docs only unless owner approves public footer attribution. Do not insert AB Web Studio contact numbers into MRK customer-facing calls to action. |

**Explicitly unknown or unverified:** quote-recipient email; registered ABN entity name/status; hours of operation; public street address; full service coverage and exact suburbs; fleet type/capacity and crew; customer reviews/Google profile; insurance; GST inclusion; whether $130 or $135 applies to different days or truck packages; minimum billing; travel, toll, stairs, heavy-item, packing and weekend charges; cancellation/deposit terms; appointment availability; approved policies; and any existing target repository or hosting account.

### 3.2 Mandatory rate handling

- Internally store `indicativeRate: { minAUD: 130, maxAUD: 135, unit: "hour", taxTreatment: "unconfirmed", inclusions: "unconfirmed", approval: "owner-supplied-range" }`.
- **Preferred launch copy**, if the owner approves publishing the range: **"Indicative hourly rates: $130–$135. Request a quote for your move."** Pair the figure with **"Final pricing depends on your moving requirements; please confirm inclusions, minimums, travel charges and GST."**
- If legal or commercial review requires full certainty before prices are public, omit the number in the production preview and use **"Request a tailored quote"**. Preserve the known range in internal config.
- Never transform this into "from $130 for two men and truck," "fixed $130/hr," "all inclusive," "$135 weekend," a package table, or a price calculator unless specifically substantiated.
- Do not copy HF rates, surcharge assumptions, booking durations or pricing formulas.

### 3.3 Identity and external-action gates

- Phone link can be active immediately because the exact number was owner-supplied; use `tel:+61423653342` everywhere.
- For business email or form destination, **do not invent** an `info@` or `admin@` address. Provide a beautiful, safe preview and working call CTA until a dedicated MRK destination is connected and tested.
- Do not publish an ABN registry status or business entity name without lookup and explicit confirmation.
- Before production, verify control of the specified domain and decide apex-versus-www canonical/redirect behavior.
- AB Web Studio artwork is *creative concept material* unless the owner chooses a final logo; inspect the selected source file, legibility and rights. Distinguish raster concepts from vector masters.
- The reference brand **HF Removals Adelaide** and any old candidate brand **Noor Removals Adelaide** must never occur in MRK public HTML, imagery, SEO, quote payloads, footer, analytics or contact links.

### 3.4 Pending owner decisions (non-blocking for local development)

Capture questions as `docs/decisions/open-items.md`, but **keep building** a safe quote-only preview: which rate applies, GST, crew/truck options, minimum time, travel/call-out fees, approved suburb coverage, exact services, business email/form recipient, registered ABN entity match, review source and photos, and publication/hosting authorization.

**Preview gate:** A missing fact may suppress a section, but must never trigger a fabricated claim. Unverified preview is `noindex`, visually polished, and never misleadingly presented as a live booking or validated lead-delivery system.

## 4. Audit workflow before writing implementation code

### Gate A — inspect source and target

- Identify repo roots, branch, remotes, tracked status and recent commits.
- Inventory route tree, assets, data files, config and route handlers using `git ls-files`, not invented paths.
- Enumerate all external integrations and where their credentials are consumed; document browser-exposed versus server-only.
- Capture baseline desktop and mobile from the supplied live or local HF site if tools permit. **Do not assume a web-crawler snapshot represents current deployment.**
- Inventory user-supplied logo/imagery and usage permission, inspect real logo proportions, color/contrast and crop.
- Make a **reuse matrix**: pattern to keep, source file, reason, target implementation, business-specific material to replace, and required test.
- Produce `docs/architecture/reference-inventory.md` and `docs/audit/findings.md` with priority (P0 launch blocker, P1 important, P2 polish) and evidence.

### Gate B — specific source risks to investigate

1. Hardcoded business copy outside `lib/site-data.ts` and in generated HTML.
2. Date-sensitive reviews, numbers, prices and hours versus their true verification age.
3. Whether `/book` is enabled, guarded, internally consistent and truthful about availability.
4. Server route permissions: anonymous/public vs staff-only; RLS and privileged RPC execution.
5. Quote delivery vs quote mirroring and misleading success conditions.
6. Proxy/redirect behavior, especially canonical host and old business domains.
7. Large shared components and CSS coupling that make copy-paste maintenance risky.
8. Asset livery spelling, photos representing real versus conceptual trucks, and image optimization.
9. SEO route duplication, thin area pages, metadata and indexable URL inventory.
10. Functional test coverage versus tests that were merely reported in historical docs.

### Gate C — design and plan

- Produce a concise design spec with 2–3 original page-style options, choose one based on the brand brief, and capture decisions in `docs/superpowers/specs/YYYY-MM-DD-adelaide-removals-site-design.md` when using the Superpowers workflow.
- Produce an implementation plan with exact files, interfaces, acceptance tests and commands at `docs/superpowers/plans/YYYY-MM-DD-adelaide-removals-site.md`.
- Use small independently testable increments; follow test-driven development for user-facing interactions and business logic. Review and approve the design before implementing when working interactively; when the user has instructed the agent to execute without questions, document the decisions and proceed with the approved brief.

## 5. Recommended new repository structure

Do not replicate HF's large component files verbatim. Prefer a clear Next.js App Router structure, adjusting to installed Next version:

```text
app/
  layout.tsx
  page.tsx
  about/page.tsx
  services/page.tsx
  services/[slug]/page.tsx
  service-areas/page.tsx
  service-areas/[slug]/page.tsx
  pricing/page.tsx                  # omit or present enquiry-based pricing if unknown
  contact/page.tsx
  privacy/page.tsx
  terms/page.tsx
  not-found.tsx
  robots.ts
  sitemap.ts
  api/quote/route.ts              # only when server delivery is selected
components/
  layout/Header.tsx
  layout/MobileNavigation.tsx
  layout/Footer.tsx
  common/Container.tsx
  common/SectionHeading.tsx
  common/Button.tsx
  common/Breadcrumbs.tsx
  home/Hero.tsx
  home/TrustStrip.tsx
  home/ServicesPreview.tsx
  home/MovingProcess.tsx
  home/AreasPreview.tsx
  home/FinalCta.tsx
  services/ServiceCard.tsx
  forms/QuoteForm.tsx
  forms/QuoteFeedback.tsx
  reviews/VerifiedReviews.tsx       # only with approved review evidence
  interaction/MobileActionBar.tsx
content/
  services.ts
  service-areas.ts
  faqs.ts
  reviews.ts                       # empty until genuinely supplied
config/
  business.ts
  navigation.ts
  design-tokens.css
  seo.ts
lib/
  canonical.ts
  seo.ts
  structured-data.ts
  quote-validation.ts
  analytics.ts
public/
  brand/
  images/
  og/
tests/
  unit/
  integration/
  browser/
docs/
  audit/
  decisions/
  superpowers/
.env.example
README.md
AGENT.md
```

Avoid creating empty architecture for unneeded booking/admin/Stripe services. Add them only after a separately approved Phase 2 spec.

## 6. Typed MRK single source of truth

Create a typed `config/business.ts` and `content/` records. Keep business facts separate from marketing copy and art direction. Example model (adapt to framework and exact validation approach):

```ts
export type EvidenceValue<T> = {
  value: T;
  source: "owner-brief" | "public-register" | "owner-approved-record" | "verified-provider";
  verifiedAt?: string; // undefined when no independent verification occurred
  approvalStatus: "supplied" | "verified" | "approved";
};

export type MRKBusinessConfig = {
  brandName: "MRK Removals Adelaide";
  domain: "mrkremovalsadelaide.com.au";
  canonicalOrigin: "https://mrkremovalsadelaide.com.au";
  ownerContactName: "Mubashar Riaz";
  phoneDisplay: "0423 653 342";
  phoneHref: "tel:+61423653342";
  abn: EvidenceValue<"95 685 822 473">;
  indicativeHourlyAUD: EvidenceValue<{
    min: 130;
    max: 135;
    currency: "AUD";
    unit: "hour";
    gst: "unconfirmed";
    package: "unconfirmed";
  }>;
  enquiryEmail?: string;
  publicAddress?: EvidenceValue<string>;
  serviceRegions?: EvidenceValue<string[]>;
  hours?: EvidenceValue<string>;
  insurance?: EvidenceValue<{ wording: string; restrictions: string }>;
  reviews?: EvidenceValue<{ rating: number; count: number; url: string }>;
  approvedServiceIds: string[];
  bookingMode: "quote-only" | "verified-booking";
};

export const mrkBusiness: MRKBusinessConfig = {
  brandName: "MRK Removals Adelaide",
  domain: "mrkremovalsadelaide.com.au",
  canonicalOrigin: "https://mrkremovalsadelaide.com.au",
  ownerContactName: "Mubashar Riaz",
  phoneDisplay: "0423 653 342",
  phoneHref: "tel:+61423653342",
  abn: { value: "95 685 822 473", source: "owner-brief", approvalStatus: "supplied" },
  indicativeHourlyAUD: {
    value: { min: 130, max: 135, currency: "AUD", unit: "hour", gst: "unconfirmed", package: "unconfirmed" },
    source: "owner-brief",
    approvalStatus: "supplied",
  },
  approvedServiceIds: [], // populate only with explicitly confirmed offerings
  bookingMode: "quote-only",
};
```

- Do not insert placeholders such as `example.com`, fake inboxes, `TBD` or `undefined` into rendered content.
- Phone, domain, brand name, ABN and indicative range are typed once, not scattered as page literals.
- Public pages and schema consume approved verified data; **not every owner-supplied field is automatically fit for legal/structured-data publication**.
- Do not expose an owner's personal name in all page content unless explicitly desired; private vs public contact attribution is a separate decision.
- A rate is not a bookable price. No calculator or `Offer` schema until inclusions, tax and service conditions are fully approved.
- Client-visible `NEXT_PUBLIC_` values are public. Never expose server secrets.
- Booking remains `quote-only` until all policy, availability, database, concurrency and notification gates pass.
- Use `config/design-tokens.css` as the single palette/typography/motion source.

## 7. AB Web Studio luxury creative direction and branded assets

**Objective:** create an immediately recognizable premium removals company identity, engaging enough for AB Web Studio's design portfolio while staying readable, trustworthy, fast and conversion-oriented. MRK should look like an established premium transport operation, **without inventing business history, real fleet assets or social proof**.

### 7.1 Design DNA

- **Style:** cinematic Australian logistics + refined automotive design + modern editorial typography.
- **Palette:** midnight black `#090D15`, ruby red `#C81036`, platinum silver `#C9D2DC`, sapphire blue `#124FA3`, ice white `#F5F7FA`, graphite `#242A34`; champagne gold `#C5A15C` for minimal highlights only.
- Suggested balance: 30% black/graphite; 25% silver; 25% ruby; 15% sapphire; no more than 5% gold. These are directional rather than rigid pixel ratios.
- **Gold is not the brand's dominant colour.** Avoid all-gold wordmarks, oversized gold surfaces, casino-like borders and gratuitous lens flares.
- **Typography:** confident geometric display sans for headlines and a highly legible modern body sans. Large readable H1; no ultra-thin microtype or overly condensed mobile labels.
- **Graphic language:** one coherent MRK letterform, subtle road/motion lines, finely balanced moving-truck or home shape, selectively used urban Adelaide geometry.
- **Composition:** strong negative space, comfortable vertical rhythm, immersive media, refined cards and buttons, crisp contrast. Make the layout original, not HF with different colors.
- **Motion:** intentional image reveals, subtle parallax, hover details, button response, scroll-linked cinematic transitions and tasteful truck movement. Limit total motion, protect CTA visibility and respect reduced motion.
- **2D/video first:** favor authentic/high-quality cinematic photography and optimized video over heavy WebGL, particle environments or constant spinning 3D. Selective dimensional 3D is allowed only when it materially elevates the page and performance remains excellent.

### 7.2 Logo system

Work from the user-selected **MRK Removals Adelaide** concept images available in the target workspace. Some are exploratory raster logo renders rather than print-ready masters. The agent must audit actual available files (do **not** assume file paths exist) and create a cohesive production brand system:

1. **Primary horizontal lockup:** distinctive MRK wordmark, `REMOVALS`, `ADELAIDE`, restrained truck/home symbolism.
2. **Stacked logo:** for cards, uniforms and promotional compositions.
3. **Compact monogram:** legible at 32–128 px and practical on truck doors.
4. **Circle/badge:** simplified for social avatar, decals and merchandise.
5. **One-colour dark/light marks:** true black and white production-safe variants, without dependence on metallic effects.
6. **Premium campaign render:** tasteful platinum/ruby/sapphire dimensional treatment; *not* the only logo source.
7. **Favicon and OG asset:** traceable to the master icon and correctly cropped.

Keep a single coherent letterform/proportions across all variants. Preserve exact company spelling. Check all generated graphics for deformed truck wheels, unreadable letters, distorted boxes and fictional Adelaide buildings. A raster image saved with `.svg` is **not a true editable vector**. Use real vector paths for final SVGs or report that manual tracing/redrawing is needed. Do not use unapproved stock/watermarked media.

**Suggested visual directions for comparison:**

- *Ruby Performance:* black + platinum lettering, ruby motion accent, minimal sapphire highlights.
- *Platinum Executive:* graphite and silver, tiny ruby details, refined corporate spacing.
- *Sapphire Motion:* sapphire/graphite base, platinum typography, ruby call-to-action highlights.
- *MRK Signature:* an ultra-clean monogram with restrained truck/roof geometry for icons.

Select one coherent identity, not a mix of incompatible logos. If no final design is approved, choose and document a working concept, mark it as provisional and keep preview `noindex`.

### 7.3 Homepage cinematic design

Build a layered original homepage in the following narrative order, conditioned on verified content:

1. **Header:** approved MRK logo, compact navigation, working phone `0423 653 342` and **Request a Quote** CTA.
2. **Hero:** cinematic Adelaide-inspired moving scene and crisp primary H1, e.g. **"Moving in Adelaide, made simpler."** Copy is a creative proposal, not a proven performance claim. Show an MRK-branded conceptual truck without pretending the image is a real fleet photograph.
3. **Practical trust strip:** truthful communication, planning and process features; no fake star count or "insured" assertion.
4. **Service cards:** only confirmed services, linked to their own useful pages, avoiding filler.
5. **Moving day experience:** protect belongings, plan access, coordinate pickup and delivery—phrase as guidance, not unsupported guarantees.
6. **Pricing teaser:** use the **indicative $130–$135/hour** range only with the approved disclaimer; if package/GST status prevents honest display, offer a tailored quote instead.
7. **Early quote CTA and form:** accessible, validated, not blocked by aesthetic animations.
8. **How the move works:** 3–5 realistic steps (enquire, discuss requirements, agree scope, schedule with team, move). Do not imply a confirmed date before actual confirmation.
9. **Areas served:** only verified Adelaide coverage; no implied offices in suburbs.
10. **Review/media section:** authentic customer evidence only, otherwise service-process or FAQ content.
11. **FAQs:** valuable responses with no invented surcharges, hours or payment rules.
12. **Final CTA/footer:** phone, quote, real approved ABN display if appropriate, privacy and terms, consistent branding.

### 7.4 Motion, imagery and performance requirements

- Every page must work with JS-reduced or reduced-motion preferences; heading and CTA must render without awaiting animation.
- Optimize hero media using next/image or framework equivalent, responsive crops, correct alt and constrained payload. If video is used, provide poster, muted inline autoplay only if permitted, user pause control where appropriate, and a lightweight static fallback.
- Do not show fake filmed footage as documentary evidence of MRK staff or trucks. Conceptual imagery is fine for branding when not deceptive.
- No fullscreen loader, flashing effects, random spinning trucks, autoplay sound or animations that prevent quoting.
- Mobile sizes **320/360/375/390/412/430 px** receive custom QA for legibility, clipping and CTA prominence.
- Header logo, hero, nav, service cards, quote and footer must feel like one system, not independently designed templates.

## 8. Service pages and content model

Possible categories to **verify with owner**: house removals, apartment moves, office relocations, furniture removals, packing/unpacking, interstate removals, backloading, bulky-item moves. Do not publish a category merely because HF has it.

Each legitimate service should have:

- its own title, description, slug and unique intent;
- above-the-fold concise service explanation and quote action;
- conditions that actually affect moving quotes: inventory, stairs, lift access, parking distance, scheduling, bulky items, assembly/packing;
- clear scope and what the customer must confirm;
- suitable imagery, related services and useful internal links;
- human, locally relevant original copy; an honest FAQ if answers are known;
- proper canonical, one H1, breadcrumbs and accurate structured data.

Do not duplicate a generic paragraph across every URL and substitute only the service name.

## 9. MRK Adelaide service-area SEO: helpful, not a doorway farm

Use grouped areas only from MRK's **confirmed operational coverage**. A list of Adelaide suburbs is geographic knowledge, not proof the new business serves them.

- `/service-areas` acts as a useful directory, grouped into Central, North, North-East, East, West, South, Hills, Coastal and relevant Regional SA when verified.
- Create suburb pages only when there is enough unique, useful local information: access constraints, move types, nearby connections, parking/strata planning and truthful service details.
- Avoid auto-generating 100 near-identical pages. Start with a smaller high-quality set when coverage is not well documented.
- Never claim a physical office in each suburb. An area-served page is not a local address.
- Write unique titles, descriptions, internal links and H1s. Do not keyword-stuff or manufacture testimonials for the area.
- Use stable slugs, canonical URL and `notFound()` for unrecognized areas. Keep the sitemap aligned to genuinely indexable pages.
- No Google Business Profile listing for the new company may be fabricated; verify its actual public URL before linking.
- Avoid unsupported "best", "#1", "cheapest", and "near me" manipulations. Use Google Search Console data later to prioritize improvements rather than mass pages.

## 10. Quote system: ship a reliable lead path

**Minimum useful fields**: name, phone/email contact method, pickup suburb/address level approved by the business, destination suburb, and moving date or date flexibility. Make optional inventory, rooms, stairs/lift, parking, packing and notes discoverable without overwhelming the first screen. Request only information needed for quoting.

Requirements:

- Clear visible field labels, required indicators, Australian contact input treatment, device autofill, inline validation and concise feedback.
- Server validation with Zod or equivalent **if using your own API**, rate limiting/anti-spam, bounded input length, safe logs, and explicit payload schema.
- One submit per attempt; loading state; don't reset form until delivery is positively acknowledged; retain values on errors/timeouts.
- Server only reports `delivered` if the real provider confirms delivery. A local database mirror is `recorded`, not proof of external delivery.
- Do not accidentally send customer leads to `admin@hfremovalsadelaide.com.au` or the HF Web3Forms account. New recipient and new provider registration are mandatory for production.
- Expose a meaningful direct call link when submission fails, but never state "received" after a timeout, 500, or unverified provider response.
- If the business wants Google/Resend, make provider credentials server-only and require its own domain verification and verified recipient.
- Add source-page context and an idempotent attempt key; avoid placing complete customer addresses or free-text contents in GA or other analytics events.
- Privacy policy must describe enquiry data handling and the actual form provider; review applicable Australian Privacy Principles and marketing consent needs without making unsupported legal-certainty claims.

### MRK-specific conversion checks

- Display owner-supplied phone **0423 653 342** and `tel:+61423653342` consistently; never show AB Web Studio, HF or Noor phone as MRK customer contact.
- Include a real direct-call fallback on submission failure.
- Store hourly-range context in source data but **do not bind a price to a submitted enquiry** unless the owner verifies package, inclusion and tax rules.
- Quote submissions may include full addresses; avoid marketing analytics PII and log redaction failures.
- Form provider, reply address and destination must belong exclusively to MRK and be live-tested by explicit permission.

### Quote form test cases

`required_field_error`, `invalid_email`, `phone_format`, `optional_details`, `keyboard_submit`, `rate_limited`, `provider_200_success`, `provider_200_rejected`, `provider_500`, `network_disconnect`, `timeout`, `double_submit`, `submit_after_retry`, `mobile_autofill`, `stale_old_recipient`.

Use mocked external providers for automated tests; controlled real test delivery may occur only when explicitly approved.

## 11. MRK booking: intentionally gated, never superficially imitated

The HF booking implementation contains rules specific to its own fleet, 30-minute billing, minimum time, call-out, local start times, job finalization, holds and optional Google Calendar mirroring. **MRK has supplied only a $130–$135/hour indicative range**, not enough to calculate a binding bill or confirm a booking. First produce a separate MRK **business-policy decision record**.

Before implementing `/book` as a real reservation route, require **all** of:

1. approved services, packages, vehicles, workers/crew and capacity;
2. independently confirmed prices, charging increments, minimum booking, call-out, GST and any surcharge/exclusion policy;
3. booking horizon, business hours, Adelaide timezone, rescheduling, lead time and cancellation policy;
4. authorized Supabase project and fresh migrations (or a documented alternative data store);
5. authentication and staff-authorization design, RLS, grants and server-only privileged operations;
6. concurrency-safe hold/confirm lifecycle, expiry and idempotent notification flow;
7. reliable availability with real inventory and a clear no-availability state;
8. explicit policy for advance payment, whether any deposit is taken, and if Stripe is genuinely required;
9. booking confirmation messages that truthfully reflect transaction state;
10. integration tests for races, duplicated confirms, wrong tokens, expired holds, timezones and DST;
11. real owner acceptance testing before the public Book Now CTA is enabled.

Do not copy `supabase/migrations/` wholesale into a new live project. Study and adapt schema, policies and RPCs; run fresh migration/security checks on isolated target infrastructure. The service role never enters client code or logs. Use `auth.getUser()` / appropriate verified server auth and role checks in the data layer, not only middleware UI redirects.

If any critical requirement is missing, public buttons point to **Get a Quote**, not to a pseudo-checkout or a booked-success page. A preview may demonstrate a booking flow with unmistakably simulated data, but must never accept real appointments.

### Adelaide time handling

Use `Australia/Adelaide` for displayed move schedules and pricing boundaries; carefully distinguish DST / offset changes. Avoid assuming Sydney's timezone. Store UTC instants and preserve zone-aware conversions. Bookings spanning midnight/DST require explicit coverage.

## 12. MRK SEO, redirects and structured data

- Configure the **MRK intended domain** `mrkremovalsadelaide.com.au` once. The canonical origin `https://mrkremovalsadelaide.com.au`, metadata, OG URLs, sitemap and robots derive from it after the domain host is verified. No HF or Noor host, marketing ID, phone, email or schema identifier may appear in public output.
- Redirect only the **new** site's legitimate aliases or its owned old URLs. Never redirect `hfremovalsadelaide.com.au` or copy HF `.com` legacy-host logic into the target.
- Provide title and meta description aligned with intent, unique H1, real image alt, meaningful links, indexability and OG/Twitter preview.
- Use `MovingCompany`/`LocalBusiness`/`Organization`, `Service` and `BreadcrumbList` only with information MRK verifies. Google may ignore some eligible rich-result formats; implement correctness, not guaranteed visual enhancements.
- Never include `aggregateRating`, `review`, `priceRange`, `openingHoursSpecification`, `PostalAddress`, ABN-as-registry-verified, or claimed service area unless exact facts and their use are substantiated and visible where appropriate. The indicative $130–$135/hour is not automatically sufficient for structured `priceRange`.
- Do not put administrative, quote-confirmation, booking-success, draft or preview pages in an indexable sitemap. Give them appropriate `noindex`; guard private routes with authentication separately.
- Keep routes crawlable when a search engine needs to read their `noindex` directive; do not treat `robots.txt` alone as a privacy mechanism.
- Internal links should naturally connect service ↔ related service ↔ coverage, FAQ ↔ quote, and homepage ↔ priority pages.
- Run a live **apex and www host** check, and inspect response status, `Location`, canonical, robots and sitemap. Crawler data for HF showed snapshots from different website generations on different hosts; do not assume canonical redirects work merely because source config says so.
- Verify Google Search Console property ownership after the owner connects the new domain. Never reuse HF property verification.

## 13. Performance and accessibility targets

Treat these as **targets to measure**, not achievements to claim without test evidence:

- WCAG 2.2 AA where feasible: semantic elements, accurate headings, visible focus, skip link, labelled form controls, error association, keyboard dialog/drawer interactions, alt text, minimum sensible touch targets, reduced motion.
- Core Web Vitals good thresholds at p75: **LCP <=2.5s**, **INP <=200ms**, **CLS <=0.1**; measure on representative mobile routes and confirm field data when available.
- Prefer lightweight CSS and server components over heavy client-side effects; don't port HF's large monolithic CSS unchanged.
- Hero loads quickly with correct responsive sizes; lazy-load offscreen galleries and map iframe; self-host fonts where appropriate; limit third-party script impact.
- No unnecessary always-running scroll listeners, large 3D scene, auto-playing sound, aggressive parallax, giant backgrounds, or animation that hides content before hydration.
- Accessibility is not satisfied by attractive design alone; automate and manually exercise keyboard behavior.

### Viewport QA matrix

Mobile: **320, 360, 375, 390, 412, 430 px**. Tablet: **768, 820, 1024 px**. Desktop: **1280, 1440, 1536, 1920 px**. In Chromium and, where available, WebKit/Firefox:

- open/close mobile menu, Escape, focus return, scroll lock, resize/rotation;
- hero crop/H1/button visibility, no text hidden behind illustrations;
- no document horizontal overflow; accessible carousels do not create page overflow;
- service cards, area sections, FAQ, forms, error feedback, sticky mobile CTA and footer;
- link and focus-state inspection, no browser console/hydration errors;
- reduced-motion accessibility, touch target and contrast checks.

## 14. MRK analytics and tracking rules

- No HF/Noor Analytics, Ahrefs or Google Business identifiers in target markup. Configure only identifiers issued to the new business.
- Track meaningful conversion events: `quote_start`, `quote_success`, `quote_error`, `call_click`, `service_click`. Record success only after an acknowledged provider outcome.
- Never place personal phone numbers, email addresses, full move addresses or raw form contents into marketing event payloads.
- Align tracking with the target privacy policy and applicable consent obligations. A cookie banner is not automatically needed, but the need must be assessed.
- Make analytics optional so the site still builds and works when IDs are absent.

## 15. Build process: executable tasks and gates

**Stage 1 — MRK inventory and spec**

- [ ] Record HF reference URL, commit SHA and source-only limitations.
- [ ] Inventory actual routes, data, services, page templates, interactions and integrations.
- [ ] Record MRK, Mubashar Riaz, 0423 653 342, intended domain, ABN 95 685 822 473 and indicative AUD $130–$135/hour in the evidence ledger; list all unresolved pricing/operational details.
- [ ] Document chosen unique visual direction, information architecture, conversion path and deferred booking scope.

**Stage 2 — scaffold / design system**

- [ ] Create isolated target repo with lockfile, Node version and independent Vercel target.
- [ ] Implement source-of-truth company config with safe optional fields and an identity-leak test.
- [ ] Build design tokens, mobile-first layout, accessible header/mobile drawer, typography and footer.
- [ ] Validate ruby/platinum/sapphire/black MRK logo system, generated media, colour contrast, real vector status, responsive image sizing and OG/brand icons.

**Stage 3 — conversion homepage**

- [ ] Build hero, genuine services, trust, moving process, useful guidance and final CTA.
- [ ] Build valid quote form and test empty, rejection, retry, double submit and user feedback.
- [ ] Wire `tel:+61423653342` and only a genuine MRK form destination; preserve quote-only state until booking authorized.

**Stage 4 — page architecture**

- [ ] Build services index and each approved service page with original content.
- [ ] Build coverage directory and selected genuine area pages; avoid thin templated copies.
- [ ] Build About MRK, Contact (phone 0423 653 342), Pricing (honest $130–$135 indicative policy only), Privacy, Terms and 404.
- [ ] Implement search metadata, JSON-LD, breadcrumbs, sitemap, robots and canonical host.

**Stage 5 — review and harden**

- [ ] Test identity leakage in source **and rendered MRK build**.
- [ ] Test full navigation, responsive layouts, keyboard flows, form provider mocks and link integrity.
- [ ] Review security, secrets, dependency status, server/client boundary, metadata and asset weights.
- [ ] Capture representative route screenshots at desktop/tablet/mobile and compare to approved direction.
- [ ] Run complete verification commands with captured exit codes.

**Stage 6 — handoff / optional deployment**

- [ ] Deliver a factual change summary, route inventory, target configuration checklist and tests report.
- [ ] Mark blocked items (unverified policy, external integration, legal copy) instead of guessing.
- [ ] Deploy only if authorized, then smoke-test **actual deployment** for mobile, form receipt, canonical origin and indexing policy.
- [ ] Only enable booking separately after the operational decision record and end-to-end test gate have passed.

## 16. Test-first discipline and commands

Start with the scripts present in the **new** `package.json`; below is a suggested npm baseline, not a promise they already exist:

```bash
node --version
npm --version
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npx playwright test
npm audit --omit=dev
```

If the target repo uses `npm run test:browser`, use that rather than inventing a Playwright command. Unit tests for domain logic are separate from browser tests. Keep mocked external side effects in CI; do not send live leads or book real jobs during automated tests.

### Minimum automated test inventory

**Content/data:** correct MRK brand, Mubashar Riaz contact attribution handled as approved, ABN `95 685 822 473` not transposed, `tel:+61423653342`, range min 130/max 135 AUD/hour, unknown GST/inclusions preserved, no invented package price; strict no-HF/Noor identity guard; correct unique service/area slugs; unsupported facts omitted; price calculations only after policy approval.

**SEO:** every indexable route responds 200 with expected H1, title, description and one self-canonical; 404 returns proper status/noindex; sitemap contains only canonical public pages; robots is correct; new host redirects correctly; schema parses and matches visible text.

**Quote:** provider success/reject/fail/timeout; anti-spam; duplicate-click; privacy-safe logging; no lead leakage to HF or Noor recipients; accessibility; MRK call fallback; no false success when endpoint unconfigured.

**Booking if approved:** same-resource concurrency, vehicle/crew exclusion, correct final pricing and snapshots, request ownership, expired holds, idempotent confirm, email/calendar failure isolation, RLS, rate limiting, Adelaide DST and UTC storage.

**UI:** keyboard menu, reduced motion, no overflow, home CTA, search links, mobile action bar, independent layout in narrow screens; image errors and optional sections.

### Suggested identity scan

Run and adapt a scan against **production-target sources**, generated output and public assets. Treat references in an intentionally labelled internal audit document separately from production output:

```bash
# Illustrative guard in the NEW repository; scan more aliases found during audit.
git grep -nEi 'HF Removals|hfremovalsadelaide|Noor Removals|noorremovals|Muhammad Rasheed|20 Prunus Ave|Elizabeth Vale Operations Base|Moving Made Easy With Us' -- app components content config lib public || true
```

A `|| true` manual scan is **not** a passing CI assertion. In CI, capture matches and **fail** the pipeline if production files or rendered pages still contain an HF brand indicator. Also search new rendered HTML, OG images, favicon, alt text, emails, JSON-LD, redirects, robots, sitemaps and form payloads for old identity, not just tracked TypeScript.

## 17. Specific acceptance criteria (release blockers)

The site is **not** ready for a live domain until all are true:

- [ ] MRK identity is consistent; **MRK Removals Adelaide**, correct owner/contact handling, verified phone `0423 653 342`, intended new domain, and zero HF/Noor branding or business data in generated public output.
- [ ] No HF- or Noor-owned endpoint, API identifier, analytics property, Google listing, map, booking database, OAuth token or email recipient configured.
- [ ] Genuine services and actual coverage drive every published service/area page; no fake ratings, reviews, insurance, fleet or pricing beyond the approved and clearly qualified indicative $130–$135/hour.
- [ ] Quote delivery is verified on the **new** account; errors never masquerade as successes.
- [ ] No public **Book Now** promise unless booking is independently configured, authorized and end-to-end verified.
- [ ] Phone CTA uses `tel:+61423653342`; no invented email, address or staff contact. Optional unverified channels are withheld.
- [ ] No old-domain canonical or redirects; sitemap/robots reflect deployed new hostname.
- [ ] Main pages display well and function at all representative viewports, with no horizontal page overflow.
- [ ] Mobile navigation, forms, focus and reduced-motion behavior pass accessible functional tests.
- [ ] No critical auth, exposed secrets, broken API integration, broken links or serious console errors.
- [ ] `typecheck`, `lint`, automated tests and production build actually run and pass, with exact results documented.
- [ ] Mubashar Riaz or his authorized representative reviews content, exact rate-disclaimer wording, GST/minimum/call-out uncertainties, ABN presentation, proof claims, legal wording, final assets and deployment destination before production launch.

## 18. Special checks for the original HF codebase

These observations are **reference findings**, not instructions to edit HF:

1. Review `app/layout.tsx` for analytics identifier fallbacks; the new site must never duplicate those values.
2. Review `lib/site-data.ts` for HF-specific review counts, domain, address, form ID and prices; new business config must contain none of them.
3. Review `next.config.ts` for host and legacy redirects; replace with new-domain-specific rules only when relevant.
4. Review `app/components/Site.tsx`, `SiteClient.tsx` and `app/globals.css` for monolithic styling and hardcoded copy; use a modular design system in the new site.
5. Review `app/[...slug]/page.tsx` and `app/areas/[slug]/page.tsx` for schema/route patterns, then choose a clear new route strategy without unnecessary catch-all complexity.
6. Review `supabase/migrations/` and `/admin` only if booking/admin Phase 2 is actually authorized; never wire HF tables to new customer data.
7. Review Web3Forms confirmation and optional quote capture independently; database mirroring is not actual provider delivery.
8. Review HF `DESIGN_AUDIT.md` for past overflow, menu, 3D and image text issues, then prevent recurrence with tests.
9. Check whether the approved new brand has its own working Google Business Profile; never reuse HF's Maps `cid` or testimonial records.
10. Do not use HF's live domain as the target deploy preview, even temporarily.

## 19. Required final report format

After completing any MRK task, respond with grounded findings under:

```markdown
## Reference reviewed
- Source repository, branch and commit
- Key patterns reused, and what was deliberately not copied

## New website delivered
- Files, routes, design system, quote flow, brand and accessibility changes

## Content integrity
- MRK owner-supplied facts used (name, phone, ABN, indicative price) and independent-verification status
- Missing facts omitted / requiring confirmation
- Old-brand scan outcome with evidence

## Integrations
- Quote provider and destination: connected / mocked / blocked
- Booking and admin: intentionally absent / disabled / tested live
- Analytics, Maps, reviews, email, calendar: configured / absent

## Verification evidence
- Exact command, exit code, counts and browser viewport outcomes
- Broken links, console errors, remaining risk

## Deployment
- Not deployed / authorized preview / verified production URL

## Owner inputs still required
- Only genuinely missing fields, in priority order
```

Do not describe checks as passing unless freshly observed. Do not assert the source live deployment is identical to GitHub without verification. Don't include secrets or customer information in the report.

## 20. Launch instruction for the coding agent

**Act now within the target MRK workspace:** inspect HF source read-only; read this AGENT.md and `HF_SOURCE_REVIEW.md` if it actually exists; audit real files and MRK artwork; create an original luxury website for **MRK Removals Adelaide** with AB Web Studio's **ruby red + platinum silver + sapphire blue + midnight black** identity. Use **Mubashar Riaz**, **0423 653 342**, **mrkremovalsadelaide.com.au**, owner-supplied **ABN 95 685 822 473**, and only a clearly qualified **$130–$135/hour indicative range**. Build a beautiful, functional, safe **quote-only** journey while remaining unknown about GST, crew, truck, minimums, surcharges and inbox. Implement independently in test-first increments, do responsive QA and supply factual results. Ask only about genuinely missing publication blockers; do not slow internal implementation for settled details. **Never change or deploy HF Removals and never publish MRK without authorization.**

## 21. MRK-specific design and business acceptance checklist

The following are added to the original HF-informed review discipline. All must be addressed explicitly in the handoff:

- [ ] **Name:** `MRK Removals Adelaide` throughout visible site, alt text, metadata, OG, structured data, preview and forms.
- [ ] **Owner:** `Mubashar Riaz` recorded internally and displayed only where approved.
- [ ] **Phone:** domestic `0423 653 342`, click link `tel:+61423653342`. Mobile sticky call button tested with keyboard and touch.
- [ ] **Domain:** `mrkremovalsadelaide.com.au` in config. Canonical/host behavior verified before real indexing.
- [ ] **ABN:** `95 685 822 473` recorded exactly; independent registry status/entity match is **not** silently assumed.
- [ ] **Rate:** source range AUD 130–135/hour unchanged; publication wording approved, with GST/inclusions/call-out/minimums unconfirmed rather than invented.
- [ ] **Palette:** ruby + platinum + sapphire + black clearly visible; gold not excessive. Light/dark variants and one-colour mark tested.
- [ ] **Media:** believable conceptual branded moving truck, accessible poster fallback, efficient video/animation, no fake real-fleet claim.
- [ ] **Services and coverage:** MRK-specific approved scope only, no HF copy or city-office misrepresentation.
- [ ] **Quote CTA:** callable verified number available even if new MRK form destination is pending. No deceptive "quote received" message.
- [ ] **Data isolation:** no HF or Noor tracking, inbox, API, images, cookies, credentials, schema, redirects, reviews or data.
- [ ] **Accessibility:** WCAG-focused navigation, readable mobile text, no horizontal overflow, reduced-motion compatibility.
- [ ] **Evidence:** exact checks/commands executed, failed or skipped reported; screenshots at representative widths.
- [ ] **Deployment:** no live deployment, DNS changes, external messages, payments or real test submissions without owner authorization.

## 22. Ready-to-run task statement for Codex / Claude / Gemini CLI

> Read this entire `AGENT.md` before editing. You are building **MRK Removals Adelaide** for **AB Web Studio**. Owner: **Mubashar Riaz**. Phone: **0423 653 342** / `tel:+61423653342`. Owner-provided ABN: **95 685 822 473**. Intended domain: **mrkremovalsadelaide.com.au**. Hourly guidance: **AUD $130–$135 per hour**, indicative only because packages, tax, minimums and surcharges remain unconfirmed. Use a **luxury ruby red, platinum silver, sapphire blue and midnight black identity** with little gold, premium cinematic removals imagery and restrained motion. Inspect the current workspace and supplied logo concepts, study `abubakerasif202/HF` as **read-only** reference if accessible, create an original independent Next.js site, keep booking disabled, and build a truthful phone/quote conversion journey. Do not fabricate proof, pricing policies or endpoints. Test functionality, SEO, responsive layouts, accessibility, security and identity isolation. Never edit HF and never publish/change DNS/send real leads without explicit approval. Finish with a factual implementation and remaining-inputs report.
