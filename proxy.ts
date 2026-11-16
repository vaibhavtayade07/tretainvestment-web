import NextAuth from "next-auth";
import type { NextRequest } from "next/server";

import { authConfig } from "./auth.config";

/**
 * Request-level auth gate.
 *
 * Next.js 16 renamed the `middleware.ts` file convention to `proxy.ts`
 * (`middleware` is deprecated). This is the split-config pattern from
 * Auth.js v5: the base config verifies the JWT session cookie on every
 * matched request and enforces its `authorized` callback; unauthenticated
 * /app|/onboarding requests are redirected to /login?callbackUrl=... by
 * Auth.js default handling.
 */
const { auth } = NextAuth(authConfig);

// Next.js's build-time check requires an explicitly declared function export,
// so wrap the NextAuth middleware handler instead of re-exporting it directly.
export default async function proxy(request: NextRequest): Promise<Response> {
  // Auth.js's middleware wrapper accepts (request, event) at runtime.
  return (
    auth as unknown as (req: NextRequest) => Promise<Response>
  )(request);
}

export const config = {
  matcher: [
    // Run on everything except API routes (/api/auth must stay reachable),
    // Next internals, favicon and static assets.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
