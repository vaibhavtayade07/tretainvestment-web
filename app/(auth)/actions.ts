"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CredentialsSignin } from "next-auth";
import { z } from "zod";

import { db } from "@/lib/db";
import { orgs, users } from "@/lib/db/schema";
import { signIn } from "@/lib/auth";
import { requireUser } from "@/lib/session";

export type FormState = { error?: string };

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const createOrgSchema = z.object({
  name: z.string().trim().min(1, "Firm name is required"),
  arnCode: z.string().trim().optional(),
});

function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input";
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return { error: "An account with this email already exists." };
  }

  // Cost 10 per project convention; the plain password never leaves this scope.
  const passwordHash = await hash(parsed.data.password, 10);

  try {
    await db.insert(users).values({
      email,
      passwordHash,
      name: parsed.data.name,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "An account with this email already exists." };
    }
    throw error;
  }

  // Sign in immediately; new users have no org yet, so land on onboarding.
  // signIn redirects (throws NEXT_REDIRECT internally), so this is the end
  // of the happy path.
  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/onboarding",
  });
  return {};
}

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  const email = parsed.data.email.trim().toLowerCase();

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/app",
    });
  } catch (error) {
    // Bad credentials / unknown user surface here; everything else rethrows
    // (including Next's internal NEXT_REDIRECT on success).
    if (error instanceof CredentialsSignin) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  // Unreachable: signIn redirects on success (see signUpAction).
  return {};
}

export async function createOrgAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await requireUser();

  const parsed = createOrgSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  try {
    await db.insert(orgs).values({
      name: parsed.data.name,
      arnCode: parsed.data.arnCode || null,
      ownerUserId: userId,
    });
  } catch (error) {
    // owner_user_id is unique — user already onboarded, just send them through.
    if (isUniqueViolation(error)) redirect("/app");
    throw error;
  }

  redirect("/app");
}
