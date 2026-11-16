# Treta Web

**Multi-tenant dashboard for mutual-fund distributors.** The web front end for [Treta](../tretainvestment) — manage clients, holdings, and SIPs with org-level data isolation.

<p>
<img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js">
<img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
<img alt="Postgres" src="https://img.shields.io/badge/Postgres-Drizzle-336791?logo=postgresql&logoColor=white">
<img alt="Tailwind 4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white">
<img alt="License" src="https://img.shields.io/badge/License-MIT-green">
</p>

---

## Features

- **Multi-tenant by design** — every row carries `org_id`; queries are scoped through a session-derived org, so one distributor never sees another's clients.
- **Client book** — add, search, edit clients with risk profile and notes.
- **Holdings** — per-client scheme holdings (AMFI code, folio, units, avg cost, current NAV).
- **SIPs** — monthly instalment plans with amount, debit day, start date, and status.
- **Live dashboard** — aggregate stats and charts (Recharts) across the book.
- **Auth** — email + password with NextAuth v5 and bcrypt; signup creates a user, onboarding creates the org.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Language | TypeScript 5 |
| DB / ORM | PostgreSQL + Drizzle ORM (`drizzle-kit` migrations) |
| Auth | NextAuth v5 (Credentials) + bcryptjs |
| UI | Tailwind CSS 4, Recharts |
| Validation | Zod |

## Data model

```
users ──1:1── orgs ──1:N── clients ──1:N── holdings
                                └──1:N── sips
```

All domain tables carry `org_id` and are indexed on it; `clients` cascade-deletes their holdings and SIPs.

## Quickstart

```bash
npm install
cp .env.example .env      # fill DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_SITE_URL
npx drizzle-kit push      # apply schema
npm run dev               # http://localhost:3000
```

Generate a secret with `openssl rand -base64 32`.

### Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | NextAuth signing secret |
| `NEXT_PUBLIC_SITE_URL` | Public base URL |

## Project layout

```
app/
├── (auth)/        # login, signup, onboarding
├── (app)/         # authenticated shell: dashboard, clients
└── api/auth/      # NextAuth route handlers
components/        # app shell, forms, charts, tables
lib/
├── actions/       # server actions (clients, holdings, sips)
├── db/            # schema, queries
└── auth.ts        # NextAuth config
```

## License

MIT — see [LICENSE](LICENSE).
