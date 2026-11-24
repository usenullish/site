import { createHash, randomBytes } from "node:crypto";
import { contactResponse } from "../lib/contact.ts";
import type { MiddlewareHandler } from "astro";
import { isEmptyString } from "../utils/nullish.utils.ts";

const ONE_MINUTE_IN_MS = 60 * 1000;

const ONE_HOUR_WINDOW_IN_MS = 60 * ONE_MINUTE_IN_MS;
const MAX_ATTEMPTS = 5;

const MAX_ENTRIES = 10_000;

const attempts = new Map<string, { count: number; resetAt: number }>();

// For simplicity we restart with a fresh cache on restart.
const SALT = randomBytes(32);

const hashIp = (ip: string): string => createHash("sha256").update(SALT).update(ip).digest("hex");

// Cleanup expired requests periodically
const cleanupTimer = setInterval(() => {
  const now = Date.now();

  for (const [key, { resetAt }] of attempts) {
    if (resetAt <= now) {
      attempts.delete(key);
    }
  }
}, ONE_MINUTE_IN_MS);

// Don't let the timer keep the process alive, e.g. so `astro build` can exit
cleanupTimer.unref();

const recordAttempt = ({ key }: { key: string }): { isRateLimited: boolean } => {
  const now = Date.now();

  const entry = attempts.get(key);

  if (entry === undefined || now >= entry.resetAt) {
    // Protect the memory against a bot flooding requests
    if (attempts.size >= MAX_ENTRIES) {
      const oldestKey = attempts.keys().next().value;
      if (oldestKey) {
        attempts.delete(oldestKey);
      }
    }

    attempts.set(key, { count: 1, resetAt: now + ONE_HOUR_WINDOW_IN_MS });
    return { isRateLimited: false };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { isRateLimited: true };
  }

  entry.count += 1;
  return { isRateLimited: false };
};

export const rateLimitMiddleware: MiddlewareHandler = async (context, next) => {
  const { request, url, redirect } = context;

  if (request.method !== "POST" || url.pathname !== "/api/contact") {
    return next();
  }

  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = import.meta.env.DEV ? (forwardedIp ?? context.clientAddress) : forwardedIp;

  if (isEmptyString(ip)) {
    console.error("The contact request has no X-Forwarded-For header.");

    const form = await request.clone().formData();
    return contactResponse({ request, form, status: "error", redirect });
  }

  const { isRateLimited } = recordAttempt({ key: hashIp(ip) });

  if (isRateLimited) {
    const form = await request.clone().formData();
    return contactResponse({ request, form, status: "limit", redirect });
  }

  return next();
};
