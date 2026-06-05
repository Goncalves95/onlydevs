# OnlyDevs

Developer merch store — t-shirts, hoodies, and accessories for developers and DevOps engineers.
Ships across Switzerland and Europe via Printful print-on-demand.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Auth.js v5 (NextAuth) — Google OAuth + Credentials + Resend magic-link |
| Payments | Stripe (Checkout Sessions + Webhooks) |
| Fulfilment | Printful API (print-on-demand) |
| Email | Resend |
| i18n | next-intl (en, de, fr, it, pt) |
| Styling | Tailwind CSS v4 |
| Rate limiting | Upstash Redis |
| Deployment | Vercel |
| DNS / CDN | Cloudflare |

## Development Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/Goncalves95/onlydevs.git
   cd onlydevs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   # Fill all values — see .env.production.example for documentation
   ```

4. **Set up the database**

   Generate the SQL from the Prisma schema:

   ```bash
   npx tsx scripts/generate-migration-sql.ts
   ```

   Then paste `prisma/migrations/production-init.sql` into the **Supabase SQL Editor** for your dev project.

5. **Generate the Prisma client**

   ```bash
   npx prisma generate
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

   App is at `http://localhost:3000`.

## Deployment

### First deploy

1. Push the `main` branch — Vercel auto-deploys on every push.
2. Set all production environment variables in the **Vercel dashboard** (reference `.env.production.example`).
3. Run the production SQL migration in the **Supabase SQL Editor** for the production project.
4. Create a **Stripe live webhook** endpoint:
   - URL: `https://onlydevs.store/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel.
5. Verify the domain `onlydevs.store` in **Resend** to enable transactional email.
6. Configure **Cloudflare DNS** to point `onlydevs.store` → Vercel deployment.

### Ongoing deploys

```
git push origin main       # → Vercel Production (live keys, real Printful)
git push origin development # → Vercel Preview (test keys, mock data in dev mode)
```

## Environment Variables

See [`.env.production.example`](.env.production.example) for the full list with documentation.

Never commit `.env.local` or `.env.production`.

## Security

- All secrets in environment variables only — never in source code.
- Admin access controlled by `role = "ADMIN"` in the database; admin routes return `404` for non-admins.
- Passwords hashed with bcrypt; never selected in queries unless explicitly needed.
- Rate limiting on all `/api/` routes via Upstash Redis.
- CSP, HSTS, and other security headers configured in `next.config.ts`.
- Stripe webhooks verified with `stripe.webhooks.constructEvent`.

## Branch Strategy

| Branch | Vercel Environment | Keys | Printful |
|---|---|---|---|
| `development` | Preview | Stripe test (`sk_test_`) | Mock data in dev |
| `main` | Production | Stripe live (`sk_live_`) | Real API |

## Admin

Promote a user to admin via the script:

```bash
npx tsx scripts/make-admin.ts your@email.com
```
