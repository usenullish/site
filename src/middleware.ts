import { sequence } from "astro:middleware";
import { rateLimitMiddleware } from "./middlewares/rate-limit.middleware.ts";

// Astro - not Starlight SSG - middlewares.
export const onRequest = sequence(rateLimitMiddleware);
