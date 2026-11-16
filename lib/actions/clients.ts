"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { requireOrg } from "@/lib/session";
import {
  createClientSchema,
  updateClientSchema,
} from "@/lib/validations";

export type FormState = { error?: string };

export async function createClientAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const parsed = createClientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const [inserted] = await db
    .insert(clients)
    .values({
      orgId,
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      riskProfile: parsed.data.riskProfile,
      notes: parsed.data.notes || null,
    })
    .returning({ id: clients.id });

  revalidatePath("/app/clients");
  redirect(`/app/clients/${inserted.id}`);
}

export async function updateClientAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const parsed = updateClientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await db
    .update(clients)
    .set({
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      riskProfile: parsed.data.riskProfile,
      notes: parsed.data.notes || null,
    })
    .where(
      and(eq(clients.id, parsed.data.clientId), eq(clients.orgId, orgId)),
    )
    .returning({ id: clients.id });

  if (result.length === 0) {
    return { error: "Client not found." };
  }

  revalidatePath("/app/clients");
  revalidatePath(`/app/clients/${parsed.data.clientId}`);
  redirect(`/app/clients/${parsed.data.clientId}`);
}

export async function deleteClientAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { orgId } = await requireOrg();

  const clientId = formData.get("clientId") as string;
  if (!clientId) return { error: "Missing client ID." };

  await db
    .delete(clients)
    .where(and(eq(clients.id, clientId), eq(clients.orgId, orgId)));

  revalidatePath("/app/clients");
  redirect("/app/clients");
}
