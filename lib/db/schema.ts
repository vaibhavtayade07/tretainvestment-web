import { sql } from "drizzle-orm";

import { check, date, index, integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orgs = pgTable(
  "orgs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    arnCode: text("arn_code"),
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .unique()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id),
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    riskProfile: text("risk_profile").notNull().default("moderate"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("clients_org_id_idx").on(table.orgId)],
);

export const holdings = pgTable(
  "holdings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    schemeName: text("scheme_name").notNull(),
    amfiCode: text("amfi_code"),
    category: text("category").notNull().default("equity"),
    folioNo: text("folio_no"),
    units: numeric("units", { precision: 20, scale: 4 }).notNull(),
    avgCost: numeric("avg_cost", { precision: 18, scale: 6 }).notNull(),
    currentNav: numeric("current_nav", { precision: 18, scale: 6 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("holdings_org_id_client_id_idx").on(table.orgId, table.clientId)],
);

export const sips = pgTable(
  "sips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    schemeName: text("scheme_name").notNull(),
    monthlyAmount: numeric("monthly_amount", { precision: 20, scale: 2 }).notNull(),
    dayOfMonth: integer("day_of_month").notNull(),
    startDate: date("start_date").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("sips_org_id_client_id_idx").on(table.orgId, table.clientId),
    check("sips_day_of_month_check", sql`${table.dayOfMonth} between 1 and 31`),
  ],
);
