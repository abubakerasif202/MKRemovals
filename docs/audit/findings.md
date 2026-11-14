# Audit Findings & Risk Mitigation Log — MRK Removals Adelaide

## P0 Launch Blockers Prevented in Target Architecture

1. **Identity & Brand Isolation (P0 — Mitigated)**
   - **Risk:** Accidental leakage of reference brand names, phone numbers, domains, analytics IDs, or addresses in source code, metadata, or JSON-LD.
   - **Mitigation:** Automated identity-leak unit test in `src/config/business.test.ts` scans all business configs, services, service areas, FAQs, and SEO generators to guarantee zero occurrences of forbidden reference strings and 100% consistency of `MRK Removals Adelaide`, `0423 653 342`, `tel:+61423653342`, and `mrkremovalsadelaide.com.au`.

2. **Honest Indicative Rate Qualification (P0 — Mitigated)**
   - **Risk:** Presenting the owner-supplied `$130–$135/hour` range as an all-inclusive binding package or inventing minimum hours, call-out fees, or GST rules.
   - **Mitigation:** Centralised `formatIndicativeRateDisplay()` and `getRateDisclaimer()` helpers in `src/config/business.ts` ensure every pricing display pairs `$130–$135` per hour with the mandatory disclosure regarding unconfirmed GST, truck/crew inclusions, minimums, and travel charges.

3. **Truthful Quote Submission State (P0 — Mitigated)**
   - **Risk:** Claiming an enquiry email was delivered to the business when no live email provider is connected in the preview environment.
   - **Mitigation:** `/api/quote` validates payloads server-side and returns `status: "recorded_preview"` when `MRK_QUOTE_PROVIDER_URL` is not configured. The UI clearly informs the user that their quote details are validated and ready, provides a one-click Copy Move Summary action, and highlights the direct `Call 0423 653 342` button.

## P1 Design & Usability Safeguards

4. **Brand Artwork & Conceptual Fleet Presentation (P1 — Mitigated)**
   - **Finding:** The workspace contains 4 AB Web Studio raster logo concept renders (`ruby_platinum_full_logo_concept_42543a71.png`, `ruby_platinum_compact_logo_concept_cacda257.png`, `ruby_platinum_badge_concept_6a6760d6.png`, `ruby_platinum_round_crest_concept_ff67e362.png`).
   - **Mitigation:** Built a crisp, true-vector SVG logo and monogram system (`src/components/brand/MRKLogo.tsx`) matching the ruby/platinum/sapphire/black aesthetic for zero-blur header/favicon/dark-light usage, while showcasing the supplied high-resolution concept renders in the Brand & Fleet Concept gallery and Hero badge with transparent conceptual labelling.

5. **Mobile Viewport & Reduced Motion Compliance (P1 — Mitigated)**
   - **Mitigation:** Sticky mobile elements are capped well below 15% viewport height; all primary headings and CTAs render immediately without waiting for scroll animations; `prefers-reduced-motion` is respected across CSS and interactive transitions.
