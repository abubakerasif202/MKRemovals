# MRK Removals Adelaide — Pending Owner Decisions & Open Items

These items are tracked for Mubashar Riaz's confirmation prior to production domain cutover and indexation. None of these items block the quote-only preview website, and the application safely withholds unconfirmed claims rather than fabricating policies.

## Priority 1 — Pre-Launch Commercial & Legal Confirmations

1. **Quote Delivery Provider & Dedicated Inbox**
   - **Current Behaviour:** `/api/quote` is the only submission path. It delivers via Web3Forms (key read from `WEB3FORMS_ACCESS_KEY`, or the existing Vercel production secret `web3form_key`), with optional Resend fallback. The form shows "Quote Sent Successfully" only when the provider confirms delivery; otherwise it keeps the customer's data and offers retry, email and call. Preview deployments have no key, so they report `not_configured` honestly.
   - **Owner Action Required:** (a) Live test enquiry: owner reports done. (b) Confirm whether enquiries should go to a dedicated MRK inbox rather than `mkremovalsadelaide@gmail.com` (MK vs MRK spelling is a known point to verify, not changed). (c) Decide whether a persistent lead store is wanted; today the audit trail is a PII-free runtime log line only.
2. **Rate Inclusions** (owner confirmed: rate includes GST; 3-hour minimum plus 1-hour call-out fee). Still open: what crew/truck the $130 vs $135 rates correspond to.
   - **Current Preview Behaviour:** Displays `Indicative hourly rates: $130–$135` with explicit qualification that GST, truck size, crew count, minimum hours, call-out/travel charges, stairs, and heavy-item conditions are confirmed per move quote.
   - **Owner Action Required:** Confirm whether $130/hr and $135/hr correspond to specific crew/truck configurations or weekday/weekend rates, whether rates include GST, and what minimum hours or call-out fees apply.

3. **Australian Business Register (ABR) Entity Match & Legal Copy**
   - **Current Preview Behaviour:** Displays owner-supplied ABN `95 685 822 473` transparently and marks Privacy Policy and Terms & Conditions as prepared for owner and legal review.
   - **Owner Action Required:** Confirm exact legal entity name registered against ABN `95 685 822 473`, public depot/postal address (if any), and insurance policy wording/certificates before asserting insurance coverage publicly.

## Priority 2 — Operational Scope & Social Proof

4. **Final Approved Service Categories & Suburb Coverage**
   - **Current Preview Behaviour:** Presents core Adelaide residential, apartment, office, furniture, packing, and bulky-item enquiry paths alongside grouped Adelaide metropolitan corridor guides without claiming physical branch offices in suburbs.
   - **Owner Action Required:** Confirm whether interstate removals, storage, or regional South Australia corridors should be added or excluded.

5. **Verified Customer Reviews & Fleet Photography**
   - **Current Preview Behaviour:** Zero fabricated star ratings, review counts, or fake customer testimonials. Uses custom-engineered MRK conceptual fleet graphics and AB Web Studio brand marks explicitly labelled as conceptual brand visuals.
   - **Owner Action Required:** Supply verified Google Business Profile link (once established for MRK) and real photographs of MRK trucks/crew when available.
