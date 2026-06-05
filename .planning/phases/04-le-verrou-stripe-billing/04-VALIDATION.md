---
phase: 4
slug: le-verrou-stripe-billing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-05
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via `npm run test`) |
| **Config file** | `vitest.config.ts` (à créer en Wave 0) |
| **Quick run command** | `npm run typecheck` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-DB-01 | DB | 1 | LCK-01 | T-4-01 | Migrations appliquées sans erreur | integration | `supabase db push && npm run typecheck` | ❌ W0 | ⬜ pending |
| 04-API-01 | API | 2 | LCK-01 | T-4-02 | Coordonnées masquées pour BASIC <72h | unit | `npm test -- leads.test` | ❌ W0 | ⬜ pending |
| 04-API-02 | API | 2 | LCK-02 | T-4-03 | Coordonnées complètes pour Premium | unit | `npm test -- leads.test` | ❌ W0 | ⬜ pending |
| 04-STRIPE-01 | Stripe | 2 | LCK-02 | T-4-04 | Webhook vérifié avec `constructEventAsync` | unit | `npm test -- webhook.test` | ❌ W0 | ⬜ pending |
| 04-CRON-01 | Cron | 2 | LCK-03 | T-4-05 | pg_cron bascule unlocked_at à T+72h | integration | Manuel (voir ci-dessous) | N/A | ⬜ pending |
| 04-UI-01 | UI | 3 | LCK-01 | — | N/A | typecheck | `npm run typecheck` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/unit/leads.test.ts` — stubs pour LCK-01 (masquage) et LCK-02 (premium access)
- [ ] `tests/unit/webhook.test.ts` — stub pour la vérification de signature Stripe
- [ ] `vitest.config.ts` — configuration de base
- [ ] `npm install -D vitest @vitest/ui` — si pas encore installé

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| pg_cron bascule unlocked_at après 72h | LCK-03 | pg_cron ne se teste pas en unit | 1. Créer un lead. 2. Insérer un job pg_cron avec délai 10s. 3. Vérifier `leads.unlocked_at IS NOT NULL`. |
| Stripe Checkout redirige vers page de succès | LCK-02 | Flux Stripe nécessite un vrai navigateur | 1. Cliquer "Passer Premium". 2. Compléter le checkout Stripe test. 3. Vérifier `subscription_status = 'active'`. |
| Webhook Stripe en mode Cloudflare (constructEventAsync) | LCK-02 | Nécessite `wrangler pages dev` ou déploiement preview | Utiliser `stripe listen --forward-to` + vérifier logs Nitro. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
