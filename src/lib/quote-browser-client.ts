/** Web3Forms public access keys are intended for browser submission, not server proxying. */
export interface BrowserQuoteDispatch {
  ticket: string;
  referenceId: string;
  payload: Record<string, string | boolean> & {
    access_key: string;
    message: string;
  };
}
export interface BrowserQuoteResult {
  confirmed: boolean;
  uncertain: boolean;
  referenceId: string;
  timestamp: string;
}

function isDispatch(value: unknown): value is BrowserQuoteDispatch {
  if (!value || typeof value !== "object") return false;
  const item = value as BrowserQuoteDispatch;
  return (
    typeof item.ticket === "string" &&
    item.ticket.length <= 2048 &&
    item.ticket.length > 0 &&
    typeof item.referenceId === "string" &&
    /^MRK-\d{4}-[A-Z0-9]{5}$/.test(item.referenceId) &&
    !!item.payload &&
    typeof item.payload === "object" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      item.payload.access_key,
    ) &&
    typeof item.payload.message === "string" &&
    item.payload.message.length > 0
  );
}

export async function submitBrowserQuote(
  value: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<BrowserQuoteResult> {
  if (!isDispatch(value))
    throw new Error("Invalid browser delivery preparation");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let confirmed = false;
  let uncertain = false;
  try {
    // One email-producing request. The endpoint is fixed, never taken from an API response.
    const response = await fetchImpl("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(value.payload),
      signal: controller.signal,
    });
    let data: { success?: unknown } | null = null;
    try {
      data = await response.json();
    } catch {
      /* No readable acknowledgement means no confirmation. */
    }
    confirmed = response.ok && data?.success === true;
    uncertain = response.ok && data?.success !== false && !confirmed;
  } catch {
    // A lost response may follow acceptance: never assert that no email was sent.
    uncertain = true;
  } finally {
    clearTimeout(timeout);
  }

  const receiptController = new AbortController();
  const receiptTimeout = setTimeout(() => receiptController.abort(), 5000);
  try {
    // This records only a browser report, not independent server/provider confirmation.
    // Once the provider has accepted, bookkeeping failure must never trigger another email.
    const receipt = await fetchImpl("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "browser-result",
        ticket: value.ticket,
        accepted: confirmed,
      }),
      signal: receiptController.signal,
    });
    if (!receipt.ok && confirmed)
      console.warn(
        "Quote accepted by provider; receipt bookkeeping unavailable.",
      );
  } catch {
    if (confirmed)
      console.warn(
        "Quote accepted by provider; receipt bookkeeping unavailable.",
      );
  } finally {
    clearTimeout(receiptTimeout);
  }
  return {
    confirmed,
    uncertain,
    referenceId: value.referenceId,
    timestamp: new Date().toISOString(),
  };
}
