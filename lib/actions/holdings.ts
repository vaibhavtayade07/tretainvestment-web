"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { holdings } from "@/lib/db/schema";
import { requireOrg } from "@/lib/session";
import {
  createHoldingSchema,
  updateHoldingSchema,
} from "@/lib/validations";

export type FormState = { error?: string };

export async function createHoldingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const parsed = createHoldingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.insert(holdings).values({
    orgId,
    clientId: parsed.data.clientId,
    schemeName: parsed.data.schemeName,
    amfiCode: parsed.data.amfiCode || null,
    category: parsed.data.category,
    folioNo: parsed.data.folioNo || null,
    units: String(parsed.data.units),
    avgCost: String(parsed.data.avgCost),
    currentNav: String(parsed.data.currentNav),
  });

  revalidatePath(`/app/clients/${parsed.data.clientId}`);
  redirect(`/app/clients/${parsed.data.clientId}`);
}

export async function updateHoldingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const parsed = updateHoldingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await db
    .update(holdings)
    .set({
      schemeName: parsed.data.schemeName,
      amfiCode: parsed.data.amfiCode || null,
      category: parsed.data.category,
      folioNo: parsed.data.folioNo || null,
      units: String(parsed.data.units),
      avgCost: String(parsed.data.avgCost),
      currentNav: String(parsed.data.currentNav),
    })
    .where(
      and(
        eq(holdings.id, parsed.data.holdingId),
        eq(holdings.orgId, orgId),
      ),
    )
    .returning({ id: holdings.id });

  if (result.length === 0) {
    return { error: "Holding not found." };
  }

  // We need clientId to redirect — fetch it from the holding
  const [holding] = await db
    .select({ clientId: holdings.clientId })
    .from(holdings)
    .where(eq(holdings.id, parsed.data.holdingId))
    .limit(1);

  revalidatePath(`/app/clients/${holding?.clientId}`);
  redirect(`/app/clients/${holding?.clientId}`);
}

export async function deleteHoldingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const holdingId = formData.get("holdingId") as string;
  const clientId = formData.get("clientId") as string;
  if (!holdingId || !clientId) return { error: "Missing IDs." };

  await db
    .delete(holdings)
    .where(and(eq(holdings.id, holdingId), eq(holdings.orgId, orgId)));

  revalidatePath(`/app/clients/${clientId}`);
  redirect(`/app/clients/${clientId}`);
}
