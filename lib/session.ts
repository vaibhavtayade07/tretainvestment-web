import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orgs } from "@/lib/db/schema";

/**
 * Tenancy primitives for /app pages and server actions.
 *
 * requireUser(): authenticated user or bust.
 * requireOrg():  the tenant gate — every org-scoped query starts here.
 */

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** Redirects to /login when there is no session. Returns the user id. */
export async function requireUser(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  return userId;
}

export async function getOrgForUser(userId: string) {
  const [org] = await db
    .select()
    .from(orgs)
    .where(eq(orgs.ownerUserId, userId))
    .limit(1);
  return org ?? null;
}

/** Redirects to /onboarding when the user has no org yet. */
export async function requireOrg(): Promise<{ userId: string; orgId: string }> {
  const userId = await requireUser();
  const org = await getOrgForUser(userId);
  if (!org) redirect("/onboarding");
  return { userId, orgId: org.id };
}
