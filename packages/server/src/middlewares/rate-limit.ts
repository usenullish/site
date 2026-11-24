import { createHash, randomBytes } from "node:crypto";
import { getConnInfo } from "@hono/node-server/conninfo";
import { rateLimiter } from "hono-rate-limiter";

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

const SALT = randomBytes(32);

const hashIp = (ip: string): string => createHash("sha256").update(SALT).update(ip).digest("hex");

export const rateLimitMiddleware = rateLimiter({
  windowMs: WINDOW_MS,
  limit: LIMIT,
  standardHeaders: "draft-7",
  keyGenerator: (context) => {
    const forwardedIp = context.req.header("x-forwarded-for")?.split(",")[0]?.trim();

    const ip =
      process.env.NODE_ENV === "production"
        ? forwardedIp
        : (forwardedIp ?? getConnInfo(context).remote.address);

    if (ip === undefined || ip === "") {
      throw new Error("The request cannot be processed.");
    }

    return hashIp(ip);
  },
  handler: (context) => context.json({ status: "limited" as const }, 429),
});
