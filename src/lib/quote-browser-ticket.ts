import { createHmac, timingSafeEqual } from "node:crypto";

// Shorter than the shared 60-second claim: an expired receipt cannot release a newer lease.
const TICKET_TTL_MS = 45_000;
export interface BrowserTicket {
  attemptId: string;
  referenceId: string;
  expiresAt: number;
}
export function hasBrowserSigningSecret(
  secret: string | undefined,
): secret is string {
  return typeof secret === "string" && secret.length >= 32;
}
export function createBrowserTicket(
  attemptId: string,
  referenceId: string,
  secret: string,
  now: number,
): string {
  const payload = Buffer.from(
    JSON.stringify({ attemptId, referenceId, expiresAt: now + TICKET_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
export function verifyBrowserTicket(
  value: unknown,
  secret: string | undefined,
  now: number,
): BrowserTicket | null {
  if (
    !hasBrowserSigningSecret(secret) ||
    typeof value !== "string" ||
    value.length > 2048
  )
    return null;
  const parts = value.split(".");
  if (
    parts.length !== 2 ||
    parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))
  )
    return null;
  const expected = createHmac("sha256", secret).update(parts[0]).digest();
  const actual = Buffer.from(parts[1], "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return null;
  try {
    const ticket = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8"),
    ) as BrowserTicket;
    if (
      typeof ticket.attemptId !== "string" ||
      !ticket.attemptId ||
      ticket.attemptId.length > 80 ||
      typeof ticket.referenceId !== "string" ||
      !/^MRK-\d{4}-[A-Z0-9]{5}$/.test(ticket.referenceId) ||
      !Number.isFinite(ticket.expiresAt) ||
      ticket.expiresAt <= now ||
      ticket.expiresAt > now + TICKET_TTL_MS
    )
      return null;
    return ticket;
  } catch {
    return null;
  }
}
