# Web3Forms browser delivery repair

The production failure returned `web3forms:http_403` (reference `MRK-2026-N9OP6`). Web3Forms public/free form keys require browser submission. Server API calls require a paid plan and server IP allowlisting: https://docs.web3forms.com/getting-started/troubleshooting . Updating the access key alone did not resolve this transport mismatch. The owner explicitly selected browser submission and authorized one labelled live test.

## One delivery flow

1. `POST /api/quote` validates the existing form, honeypot, rate limit and attempt ID. It reserves the attempt with the existing shared store and returns a short-lived signed dispatch ticket and the prepared Web3Forms payload. This response is **not** success and sends no email.
2. The browser posts that payload once to the fixed `https://api.web3forms.com/submit` endpoint. The key is a public form access key by Web3Forms design, not a private sending API token.
3. The UI shows success only for a successful HTTP response with literal `success: true`. A signed acknowledgement to `/api/quote` records the browser report for deduplication and releases the attempt lock. It never invokes another email provider.

The server does not independently verify the browser's provider response, so acknowledgement records are labelled `browser_reported`, never server-confirmed delivery. Known accepted attempts are not resent. If bookkeeping fails after provider acceptance, the UI keeps the genuine success and does not send again. Provider rejection retains entered details and allows an explicit retry with the same attempt ID. An ambiguous network response warns that acceptance is unknown and advises calling before retrying; the public provider endpoint cannot guarantee exactly-once email delivery after a lost response.

Signed tickets expire after 45 seconds, within the 60-second shared claim window. Memory fallback claims now expire as well, so abandoning a page does not lock an attempt forever. Forged/expired receipts cannot update acceptance records. Redis remains the production shared store; memory fallback remains best effort during an outage. Browser mode does not fall back to another sending provider, avoiding duplicate emails after uncertain responses. Email/call fallback remains available.

## Configuration

- `web3form_key` or `WEB3FORMS_ACCESS_KEY`: the current owner-supplied Web3Forms public form key, stored in Vercel and returned only after valid preparation.
- `WEB3FORMS_DELIVERY_MODE=browser`: select browser transport. Existing server transport remains available for paid server access or existing server-mode Resend fallback.
- `QUOTE_BROWSER_SIGNING_SECRET`: independent random server-only secret of at least 32 characters. Never returned to the browser or committed.
- Existing Redis settings remain unchanged.

## Validation

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
npx.cmd playwright test e2e/quote-browser.spec.ts --project=chromium --project=iphone
npx.cmd playwright test e2e/site.spec.ts --project=chromium --grep 'quote validation|confirmed delivery|provider failure|network failure|retry after failure'
```

Unit coverage includes preparation without sending, concurrent claims, rejected retries, forged/expired acknowledgements, missing configuration, abandoned memory leases, strict provider acknowledgement, network ambiguity, single provider call and bookkeeping failure after acceptance. Browser tests cover homepage/contact/quote success, failure retention/retry, unknown outcomes and bookkeeping failure. All automated delivery tests mock the provider; the separately authorized live test is limited to one actual email-producing request.

Results: TypeScript and build pass (24 prerendered routes). Unit suite: 57 passed, four external Redis integration skips. New browser flow: 12 passes across Chromium and iPhone/WebKit emulation. Existing quote validation, delivery, rejection, network-error and retry regressions: five passes. No email is sent by those mocked tests.
