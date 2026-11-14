import { createHash } from 'node:crypto';

/**
 * State used by /api/quote for rate limiting and idempotency.
 *
 * Vercel serverless functions run as many short-lived instances, so in-process Maps only protect
 * a single warm instance. When UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (or the Vercel
 * KV_REST_API_* aliases) are set, state is shared in Redis and the guarantees hold across instances.
 * Without them the memory store is a best-effort fallback and the docs say so plainly.
 */

export interface AttemptRecord {
  referenceId: string;
  timestamp: string;
  provider: string;
}

export interface QuoteStore {
  readonly kind: 'memory' | 'redis';
  /** Counts this request; resolves false once the caller exceeds the limit. */
  rateLimit(ip: string, nowMs: number): Promise<boolean>;
  getDelivered(attemptId: string): Promise<AttemptRecord | null>;
  setDelivered(attemptId: string, record: AttemptRecord): Promise<void>;
  /** Exclusive short-lived lock so two instances never send the same attempt at once. */
  claim(attemptId: string): Promise<boolean>;
  release(attemptId: string): Promise<void>;
}

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 6;
export const DELIVERED_TTL_SECONDS = 24 * 60 * 60;
export const CLAIM_TTL_SECONDS = 60;
const MAX_MEMORY_ENTRIES = 500;

function trim(map: Map<string, unknown>) {
  while (map.size > MAX_MEMORY_ENTRIES) {
    const oldest = map.keys().next().value;
    if (oldest === undefined) break;
    map.delete(oldest);
  }
}

/** Raw IPs are never stored: only a truncated hash is used as a key. */
export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 24);
}

export function createMemoryStore(): QuoteStore {
  const rate = new Map<string, { count: number; windowStart: number }>();
  const delivered = new Map<string, AttemptRecord>();
  const claims = new Set<string>();
  return {
    kind: 'memory',
    async rateLimit(ip, nowMs) {
      const entry = rate.get(ip);
      if (!entry || nowMs - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rate.set(ip, { count: 1, windowStart: nowMs });
        trim(rate);
        return true;
      }
      if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return false;
      entry.count += 1;
      return true;
    },
    async getDelivered(id) {
      return delivered.get(id) ?? null;
    },
    async setDelivered(id, record) {
      delivered.set(id, record);
      trim(delivered);
    },
    async claim(id) {
      if (claims.has(id)) return false;
      claims.add(id);
      return true;
    },
    async release(id) {
      claims.delete(id);
    },
  };
}

type RedisResult = { result?: unknown; error?: string };

export function createRedisStore(
  baseUrl: string,
  token: string,
  fetchImpl: typeof fetch = fetch
): QuoteStore {
  const root = baseUrl.replace(/\/+$/, '');

  async function call(path: string, commands: unknown): Promise<RedisResult[]> {
    const res = await fetchImpl(`${root}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw new Error(`redis_http_${res.status}`);
    const data = (await res.json()) as RedisResult | RedisResult[];
    return Array.isArray(data) ? data : [data];
  }
  const one = async (cmd: unknown[]) => (await call('', cmd))[0];

  return {
    kind: 'redis',
    async rateLimit(ip) {
      const key = `mrk:rl:${hashIp(ip)}`;
      const [incr] = await call('/pipeline', [
        ['INCR', key],
        ['EXPIRE', key, Math.floor(RATE_LIMIT_WINDOW_MS / 1000), 'NX'],
      ]);
      if (incr?.error) throw new Error(incr.error);
      return Number(incr?.result) <= RATE_LIMIT_MAX_REQUESTS;
    },
    async getDelivered(id) {
      const r = await one(['GET', `mrk:done:${id}`]);
      if (r?.error) throw new Error(r.error);
      if (typeof r?.result !== 'string') return null;
      try {
        return JSON.parse(r.result) as AttemptRecord;
      } catch {
        return null;
      }
    },
    async setDelivered(id, record) {
      const r = await one(['SET', `mrk:done:${id}`, JSON.stringify(record), 'EX', DELIVERED_TTL_SECONDS]);
      if (r?.error) throw new Error(r.error);
    },
    async claim(id) {
      const r = await one(['SET', `mrk:claim:${id}`, '1', 'NX', 'EX', CLAIM_TTL_SECONDS]);
      if (r?.error) throw new Error(r.error);
      return r?.result === 'OK';
    },
    async release(id) {
      await one(['DEL', `mrk:claim:${id}`]);
    },
  };
}

/**
 * Wraps a shared store with a memory fallback. If Redis is unreachable the request is still served
 * (customers are never blocked by an infrastructure fault) and `onFallback` is notified for logging.
 * Delivery honesty is unaffected: "delivered" still requires provider confirmation.
 */
export function withFallback(
  primary: QuoteStore,
  fallback: QuoteStore,
  onFallback: (op: string, err: unknown) => void = () => undefined
): QuoteStore {
  const guard = async <T>(op: string, run: (s: QuoteStore) => Promise<T>): Promise<T> => {
    try {
      return await run(primary);
    } catch (err) {
      onFallback(op, err);
      return run(fallback);
    }
  };
  return {
    kind: primary.kind,
    rateLimit: (ip, now) => guard('rateLimit', (s) => s.rateLimit(ip, now)),
    getDelivered: (id) => guard('getDelivered', (s) => s.getDelivered(id)),
    setDelivered: (id, r) => guard('setDelivered', (s) => s.setDelivered(id, r)),
    claim: (id) => guard('claim', (s) => s.claim(id)),
    release: (id) => guard('release', (s) => s.release(id)),
  };
}

export interface StoreEnv {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
}

export function readStoreEnv(env: NodeJS.ProcessEnv = process.env): StoreEnv {
  return {
    UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL,
    UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN,
  };
}

let cached: QuoteStore | undefined;

/** Process-wide store: Redis-backed (with memory fallback) when configured, otherwise memory. */
export function getQuoteStore(
  env: StoreEnv = readStoreEnv(),
  log: (op: string, err: unknown) => void = () => undefined
): QuoteStore {
  if (cached) return cached;
  const memory = createMemoryStore();
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  const token = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  cached = url && token ? withFallback(createRedisStore(url, token), memory, log) : memory;
  return cached;
}
