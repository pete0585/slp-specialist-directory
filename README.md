# SLP Specialist Directory

Find a speech-language pathologist by specialty — not just by location.

**Domain:** findslpspecialist.com  
**Stack:** Next.js 15, TypeScript, Tailwind CSS, Supabase, Stripe, Vercel  
**Supabase Project:** fbuqrnzofktepkzyfmhy (shared Directories project, table prefix `slp_`)

---

## What This Is

The only US-wide directory that lets patients find an SLP by their specific condition:
- Pediatric feeding therapy
- Childhood apraxia of speech
- Autism & AAC
- Aphasia (post-stroke)
- Stuttering & fluency
- Voice disorders (including LSVT Loud, gender-affirming)
- Dysphagia & swallowing
- Accent modification
- Selective mutism

Built from NPI Registry data (250,000+ licensed SLPs, taxonomy 235Z00000X).

---

## Local Development

```bash
cp .env.example .env.local
# Fill in your env vars
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://fbuqrnzofktepkzyfmhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_VERIFIED_PRICE_ID=price_...   # $99/year
STRIPE_FEATURED_PRICE_ID=price_...   # $249/year
NEXT_PUBLIC_SITE_URL=https://www.findslpspecialist.com
ADMIN_EMAIL=adam@thestrategicveteran.com
RESEND_API_KEY=re_...
```

All env vars are already set in Vercel (set by bootstrap agent). The `.env.example` is a reference only.

---

## Database Setup

The migration runs against the shared Directories Supabase project (`fbuqrnzofktepkzyfmhy`).

Apply via MCP (already done during build):
```
mcp__supabase__apply_migration("supabase/migrations/001_initial_schema.sql")
```

Or via Supabase CLI:
```bash
supabase db push --db-url postgresql://...
```

Tables created:
- `slp_listings` — main listing data, full-text search via tsvector trigger
- `slp_claims` — claim verification tokens (72h expiry)
- `slp_payments` — Stripe payment records for revenue-monitor agent
- `slp_specialties` — canonical specialty list (seeded at migration)

---

## Seeding Data

```bash
SUPABASE_URL=https://fbuqrnzofktepkzyfmhy.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_key> \
npx tsx scripts/seed.ts
```

Pulls from NPI Registry API (free, no key required):
- Taxonomy code `235Z00000X` (Speech-Language Pathologist)
- Top 50 US metro areas
- ~3,000–5,000 listings expected

---

## Deployment

Vercel project is already configured and linked to this GitHub repo by the bootstrap agent.

Deploy:
```bash
git push origin main
```

Vercel auto-deploys on every push to `main`.

Custom domains configured:
- `www.findslpspecialist.com` (primary)
- `findslpspecialist.com` (redirects to www)

---

## Stripe Setup

Products and prices are created by the bootstrap agent:
- **Verified** listing: $99/year → `STRIPE_VERIFIED_PRICE_ID`
- **Featured** listing: $249/year → `STRIPE_FEATURED_PRICE_ID`

Stripe webhook endpoint:
- URL: `https://www.findslpspecialist.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Revenue Model

- **Free tier**: Auto-seeded from NPI data. "Claim this listing" CTA on every profile.
- **Verified — $99/year**: Priority placement, specialty badges, credential badges, full contact info.
- **Featured — $249/year**: Top-3 placement per city, "Featured SLP" badge, highlighted on specialty pages.

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Homepage with specialty-first search |
| `/slp` | Browse all SLPs with filters |
| `/slp/[state]/[city]/[slug]` | Individual SLP listing (SEO-indexed) |
| `/speech-therapist/[specialty]` | Specialty landing pages (9 specialties) |
| `/submit` | Add your listing (free) |
| `/claim/[id]` | Claim flow + upgrade to Verified/Featured |
| `/admin` | Protected admin dashboard |

---

## Outreach

The outreach agent (`agents/outreach/`) handles email sequences to unclaimed listings.
Sending domain: `mail.findslpspecialist.com`
Inbound email webhook: `https://www.findslpspecialist.com/api/inbound-email` (www — required)
