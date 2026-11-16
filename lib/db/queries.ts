import { count, eq, and, ilike, sql, desc } from "drizzle-orm";

import { db } from ".";
import { clients, holdings, sips } from "./schema";

// ─── Dashboard ───

export async function getDashboardStats(orgId: string) {
  const [clientCount] = await db
    .select({ value: count() })
    .from(clients)
    .where(eq(clients.orgId, orgId));

  const [aumResult] = await db
    .select({
      value: sql<number>`coalesce(sum(${holdings.units} * ${holdings.currentNav}), 0)`,
    })
    .from(holdings)
    .where(eq(holdings.orgId, orgId));

  const [activeSipCount] = await db
    .select({ value: count() })
    .from(sips)
    .where(and(eq(sips.orgId, orgId), eq(sips.status, "active")));

  const [monthlyFlow] = await db
    .select({
      value: sql<number>`coalesce(sum(${sips.monthlyAmount}), 0)`,
    })
    .from(sips)
    .where(and(eq(sips.orgId, orgId), eq(sips.status, "active")));

  return {
    totalClients: clientCount.value,
    aum: Number(aumResult.value),
    activeSips: activeSipCount.value,
    monthlyFlow: Number(monthlyFlow.value),
  };
}

export async function getRecentClients(orgId: string, limit = 5) {
  return db
    .select({
      id: clients.id,
      fullName: clients.fullName,
      email: clients.email,
      createdAt: clients.createdAt,
    })
    .from(clients)
    .where(eq(clients.orgId, orgId))
    .orderBy(desc(clients.createdAt))
    .limit(limit);
}

// ─── Clients ───

export async function listClients(orgId: string, search?: string) {
  const conditions = [eq(clients.orgId, orgId)];
  if (search) {
    conditions.push(ilike(clients.fullName, `%${search}%`));
  }
  return db
    .select()
    .from(clients)
    .where(and(...conditions))
    .orderBy(desc(clients.createdAt));
}

export async function getClient(orgId: string, clientId: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.orgId, orgId), eq(clients.id, clientId)))
    .limit(1);
  return client ?? null;
}

// ─── Holdings ───

export async function getClientHoldings(orgId: string, clientId: string) {
  return db
    .select()
    .from(holdings)
    .where(and(eq(holdings.orgId, orgId), eq(holdings.clientId, clientId)))
    .orderBy(desc(holdings.createdAt));
}

export async function getHolding(orgId: string, holdingId: string) {
  const [holding] = await db
    .select()
    .from(holdings)
    .where(and(eq(holdings.orgId, orgId), eq(holdings.id, holdingId)))
    .limit(1);
  return holding ?? null;
}

// ─── SIPs ───

export async function getClientSips(orgId: string, clientId: string) {
  return db
    .select()
    .from(sips)
    .where(and(eq(sips.orgId, orgId), eq(sips.clientId, clientId)))
    .orderBy(desc(sips.createdAt));
}

export async function getSip(orgId: string, sipId: string) {
  const [sip] = await db
    .select()
    .from(sips)
    .where(and(eq(sips.orgId, orgId), eq(sips.id, sipId)))
    .limit(1);
  return sip ?? null;
}
