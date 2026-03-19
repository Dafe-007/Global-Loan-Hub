# Trust Global Finance

## Overview

A cross-border loan platform MVP built with a pnpm monorepo. Users can sign up, apply for loans, and view their status. Admins can approve/reject loans.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/trust-global)
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect with PKCE)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── trust-global/       # React + Vite frontend (Trust Global Finance)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── replit-auth-web/    # Browser auth hook (useAuth)
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

### users
- id (varchar, PK)
- email (varchar, unique)
- name (varchar)
- firstName (varchar)
- lastName (varchar)
- profileImageUrl (varchar)
- isAdmin (boolean, default false)
- createdAt, updatedAt (timestamps)

### loans
- id (serial, PK)
- userId (text, FK → users.id)
- fullName, country, phoneNumber, monthlyIncomeRange (text)
- amount (numeric), duration (integer, months)
- status (enum: pending/approved/rejected, default pending)
- repaymentDate (text), monthlyPayment (numeric)
- createdAt (timestamp)

### sessions
- Standard session table for Replit Auth

## Features

### Landing Page (/)
- Hero with loan calculator (sliders for amount + duration, real-time repayment estimate)
- Trust stats, testimonials, security badges
- Log in / Sign up button

### Auth (/login)
- Replit Auth flow (no custom forms)
- Redirects to /dashboard after login

### Dashboard (/dashboard)
- User's loan list with status badges
- Apply for loan button

### Apply Loan (/apply)
- Full form: name, country, phone, income range, amount, duration
- Auto-approval logic: income >= $1000 AND amount <= $10000 → approved; otherwise pending

### Admin Panel (/admin)
- Only for users with isAdmin=true
- View all loans with approve/reject actions
- View all users

## Loan Auto-Approval Logic

```
IF income >= $1000 AND amount <= $10000 → auto-approved
IF income >= $2500 AND amount <= $25000 → auto-approved
IF income >= $5000 AND amount <= $50000 → auto-approved
ELSE → pending (admin review)
```

## Making a User Admin

Run SQL to grant admin access:
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

## API Routes

- GET /api/auth/user — current auth state
- GET /api/login — OIDC login redirect
- GET /api/callback — OIDC callback
- GET /api/logout — logout
- GET /api/loans — user's loans
- POST /api/loans — apply for loan
- GET /api/admin/loans — all loans (admin only)
- PATCH /api/admin/loans/:id — update loan status (admin only)
- GET /api/admin/users — all users (admin only)

## Monthly Repayment Formula

`monthlyPayment = (amount × (1 + 0.02 × duration)) / duration`

This uses a flat 2% monthly interest rate.

## Dev Commands

- `pnpm --filter @workspace/api-server run dev` — start API server
- `pnpm --filter @workspace/trust-global run dev` — start frontend
- `pnpm --filter @workspace/db run push` — push DB schema
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client
