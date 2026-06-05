---
phase: 4
reviewers: [claude]
reviewed_at: 2026-06-05T20:46:01.661Z
plans_reviewed: [04-01-PLAN.md, 04-02-PLAN.md, 04-03-PLAN.md, 04-04-PLAN.md, 04-05-PLAN.md, 04-06-PLAN.md, 04-07-PLAN.md]
---

# Cross-AI Plan Review — Phase 4

## the agent Review

## Phase 4 Plan Review — Le Verrou & Stripe Billing

---

### Summary

The 7-plan wave structure is well-conceived and technically sound. The dependency ordering is correct, the Cloudflare-specific Stripe constraints are properly documented, and the server-side masking architecture faithfully follows ADR-004. The research integration is strong. However, three meaningful gaps could cause production bugs or visual regression: a design system contradiction in the UI plans, a logic gap in how `claimed` status propagates to BASIC lead rows, and a missing `npm install stripe` step.

---

### Strengths

- Wave ordering is logically correct: migrations → schema push + tests → API core → parallel (claim + Stripe) → UI
- The `constructEventAsync` + `SubtleCryptoProvider` requirement is correctly identified and prominently warned against in every relevant plan — this is the most common Cloudflare/Stripe failure mode
- Splitting migrations into two files (`000000_schema_gaps` + `000001_unlock_cron`) is smart — schema gaps must succeed even if pg_cron fails locally
- `maskLead` extracted as a pure helper with TDD approach (RED stubs → GREEN) is the right call — testable without DB mocks
- UPSERT with `onConflict: 'project_id,pro_id'` for idempotent lead creation is correct
- Security threat register is thorough and well-mapped to the codebase

---

### Concerns

**HIGH — `claimed` status propagation gap (Plans 04-04 and 04-03)**

The claim endpoint sets `leads.status = 'claimed'` on the claiming pro's own lead row. The `maskLead` helper then checks `lead.status === 'claimed'` per row. But BASIC pros each have their own lead row for the same project. When Premium Pro A claims their row, BASIC Pro B's row is still `status: 'new'`. After 72h, BASIC Pro B will see `'unlocked'` and the full contact details — contradicting D-08/D-10 ("Déjà attribué" for BASIC when a Premium has claimed).

Fix options:
1. The claim endpoint updates ALL leads for the same `project_id` to `'claimed'` (not just the claimant's row), OR
2. The `leads/index.get.ts` query joins to check if any sibling lead for the same `project_id` has `status = 'claimed'`, then overrides the current pro's status accordingly.

Option 2 is cleaner and doesn't mutate other pros' rows.

**HIGH — Plans 04-06 and 04-07 contradict UI-SPEC v2**

The UI-SPEC v2 explicitly forbids `text-emerald-*`, `text-sky-*`, `text-slate-*` and mandates SVG inline icons only (no icon libraries). Plans 06 and 07 use:
- `emerald-50` backgrounds, `emerald-200` borders, `sky-700` for phone numbers
- `lucide-vue-next` imports (`LockKeyholeIcon`, `UnlockIcon`, `StarIcon`, `ClockIcon`, etc.)

The existing `dashboard.vue` uses zero lucide imports. The `must_haves.artifacts` for Plan 06 even assert `contains: "ClockIcon"` — a hard requirement that violates the design contract.

Fix: Replace all lucide imports with the inline SVG paths already defined in UI-SPEC v2 §Icônes. Replace emerald/sky/slate with the monochrome tokens (`bg-muted`, `border-foreground/30`, amber for Premium states).

**MEDIUM — `npm install stripe` has no home in the wave plan**

The RESEARCH.md calls this out as required, but no plan contains `npm install stripe`. Plan 05 assumes the SDK is available. If execution runs sequentially with no manual step, the wave will fail.

Fix: Add `npm install stripe` as Task 0 or a prerequisite note in Plan 01 (which sets up everything else Stripe needs).

**MEDIUM — simulateur.vue step renumbering in Plan 03 is high-risk**

Adding a step to an existing 6-step flow (renaming step 4→5, 5→6, 6→7, success step 7→8, all `v-if="step === N"` conditions, `isStepValid` cases, `stepLabels`) is the most complex template change in the entire phase. A missed renumber breaks the existing capture funnel — the most validated feature in the product. This is scope-adjacent to Phase 4 and carries regression risk disproportionate to its value (timeline_range could default to `null` with no UI change and be added later).

Fix: Either move simulateur.vue changes to a standalone plan (04-03b) with explicit regression testing, or accept `timeline_range = null` for Phase 4 and defer the simulateur step.

**MEDIUM — `supabase db push` requires `supabase link` first**

Plan 02's Task 2 assumes the CLI is linked to the remote project. Users who haven't run `supabase link --project-ref <id>` will get an unhelpful error. The plan mentions `SUPABASE_ACCESS_TOKEN` but not the link step.

Fix: Add to the "what-built" section: "If not already done, run `supabase link --project-ref YOUR_PROJECT_REF` before `supabase db push`."

**LOW — Webhook test stubs are underspecified**

Plan 02 calls for `tests/unit/stripe-webhook.test.ts` that verifies `subscription_status` updates via `vi.mock`. But mocking `stripe.webhooks.constructEventAsync` to return a controlled event object is non-trivial — the plan doesn't specify the mock structure. If the stubs are written poorly, they won't turn GREEN in Plan 05 despite correct implementation.

Fix: Specify in Plan 02's action that the test should **bypass** `constructEventAsync` entirely (mock the whole handler module or extract the switch-case logic into a testable helper like `handleStripeEvent(stripeEvent, supabase)`).

---

### Suggestions

- **Plan 04-04**: After setting `status = 'claimed'` on the claimant's row, add `UPDATE leads SET status = 'claimed' WHERE project_id = $1 AND pro_id != $2` to propagate the state to all BASIC rows for the same project.
- **Plans 04-06/07**: Use the SVG paths from UI-SPEC v2 §Icônes verbatim. Replace `lucide-vue-next` imports entirely.
- **Plan 04-01**: Add `npm install stripe` as a task step. The package.json change is a natural fit alongside the nuxt.config.ts change.
- **Plan 04-03 Task 3**: Consider a guard — wrap the simulateur step change with a comment block and add `// REGRESSION CHECK: verify all 6 original steps still complete end-to-end` to the done criteria.
- **Plan 04-02 Task 3**: Rename `constructEventAsync` test to `handleStripeEvent` stub pattern — test the DB update logic directly without needing real Stripe signature infrastructure.
- **Plan 04-07**: Remove the emoji `🔒` from the premium.vue template; use the inline lock SVG from UI-SPEC v2.

---

### Risk Assessment: **MEDIUM**

The architecture is sound and the implementation details are mostly correct. The `claimed` propagation gap is the only issue that would cause a silent correctness bug at runtime (D-10 would never activate for BASIC users). The UI color/icon violations would cause visible design regression and require a follow-up fix. Neither is a security issue, but both are regressions against specified behavior. Fix the three HIGH concerns before execution; the MEDIUM items can be addressed during the wave.


---

## Consensus Summary

Ce projet dispose uniquement de Claude Code CLI pour la revue de code dans son environnement.

### Agreed Strengths
- Architecture modulaire et découpage logique des tâches par waves.
- Floutage robuste côté serveur via les endpoints Nitro pour assurer la sécurité des données.
- Utilisation de pg_cron pour la libération automatique des prospects.

### Agreed Concerns
- Nécessité de s'assurer de la bonne configuration locale et en production de Stripe (webhooks, signatures).
- Gestion des erreurs et des scénarios d'échec de paiement dans le webhook Stripe.

### Divergent Views
- Néant (Revue effectuée par un seul outil IA).
