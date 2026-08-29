# Say It — Premium TikTok Dedication Platform

A production-ready web app for a weekly TikTok live show. Viewers send a romantic dedication, the host contacts the recipient on WhatsApp during the live, and reads the message out loud. Donations are optional and never block a submission.

**Write → Submit → Donate → Wait for the Live Surprise**

## Technology stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- React Hook Form patterns + Zod
- Neon PostgreSQL + Drizzle ORM
- Auth.js (credentials, HTTP-only cookies, hashed passwords)
- Vercel-friendly architecture

## Installation

```bash
npm install
cp .env.example .env.local
```

Fill in the variables in `.env.local`, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_TIKTOK_URL` | Public TikTok profile or live URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional public contact number for the show |
| `PAYPAL_DONATION_URL` | Donation link after submission (Zelle by default) |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | Reserved for future PayPal API confirmation |
| `CRON_SECRET` | Protects the weekly retention cron on Vercel |
| `AUTH_SECRET` | Auth.js secret (generate with `openssl rand -base64 32`) |
| `ADMIN_SECRET` | Optional extra secret used to hash rate-limit keys |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Local seed account only |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile |

Never put database credentials, Auth secrets, or PayPal secrets in client code.

## Neon database setup

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL`.
3. Apply the schema with either:

```bash
npm run db:push
```

or paste `drizzle/migrations/0000_init.sql` into the Neon SQL editor.

4. Seed the admin account and default settings:

```bash
npm run db:seed
```

## Drizzle

```bash
npm run db:generate   # generate migrations after schema changes
npm run db:push       # push schema to Neon (simplest for first setup)
npm run db:migrate    # apply SQL migrations
npm run db:studio     # browse data
npm run db:seed       # create/update local admin
```

Schema lives in `drizzle/schema.ts`.

## Local development

1. `npm install`
2. Configure `.env.local`
3. `npm run db:push`
4. `npm run db:seed`
5. `npm run dev`

Public pages still render without a database (countdown, copy, layout). Submitting a dedication and using the admin dashboard require `DATABASE_URL`.

## Admin account

The seed script creates **one** admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Passwords are hashed with bcrypt. There is no plaintext password storage.

Sign in at `/admin/login`.

Do not reuse the seed password in production. Create a unique admin after deploy and rotate secrets.

## Donations (Zelle)

Donations are optional. The dedication is stored **before** the donation screen appears.

The default donation link is the Zelle QR URL:

`https://zellepay.com/qr/8036ce78-68f7-43c3-8833-2a40e4f93798`

Override it with `PAYPAL_DONATION_URL` or in admin settings. The app never marks a donation as completed unless an admin confirms it.

## Vercel deployment

1. Push the repo and import it into Vercel.
2. Set every environment variable in the Vercel project.
3. `AUTH_SECRET` is required in production.
4. Run `db:push` / SQL migration against the production Neon database.
5. Seed a production admin with a strong unique password, then remove seed credentials from the environment if you used them only once.

Production checklist:

- [ ] `DATABASE_URL` points to Neon
- [ ] `AUTH_SECRET` is unique and long
- [ ] `NEXT_PUBLIC_SITE_URL` is the live domain
- [ ] `NEXT_PUBLIC_TIKTOK_URL` is the show URL
- [ ] Donation URL is set (Zelle by default)
- [ ] Admin password is not the local default
- [ ] Privacy and Terms were reviewed
- [ ] Recipient WhatsApp numbers never appear on public pages
- [ ] `CRON_SECRET` is set if you use the weekly retention job

Retention: completed, read-live, and rejected dedications older than the Settings retention window are archived by the Saturday Vercel cron (`/api/cron/retention`) or the **Archive expired dedications** button in Settings.

## Privacy

Recipient WhatsApp numbers are admin-only. Public APIs and dedication cards never include phone numbers, IP hashes, or internal notes.

## Routes

- `/` landing
- `/dedicate` 4-step dedication form
- `/success` confirmation + optional donation
- `/live` show page + countdown
- `/dedication/[public_id]` public confirmation (no WhatsApp or notes)
- `/faq` `/privacy` `/terms`
- `/admin` dashboard
- `/admin/dedications` management
- `/admin/live` drag-and-drop queue
- `/admin/live/mode` host view
- `/admin/donations`
- `/admin/users` owner-only team access
- `/admin/settings`
