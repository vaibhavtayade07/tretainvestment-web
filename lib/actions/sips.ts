"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { sips } from "@/lib/db/schema";
import { requireOrg } from "@/lib/session";
import { createSipSchema, updateSipSchema } from "@/lib/validations";

export type FormState = { error?: string };

export async function createSipAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const parsed = createSipSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.insert(sips).values({
    orgId,
    clientId: parsed.data.clientId,
    schemeName: parsed.data.schemeName,
    monthlyAmount: String(parsed.data.monthlyAmount),
    dayOfMonth: parsed.data.dayOfMonth,
    startDate: parsed.data.startDate,
    status: parsed.data.status,
  });

  revalidatePath(`/app/clients/${parsed.data.clientId}`);
  redirect(`/app/clients/${parsed.data.clientId}`);
}

export async function updateSipAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const parsed = updateSipSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await db
    .update(sips)
    .set({
      schemeName: parsed.data.schemeName,
      monthlyAmount: String(parsed.data.monthlyAmount),
      dayOfMonth: parsed.data.dayOfMonth,
      startDate: parsed.data.startDate,
      status: parsed.data.status,
    })
    .where(and(eq(sips.id, parsed.data.sipId), eq(sips.orgId, orgId)))
    .returning({ id: sips.id });

  if (result.length === 0) {
    return { error: "SIP not found." };
  }

  const [sip] = await db
    .select({ clientId: sips.clientId })
    .from(sips)
    .where(eq(sips.id, parsed.data.sipId))
    .limit(1);

  revalidatePath(`/app/clients/${sip?.clientId}`);
  redirect(`/app/clients/${sip?.clientId}`);
}

export async function toggleSipStatusAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const sipId = formData.get("sipId") as string;
  const clientId = formData.get("clientId") as string;
  const currentStatus = formData.get("currentStatus") as string;
  if (!sipId || !clientId || !currentStatus) return { error: "Missing fields." };

  const newStatus = currentStatus === "active" ? "paused" : "active";

  await db
    .update(sips)
    .set({ status: newStatus })
    .where(and(eq(sips.id, sipId), eq(sips.orgId, orgId)));

  revalidatePath(`/app/clients/${clientId}`);
  redirect(`/app/clients/${clientId}`);
}

export async function deleteSipAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const sipId = formData.get("sipId") as string;
  const clientId = formData.get("clientId") as string;
  if (!sipId || !clientId) return { error: "Missing IDs." };

  await db
    .delete(sips)
    .where(and(eq(sips.id, sipId), eq(sips.orgId, orgId)));

  revalidatePath(`/app/clients/${clientId}`);
  redirect(`/app/clients/${clientId}`);
}
