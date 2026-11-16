import { z } from "zod";

// ─── Clients ───

export const createClientSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  riskProfile: z
    .enum(["conservative", "moderate", "aggressive"])
    .default("moderate"),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const updateClientSchema = createClientSchema.extend({
  clientId: z.string().uuid(),
});

// ─── Holdings ───

export const createHoldingSchema = z.object({
  clientId: z.string().uuid(),
  schemeName: z.string().trim().min(1, "Scheme name is required"),
  amfiCode: z.string().trim().optional().or(z.literal("")),
  category: z.enum(["equity", "debt", "hybrid", "other"]).default("equity"),
  folioNo: z.string().trim().optional().or(z.literal("")),
  units: z.coerce.number().positive("Units must be positive"),
  avgCost: z.coerce.number().positive("Cost must be positive"),
  currentNav: z.coerce.number().positive("NAV must be positive"),
});

export const updateHoldingSchema = createHoldingSchema.extend({
  holdingId: z.string().uuid(),
}).omit({ clientId: true });

// ─── SIPs ───

export const createSipSchema = z.object({
  clientId: z.string().uuid(),
  schemeName: z.string().trim().min(1, "Scheme name is required"),
  monthlyAmount: z.coerce.number().positive("Amount must be positive"),
  dayOfMonth: z.coerce.number().int().min(1).max(31),
  startDate: z.string().min(1, "Start date is required"),
  status: z.enum(["active", "paused", "stopped"]).default("active"),
});

export const updateSipSchema = createSipSchema.extend({
  sipId: z.string().uuid(),
}).omit({ clientId: true });
