# Reference Inventory & Reuse Matrix (`abubakerasif202/HF` -> MRK Removals Adelaide)

> **Audit Status:** Inspected strictly as a read-only architectural and user-journey reference per `AGENT.md` Section 1 & Section 4. Zero code, credentials, branding, copy, pricing rules, or database connections from HF or Noor Removals are transferred into MRK Removals Adelaide.

## Reuse & Isolation Matrix

| Architectural Area | Reference Pattern Observed | MRK Removals Adelaide Target Implementation | Strictly Excluded (Never Transferred) | Verification Test |
| :--- | :--- | :--- | :--- | :--- |
| **Business Configuration** | Centralized site data module | `src/config/business.ts` with strict `EvidenceValue<T>` typing for MRK (`0423 653 342`, `ABN 95 685 822 473`, `$130–$135/hr` indicative range) | All HF/Noor names, phones, addresses, emails, rates, call-out rules, and review snapshots | `src/config/business.test.ts` |
| **Visual Identity & Tokens** | Monolithic CSS file | Modular Tailwind CSS v4 + `@theme` tokens in `src/index.css` (`#090D15` Midnight Black, `#C81036` Ruby Red, `#C9D2DC` Platinum Silver, `#124FA3` Sapphire Blue, `#C5A15C` subtle Gold accent) | HF palette, truck liveries, CEO portraits, and monolithic CSS | Visual QA & computed styles |
| **Homepage Narrative** | Multi-section conversion funnel | Modular components (`Hero`, `TrustProcessStrip`, `ServicesBento`, `MovingDayExperience`, `PricingTeaser`, `MovingSteps`, `AreasDirectoryPreview`, `QuoteSection`, `FaqSection`) | HF slogans, fake review badges, and package calculators | Browser snapshot & viewport QA |
| **Service Pages** | Dynamic slug routing | `src/content/services.ts` + `/services` and `/services/:slug` with unique scope checklists, quote factors, and Adelaide-specific moving considerations | Duplicated boilerplate text or unverified service guarantees | Route & SEO unit tests |
| **Adelaide Service Areas** | Grouped Adelaide regions | `src/content/service-areas.ts` + `/service-areas` and `/service-areas/:slug` covering 7 genuine Adelaide metropolitan corridors with strata, parking, and access guidance | Thin doorway suburb clones or implied local branch offices | Content uniqueness & slug tests |
| **Quote Lead Journey** | Web3Forms + optional DB mirror | Dedicated `/api/quote` Express endpoint + `src/lib/quote-validation.ts` with Australian phone/suburb validation, rate limiting, honeypot, and honest `recorded_preview` vs `delivered` state | HF Web3Forms keys, HF admin email, or false "delivered" messages when unconfigured | `src/lib/quote-validation.test.ts` |
| **Live Booking Engine** | `/book` with Supabase holds | Intentionally omitted in Phase 1 (`bookingMode: "quote-only"`). Replaced with an Interactive Move Scope Preparation Builder that feeds into the Quote Form without calculating binding prices | HF 3-hour minimum, 1-hour call-out rule, Supabase migrations, and Stripe checkout | `bookingMode` assertion in unit tests |
