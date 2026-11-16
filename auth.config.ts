import type { NextAuthConfig } from "next-auth";

// Base Auth.js config shared by lib/auth.ts (full instance) and proxy.ts
// (request gate). Keep this file free of DB/bcrypt imports so the proxy
// bundle stays lean and edge-safe.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // Real providers are registered in lib/auth.ts.
  providers: [],
  session: {
    // Credentials sign-in requires JWT sessions.
    strategy: "jwt",
  },
  trustHost: true,
  callbacks: {
    // Enforced by proxy.ts on every matched request. Returning `false`
    // makes Auth.js redirect to pages.signIn with ?callbackUrl=<href>.
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = request.nextUrl;

      // /app/* requires an authenticated user.
      if (pathname.startsWith("/app")) return isLoggedIn;

      // /onboarding requires an authenticated user but NOT an org;
      // org ownership is checked server-side by the page itself.
      if (pathname.startsWith("/onboarding")) return isLoggedIn;

      return true;
    },
  },
} satisfies NextAuthConfig;
