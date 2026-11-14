# MRK Removals Adelaide — Brand Facts & Evidence Ledger

> **Single Source of Truth:** All public claims on the MRK Removals Adelaide website are governed by this ledger and enforced programmatically via `src/config/business.ts` and unit tests (`src/config/business.test.ts`).

| Claim ID | Field | Value | Source | Verified At | Approval Status | Publication Rule |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `brandName` | Trading / Brand Display Name | `MRK Removals Adelaide` | `owner-brief` | Unverified in ABR | `supplied` | Display verbatim in headings, navigation, metadata, and structured data. Do not claim registered corporate entity status until ABR verification is completed. |
| `ownerContactName` | Owner / Contact Name | `Mubashar Riaz` | `owner-brief` | Owner-supplied | `supplied` | Recorded in typed business config and About/Contact leadership attribution. Do not invent additional job titles or staff headcounts. |
| `phoneDisplay` | Domestic Phone | `0423 653 342` | `owner-brief` | Owner-supplied | `approved` | Active across header, hero, contact page, quote fallback, and mobile action bar. |
| `phoneHref` | E.164 Telephone URI | `tel:+61423653342` | `owner-brief` | Owner-supplied | `approved` | Mandatory href for all click-to-call interactive elements. |
| `domain` | Intended Domain | `mrkremovalsadelaide.com.au` | `owner-brief` | Pending DNS/host check | `supplied` | Canonical origin `https://mrkremovalsadelaide.com.au` configured in single constant. Keep preview `noindex` until domain cutover is authorized. |
| `abn` | Owner-Supplied ABN | `95 685 822 473` | `owner-brief` | Checksum valid; ABR entity match unverified | `supplied` | Display as `ABN 95 685 822 473 (Owner-supplied)` without asserting independent ABR entity verification until confirmed. |
| `indicativeHourlyAUD` | Hourly Rate Guidance | `AUD $130–$135 per hour` | `owner-brief` | Owner-supplied | `supplied` | Must always appear as **"Indicative hourly rates: $130–$135. Request a quote for your move."** paired with **"Rates include GST. Final pricing depends on your moving requirements; please confirm inclusions, minimums and travel charges."** (GST inclusion confirmed by owner) |
| `creativeDirection` | Brand Aesthetic & Palette | Ruby Red (`#C81036`), Platinum Silver (`#C9D2DC`), Sapphire Blue (`#124FA3`), Midnight Black (`#090D15`), Champagne Gold (`#C5A15C` <= 5%) | `owner-brief` | Approved brief | `approved` | Enforced via `src/index.css` design tokens. Gold used strictly for subtle luxury hairline/kicker accents. |
| `bookingMode` | Reservation Mode | `quote-only` | `owner-brief` | Active | `approved` | Live booking (`/book`) is disabled. All primary CTAs route to Quote Enquiry or Click-to-Call (`0423 653 342`). |
