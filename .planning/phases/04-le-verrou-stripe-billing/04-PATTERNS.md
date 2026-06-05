# Phase 4: Le Verrou & Stripe Billing - Pattern Map

**Mapped:** 2026-06-05
**Files analyzed:** 10 new/modified files
**Analogs found:** 9 / 10 (stripe/webhook.post.ts has no direct analog — uses RESEARCH.md pattern)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `server/api/v1/admin/qualify.post.ts` | controller | request-response | `server/api/v1/admin/approve-pro.post.ts` | exact |
| `server/api/v1/leads/index.get.ts` | controller | request-response | `server/api/v1/admin/queue.get.ts` | exact |
| `server/api/v1/leads/[id].get.ts` | controller | request-response | `server/api/v1/admin/queue.get.ts` | role-match |
| `server/api/v1/stripe/checkout.post.ts` | controller | request-response | `server/api/v1/pro/claim.post.ts` | role-match |
| `server/api/v1/stripe/webhook.post.ts` | controller | event-driven | *(no analog — see No Analog Found)* | none |
| `app/pages/espace/leads/index.vue` | component | request-response | `app/pages/app/dashboard.vue` | exact |
| `app/pages/espace/leads/[id].vue` | component | request-response | `app/pages/app/dashboard.vue` | role-match |
| `app/pages/espace/premium.vue` | component | request-response | `app/pages/app/dashboard.vue` | role-match |
| `supabase/migrations/20260606000000_phase4_unlock_cron.sql` | migration | batch | `supabase/migrations/20260603000000_schema_initial.sql` | role-match |
| `nuxt.config.ts` | config | — | `nuxt.config.ts` (self, modify) | exact |

---

## Pattern Assignments

### `server/api/v1/admin/qualify.post.ts` (controller, request-response)

**Analog:** `server/api/v1/admin/approve-pro.post.ts`

**Imports pattern** (approve-pro.post.ts lines 1-2):
```typescript
import { z } from 'zod'
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
```

**Admin auth pattern** (approve-pro.post.ts lines 9-14):
```typescript
const user = await serverSupabaseUser(event)
if (!user) throw createError({ statusCode: 401, statusMessage: 'Non autorisé.' })

const isAdmin = (user as any).app_metadata?.role === 'admin'
if (!isAdmin) throw createError({ statusCode: 403, statusMessage: 'Accès réservé aux administrateurs.' })
```

**Zod validation pattern** (approve-pro.post.ts lines 4-7, 16-18):
```typescript
const schema = z.object({
  pro_id: z.string().uuid(),
  approved: z.boolean()
})

const body = await readBody(event)
const parsed = schema.safeParse(body)
if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Données invalides.' })
```

**Service role + multi-step mutation pattern** (approve-pro.post.ts lines 21-55):
```typescript
const supabase = await serverSupabaseServiceRole(event) as any

// Step 1: validate preconditions with a SELECT
const { data: verifs } = await supabase
  .from('verifications')
  .select('document_type, status')
  .eq('pro_id', pro_id)
  .eq('status', 'approved')

// Step 2: UPDATE primary table
await supabase
  .from('professionals')
  .update({ is_verified: approved })
  .eq('id', pro_id)

// Step 3: audit log
await supabase.from('audit_logs').insert({
  actor_id: (user as any).id,
  action: 'doc_validated',
  target_table: 'professionals',
  target_id: pro_id,
  metadata: { manual_approval: true, approved }
})

return { status: 'SUCCESS', approved }
```

**Adaptation notes for qualify.post.ts:**
- Schema: `z.object({ project_id: z.string().uuid() })`
- Step 1: UPDATE `projects.status = 'qualified'`, SELECT `category`
- Step 2: SELECT pros by `category + is_verified = true`
- Step 3: UPSERT `leads` with `onConflict: 'project_id,pro_id'` for idempotence (see RESEARCH.md Pattern 5 for full logic)
- No `audit_logs` insert required (not in D-03 scope), but can mirror the pattern from verify.post.ts lines 117-127 if desired
- Return: `{ qualified: true, leads_created: number }`

---

### `server/api/v1/leads/index.get.ts` (controller, request-response)

**Analog:** `server/api/v1/admin/queue.get.ts`

**Imports + service role bypass pattern** (queue.get.ts lines 1-10):
```typescript
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Non autorisé.' })

  // NOTE: for leads, omit the admin check — this is a pro-facing endpoint
  const supabase = await serverSupabaseServiceRole(event) as any
```

**Multi-table fetch + in-memory join pattern** (queue.get.ts lines 12-30):
```typescript
const { data: pros, error: e1 } = await supabase
  .from('professionals')
  .select('id, company_name, ...')
  .order('created_at', { ascending: false })

if (e1) throw createError({ statusCode: 500, statusMessage: e1.message })

const { data: verifs, error: e2 } = await supabase
  .from('verifications')
  .select('*')
  .order('created_at', { ascending: false })

if (e2) throw createError({ statusCode: 500, statusMessage: e2.message })

const professionals = (pros || []).map((p: any) => ({
  ...p,
  verifications: (verifs || []).filter((v: any) => v.pro_id === p.id)
}))

return { professionals }
```

**Adaptation notes for leads/index.get.ts:**
- Auth: `serverSupabaseUser` (pro auth, NOT admin check)
- Service role required: ADR-004 — masking logic must happen server-side with full data access
- Use a single Supabase query with join syntax instead of two separate queries:
  `.from('leads').select('id, status, unlocked_at, created_at, projects(...)')` 
- Apply masking map after fetch (full logic in RESEARCH.md Pattern 1)
- The `map()` transform pattern mirrors the `professionals.map()` pattern from queue.get.ts lines 26-29
- Order: `.order('created_at', { ascending: false })` — same as analog

---

### `server/api/v1/leads/[id].get.ts` (controller, request-response)

**Analog:** `server/api/v1/admin/queue.get.ts` (service role + fetch pattern)

**Route parameter extraction** (Nitro convention, not in existing files — use `getRouterParam`):
```typescript
const id = getRouterParam(event, 'id')
if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })
```

**Single-row fetch + error pattern** (see projects.post.ts lines 67-88 for `.single()` pattern):
```typescript
const { data: lead, error } = await supabase
  .from('leads')
  .select('id, status, unlocked_at, created_at, projects(...)')
  .eq('id', id)
  .eq('pro_id', user.id)   // ownership check — pro can only see their own lead
  .single()

if (error || !lead) throw createError({ statusCode: 404, statusMessage: 'Lead introuvable.' })
```

**Masking logic:** same as index.get.ts — apply identical Premium/BASIC/claimed branching before returning. Extract to a shared helper `server/utils/maskLead.ts` to avoid duplication.

---

### `server/api/v1/stripe/checkout.post.ts` (controller, request-response)

**Analog:** `server/api/v1/pro/claim.post.ts` (authenticated POST, service role lookup, return URL/ID)

**Imports pattern** (claim.post.ts lines 1-2 + Stripe addition):
```typescript
import { z } from 'zod'
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
// Add: import Stripe from 'stripe'
```

**Auth + userId extraction pattern** (claim.post.ts lines 46-54):
```typescript
const user = await serverSupabaseUser(event)
if (!user) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Non autorisé. Veuillez vous connecter.'
  })
}
const userId = (user as any).id ?? (user as any).sub
```

**runtimeConfig for secrets** (nuxt.config.ts pattern — see config section below):
```typescript
const config = useRuntimeConfig(event)
// Access: config.stripeSecretKey, config.stripePriceId, config.public.siteUrl
```

**Service role lookup pattern** (claim.post.ts lines 68-76 — single-row lookup):
```typescript
const supabase = await serverSupabaseServiceRole(event) as any
const { data: existingPro } = await supabase
  .from('professionals')
  .select('id')
  .eq('id', userId)
  .maybeSingle()
```

**Error wrapping pattern** (claim.post.ts lines 252-258):
```typescript
} catch (error: any) {
  if (error.statusCode) throw error
  throw createError({
    statusCode: 500,
    statusMessage: error.message || 'Internal Server Error'
  })
}
```

**Critical Stripe-specific additions** (from RESEARCH.md Pattern 2 — no codebase analog):
```typescript
const stripe = new Stripe(config.stripeSecretKey as string, {
  httpClient: Stripe.createFetchHttpClient(), // MANDATORY for Cloudflare Pages
})
// Use sessionParams.customer if stripe_customer_id exists (D-15)
// Return: { url: session.url }
```

---

### `server/api/v1/stripe/webhook.post.ts` (controller, event-driven)

**No close analog in codebase.** This is the only event-driven handler in the project. Use RESEARCH.md Pattern 3 directly.

**Critical constraints (no analog to copy from — these are Cloudflare-specific requirements):**
1. Use `readRawBody(event)` not `readBody(event)` — raw body required for Stripe signature verification
2. Use `constructEventAsync()` not `constructEvent()` — synchronous version crashes on Cloudflare V8 runtime
3. Use `Stripe.createSubtleCryptoProvider()` as 5th parameter to `constructEventAsync()`
4. Use `Stripe.createFetchHttpClient()` when instantiating Stripe — no native Node.js `http` on Cloudflare

**The only reusable patterns from existing code:**

*Service role pattern* (queue.get.ts line 10):
```typescript
const supabase = await serverSupabaseServiceRole(event) as any
```

*runtimeConfig access* (see nuxt.config.ts section):
```typescript
const config = useRuntimeConfig(event)
// config.stripeSecretKey, config.stripeWebhookSecret
```

*Error throw pattern* (approve-pro.post.ts line 11):
```typescript
throw createError({ statusCode: 400, statusMessage: 'Signature ou corps manquant.' })
```

**Full implementation must follow RESEARCH.md Pattern 3 exactly** — do not deviate from `constructEventAsync` + `SubtleCryptoProvider`.

---

### `app/pages/espace/leads/index.vue` (component, request-response)

**Analog:** `app/pages/app/dashboard.vue`

**Script setup + head pattern** (dashboard.vue lines 1-5):
```vue
<script setup lang="ts">
const supabase = useSupabaseClient()
const user     = useSupabaseUser()

useHead({ title: 'Mes leads — BÂTI-AXE' })
```

**Auth guard pattern** (dashboard.vue lines 7-10) — use exactly as-is:
```typescript
watchEffect(() => {
  if (user.value === null) navigateTo('/pro/claim')
})
```

**useAsyncData fetch pattern** (dashboard.vue lines 13-21):
```typescript
const { data: leads, refresh } = await useAsyncData('pro-leads', async () => {
  if (!user.value) return null
  const { data } = await $fetch('/api/v1/leads')
  return data
})
```
Note: leads data comes from the Nitro API (already masked), not direct Supabase client call. Pattern differs from dashboard.vue which calls Supabase directly. Use `$fetch` to the Nitro endpoint.

**Card layout with computed badge pattern** (dashboard.vue lines 37-42 — adapt `docStatus` helper):
```typescript
const leadStatus = (lead: any) => {
  if (lead.status === 'claimed') return { label: 'Déjà attribué', cls: 'text-muted-foreground border-border' }
  if (lead.status === 'unlocked') return { label: 'Débloqué', cls: 'text-foreground border-foreground/30' }
  return { label: 'Disponible dans...', cls: 'text-amber-700 border-amber-300 bg-amber-50' }
}
```

**Template structure pattern** (dashboard.vue lines 81-179 — use same max-w + padding):
```vue
<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <!-- Auth-gated content, same as dashboard -->
    <template v-if="leads && leads.length">
      <!-- card grid -->
    </template>
  </div>
</template>
```

---

### `app/pages/espace/leads/[id].vue` (component, request-response)

**Analog:** `app/pages/app/dashboard.vue`

**Auth guard:** identical `watchEffect` pattern (dashboard.vue lines 8-10).

**Route param + useAsyncData pattern:**
```typescript
const route = useRoute()
const { data: lead } = await useAsyncData(`lead-${route.params.id}`, async () => {
  if (!user.value) return null
  const data = await $fetch(`/api/v1/leads/${route.params.id}`)
  return data
})
```

**Conditional display pattern** (dashboard.vue lines 85-93 — `v-if="user && !pro"` guard):
```vue
<div v-if="lead?.status === 'locked'">
  <!-- Show blurred card + "Passer Premium" CTA -->
</div>
<template v-else-if="lead?.status === 'unlocked'">
  <!-- Show full contact details -->
</template>
```

---

### `app/pages/espace/premium.vue` (component, request-response)

**Analog:** `app/pages/app/dashboard.vue`

**Auth guard:** identical `watchEffect` pattern (dashboard.vue lines 8-10).

**Pro profile fetch pattern** (dashboard.vue lines 13-21 — fetch subscription_status):
```typescript
const { data: pro } = await useAsyncData('pro-premium', async () => {
  if (!user.value) return null
  const { data } = await supabase
    .from('professionals')
    .select('id, subscription_status, stripe_customer_id')
    .eq('id', user.value.id)
    .maybeSingle()
  return data
})
```

**Checkout CTA handler** (new pattern — no analog, but follows $fetch convention):
```typescript
const startCheckout = async () => {
  const { url } = await $fetch('/api/v1/stripe/checkout', { method: 'POST' })
  if (url) window.location.href = url
}
```

**Status badge pattern** (dashboard.vue lines 98-105 — inline badge):
```vue
<span
  class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border rounded-full"
  :class="pro?.subscription_status === 'active' ? 'border-foreground/30 text-foreground' : 'border-amber-300 text-amber-700 bg-amber-50'"
>
  {{ pro?.subscription_status === 'active' ? 'Premium actif' : 'BASIC' }}
</span>
```

---

### `supabase/migrations/20260606000000_phase4_unlock_cron.sql` (migration, batch)

**Analog:** `supabase/migrations/20260603000000_schema_initial.sql`

**Migration header convention** (schema_initial.sql lines 1-3):
```sql
-- Supabase Migration: Phase 4 — Unlock Cron + Schema Gaps
-- Date: 2026-06-06
-- Author: Antigravity
```

**Extension declaration pattern** (schema_initial.sql lines 5-7):
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

**ALTER TYPE pattern** (gap from RESEARCH.md §Gap 2 — new value, not in initial schema):
```sql
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'claimed';
```

**ALTER TABLE pattern** (gap from RESEARCH.md §Gap 1):
```sql
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS timeline_range TEXT;
```

**Index pattern** (schema_initial.sql lines 147-155):
```sql
CREATE INDEX IF NOT EXISTS idx_leads_unlock_check
  ON leads (unlocked_at, created_at, status)
  WHERE unlocked_at IS NULL;
```

**cron.schedule() pattern** (RESEARCH.md Pattern 4 — no analog in codebase):
```sql
SELECT cron.schedule(
  'auto-unlock-leads-72h',
  '0 * * * *',
  $$
    UPDATE leads
    SET unlocked_at = created_at + INTERVAL '72 hours'
    WHERE unlocked_at IS NULL
      AND status != 'claimed'
      AND created_at + INTERVAL '72 hours' <= NOW()
  $$
);
```

**Ordering within migration:** extensions → ALTER TYPE → ALTER TABLE → indexes → cron jobs. Mirrors the initial migration's ordering: extensions → types → tables → indexes → RLS.

---

### `nuxt.config.ts` (config, modify)

**Analog:** `nuxt.config.ts` (self — additive modification only)

**Current runtimeConfig block:** does not exist — `nuxt.config.ts` has no `runtimeConfig` key at present (confirmed by reading lines 1-53).

**Pattern to add** — insert after `shadcn` block, before `future` block:
```typescript
runtimeConfig: {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePriceId: process.env.STRIPE_PRICE_ID,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  public: {
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  }
},
```

**Existing config structure to preserve** (nuxt.config.ts lines 8-53):
- `compatibilityDate`, `devtools`, `css`, `modules`, `vite`, `nitro` (with `cloudflare-pages` preset + `nodejs_compat` flag), `supabase`, `shadcn`, `future` — all unchanged.
- The `nitro.cloudflare.pages.compatibilityFlags: ['nodejs_compat']` flag is already present and is required for Stripe's `createFetchHttpClient()` to work on Cloudflare Pages.

---

## Shared Patterns

### Authentication (all server endpoints)

**Source:** `server/api/v1/admin/queue.get.ts` lines 3-5
**Apply to:** ALL new server endpoints (`qualify`, `leads/index`, `leads/[id]`, `stripe/checkout`)
```typescript
const user = await serverSupabaseUser(event)
if (!user) throw createError({ statusCode: 401, statusMessage: 'Non autorisé.' })
```
Note: `stripe/webhook.post.ts` does NOT use this pattern — Stripe webhooks are not user-authenticated; they use signature verification instead.

### Admin Authorization

**Source:** `server/api/v1/admin/queue.get.ts` lines 7-8
**Apply to:** `qualify.post.ts` only
```typescript
const isAdmin = (user as any).app_metadata?.role === 'admin'
if (!isAdmin) throw createError({ statusCode: 403, statusMessage: 'Accès réservé aux administrateurs.' })
```

### Service Role Supabase Client

**Source:** `server/api/v1/admin/queue.get.ts` line 10
**Apply to:** All new server endpoints
```typescript
const supabase = await serverSupabaseServiceRole(event) as any
```
The `as any` cast is established project convention (present in all existing service role usages).

### Zod Validation

**Source:** `server/api/v1/admin/approve-pro.post.ts` lines 4-7 + 16-18
**Apply to:** `qualify.post.ts`, `stripe/checkout.post.ts` (POST endpoints with body)
```typescript
const schema = z.object({ ... })

const body = await readBody(event)
const parsed = schema.safeParse(body)
if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Données invalides.' })
```
Exception: `stripe/webhook.post.ts` uses `readRawBody(event)` not `readBody(event)` — do NOT apply Zod here.

### Error Wrapping (try/catch)

**Source:** `server/api/v1/pro/claim.post.ts` lines 252-258
**Apply to:** `stripe/checkout.post.ts`, `stripe/webhook.post.ts` (complex multi-step handlers)
```typescript
} catch (error: any) {
  if (error.statusCode) throw error
  throw createError({
    statusCode: 500,
    statusMessage: error.message || 'Internal Server Error'
  })
}
```
Simpler single-step handlers (`qualify.post.ts`, `leads/index.get.ts`, `leads/[id].get.ts`) can use inline `throw createError()` without try/catch wrapper, following the queue.get.ts style.

### Auth Guard (Vue pages)

**Source:** `app/pages/app/dashboard.vue` lines 7-10
**Apply to:** All three new Vue pages (`leads/index.vue`, `leads/[id].vue`, `premium.vue`)
```typescript
watchEffect(() => {
  if (user.value === null) navigateTo('/pro/claim')
})
```
This is the established pattern per CONTEXT.md §Established Patterns. Do NOT use global middleware.

### useAsyncData Key Convention

**Source:** `app/pages/app/dashboard.vue` lines 13, 24
**Apply to:** All new Vue pages
```typescript
// Pattern: descriptive kebab-case string, unique per page
const { data: pro, refresh } = await useAsyncData('pro-dashboard', ...)
const { data: verifs } = await useAsyncData('pro-verifs', ...)
```
Keys for new pages: `'pro-leads'`, `'lead-detail-${id}'`, `'pro-premium'`.

### Tailwind Layout Convention

**Source:** `app/pages/app/dashboard.vue` line 82
**Apply to:** All new Vue pages
```vue
<div class="max-w-2xl mx-auto px-6 py-16">
```

### Badge/Status Indicator

**Source:** `app/pages/app/dashboard.vue` lines 98-105
**Apply to:** `leads/index.vue` (per-card badge), `premium.vue` (subscription status badge)
```vue
<span
  class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border rounded-full"
  :class="condition ? 'border-foreground/30 text-foreground' : 'border-amber-300 text-amber-700 bg-amber-50'"
>
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `server/api/v1/stripe/webhook.post.ts` | controller | event-driven | No event-driven handlers exist in the codebase. Cloudflare-specific `constructEventAsync` + `SubtleCryptoProvider` pattern has no local precedent. Use RESEARCH.md Pattern 3 verbatim. |

---

## Schema Facts (from migration analysis)

Confirmed by reading `supabase/migrations/20260603000000_schema_initial.sql` lines 1-199:

| Fact | Implication |
|------|-------------|
| `professionals` has `stripe_customer_id TEXT` and `subscription_status subscription_status` (line 47-48) | D-15 fields already exist — no ALTER TABLE needed |
| `leads` has `unlocked_at TIMESTAMPTZ` (line 107) | pg_cron can UPDATE this column directly |
| `lead_status ENUM` is `('new', 'contacted', 'won', 'lost')` (line 16) | Missing `'claimed'` — migration must `ALTER TYPE lead_status ADD VALUE` |
| `projects` has `budget_range` but no `timeline_range` (lines 85-99) | Gap 1 from RESEARCH.md — migration must `ALTER TABLE projects ADD COLUMN timeline_range TEXT` |
| `UNIQUE (project_id, pro_id)` constraint on `leads` (line 109) | UPSERT with `onConflict: 'project_id,pro_id'` is safe and idempotent |
| RLS on `leads`: `auth.uid() = pro_id` (line 191) | Service role bypass required in Nitro to fetch full data for masking |
| `professionals` has no `category` column visible in lines 33-50 | Check: `category` was added in Phase 3 — confirmed by claim.post.ts line 15 using it. The migration that added it must be in a later migration file. The column exists in production. |

---

## Metadata

**Analog search scope:** `server/api/v1/`, `app/pages/app/`, `supabase/migrations/`, `nuxt.config.ts`
**Files scanned:** 11 source files read
**Pattern extraction date:** 2026-06-05
