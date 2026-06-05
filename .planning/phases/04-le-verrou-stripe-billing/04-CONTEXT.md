# Phase 4: Le Verrou & Stripe Billing - Context

**Gathered:** 2026-06-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Cette phase livre la monétisation opérationnelle de BÂTI-AXE :
1. **Dashboard leads** — page `/espace/leads` où le pro voit ses leads avec coordonnées masquées ou visibles selon son statut
2. **Logique de déblocage serveur** — API Nitro qui retourne les coordonnées floutées ou claires selon les règles Premium/Basic
3. **Matching leads → pros** — l'admin qualifie un projet, l'API crée automatiquement les leads pour tous les pros vérifiés de la même catégorie
4. **Stripe Checkout** — abonnement mensuel Premium, page `/espace/premium`, webhook qui met à jour `subscription_status`
5. **pg_cron** — basculement automatique des leads vers les pros BASIC après 72h si non pris par un Premium

</domain>

<decisions>
## Implementation Decisions

### Matching leads → pros

- **D-01:** Le filtre de matching est la **catégorie uniquement** (pas la zone géographique). Les pros du bâtiment se déplacent — la zone n'est pas un critère fiable pour la Phase 4.
- **D-02:** Un pro a **une seule catégorie** en Phase 4. Le support multi-catégories est déferré (Phase suivante).
- **D-03:** Les leads sont créés **via l'API admin** au moment où l'admin qualifie le projet (`projects.status = 'qualified'`). L'endpoint admin `/api/v1/admin/qualify` (à créer) : (1) passe `projects.status` à `qualified`, (2) crée un `lead` pour chaque pro vérifié (`is_verified = true`) dont la `category` correspond.
- **D-04:** Pas de trigger DB ni de cron pour la création des leads — logique applicative dans l'API Nitro.

### Logique de déblocage (Le Verrou)

- **D-05:** Un lead flouté affiche au pro BASIC : **catégorie + budget + délai** uniquement. Commune, nom, téléphone, email et adresse sont masqués (`*** *** ***`). La commune est masquée délibérément pour éviter toute identification géographique.
- **D-06:** Pro **Premium** (`subscription_status = 'active'`) → voit les coordonnées complètes immédiatement sur tous les leads.
- **D-07:** Pro **BASIC** (pas de subscription active) → voit les coordonnées d'un lead uniquement si `leads.unlocked_at IS NOT NULL AND leads.unlocked_at <= NOW()`.
- **D-08:** `leads.unlocked_at` est défini à `created_at + 72h` par défaut via pg_cron. Cependant, si un pro Premium **accepte/prend le lead** (statut `claimed`), le délai de 72h ne s'applique pas aux BASIC : le lead reste visible mais affiché comme **'Pris'** (ils voient la card mais pas les coordonnées).
- **D-09:** Le floutage est **exclusivement côté serveur** (API Nitro). Jamais côté client (ADR-004 — contrainte dure).
- **D-10:** Quand un lead est `claimed` par un Premium, les pros BASIC voient la card avec badge **"Déjà attribué"** (pas les coordonnées). Transparence sur le volume sans révéler les infos.

### Stripe — Abonnement Premium

- **D-11:** Modèle : **abonnement mensuel Stripe**. Pas de crédit par lead pour la Phase 4.
- **D-12:** Prix placeholder : **39€/mois** (ajustable dans Stripe Dashboard sans déploiement). Pas d'engagement, sans essai gratuit pour la Phase 4.
- **D-13:** Le Checkout Stripe est accessible depuis la **page dédiée `/espace/premium`** (pas un modal inline). La page présente la valeur Premium avant le CTA Checkout.
- **D-14:** Le webhook Stripe met à jour `professionals.subscription_status` : `checkout.session.completed` → `'active'`, `customer.subscription.deleted` → `'canceled'`, `invoice.payment_failed` → `'unpaid'`.
- **D-15:** `professionals.stripe_customer_id` est stocké lors du premier checkout pour permettre la gestion future (portail client, annulation).

### Dashboard leads — `/espace/leads`

- **D-16:** La liste des leads est une **page séparée `/espace/leads`** (pas un onglet dans `/app/dashboard`). Le dashboard existant reste dédié au profil et aux documents.
- **D-17:** Layout : **cards** (pas de tableau). Chaque card affiche : catégorie (icône), budget, délai, statut badge (flouté / débloqué / pris), et CTA contextuel.
- **D-18:** CTA contextuel par statut :
  - Lead flouté (BASIC, <72h, non pris) → bouton **"Passer Premium"** (lien vers `/espace/premium`) + compte à rebours "Disponible dans Xh"
  - Lead débloqué (72h passées ou Premium) → bouton **"Voir le contact"** (lien vers `/espace/leads/[id]`)
  - Lead pris → badge "Déjà attribué" (pas de CTA)
- **D-19:** La page détail `/espace/leads/[id]` affiche toutes les infos du projet + coordonnées complètes (si débloqué) + description du besoin.

### Claude's Discretion

- Structure précise de la page `/espace/premium` (copywriting, layout de la proposition de valeur)
- Pagination ou infinite scroll sur `/espace/leads` (à décider selon le volume estimé)
- Gestion du portail Stripe (annulation, mise à jour CB) — via `customer.createPortalSession` si nécessaire
- Ordre de tri des leads sur le dashboard (plus récent en premier par défaut)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & Contraintes
- `docs/decisions/ADR-004-BLUR-LOCK-MECHANISM.md` — Floutage obligatoire côté serveur Nitro (contrainte dure, jamais côté client). ⚠️ L'ADR mentionne 24h — révisé à **72h** par D-07/D-08 lors de la discussion Phase 4.
- `.planning/REQUIREMENTS.md` §Le Verrou — LCK-01, LCK-02, LCK-03 (spécifications originales, partiellement révisées par D-07/D-08)
- `.planning/PROJECT.md` — Contraintes stack (Nuxt 3, Supabase, Cloudflare Pages)

### Base de données
- `supabase/migrations/20260603000000_schema_initial.sql` — Schéma `leads`, `projects`, `professionals` (subscription_status, stripe_customer_id, unlocked_at)

### Code existant (patterns à suivre)
- `app/pages/app/dashboard.vue` — Pattern watchEffect auth redirect, useAsyncData Supabase
- `server/api/v1/admin/queue.get.ts` — Pattern API admin avec service role bypass RLS
- `server/api/v1/pro/claim.post.ts` — Pattern validation Zod + insert Supabase côté serveur

### Stripe
- API Stripe Checkout Sessions (create) + Webhooks — à documenter dans RESEARCH.md

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/pages/app/dashboard.vue` : pattern auth guard (`watchEffect + navigateTo('/pro/claim')`), `useAsyncData` pour fetch pro profile — à répliquer sur `/espace/leads`
- `server/api/v1/admin/queue.get.ts` : utilise le service role pour bypass RLS — même pattern pour l'API leads (les coordonnées ne doivent pas être exposées via RLS client)
- Composants UI shadcn/ui déjà installés (Button, Badge, Card) — réutilisables pour les cards leads

### Established Patterns
- Auth guard : `watchEffect(() => { if (!user.value) navigateTo('/pro/claim') })` — ne pas utiliser le middleware global
- API prefix `/api/v1/` avec validation Zod obligatoire
- Service role Supabase pour les opérations sensibles (bypass RLS côté serveur)
- Floutage toujours côté serveur — l'API ne retourne jamais les coordonnées claires à un client non autorisé

### Integration Points
- `/espace/leads` s'ajoute à la navigation de l'espace pro (lien depuis `/app/dashboard`)
- `/espace/premium` s'ajoute comme destination des CTA "Passer Premium" dans les cards leads
- Webhook Stripe → nouvelle route `server/api/v1/stripe/webhook.post.ts`
- Admin panel → nouveau bouton "Qualifier" sur les projets (à ajouter dans la console admin existante)

</code_context>

<specifics>
## Specific Ideas

- Le masquage de la **commune** (en plus des coordonnées) est une décision délibérée de privacy : éviter qu'un pro recherche le projet via Google Maps / photos de rue à partir de la zone géographique.
- Le modèle de déblocage BASIC révisé : **72h d'exclusivité Premium**, puis disponible BASIC — mais si un Premium a pris le lead (`leads.status = 'claimed'`), les BASIC voient la card marquée "Déjà attribué" (pas les coordonnées). Cette logique renforce l'incentive à s'abonner sans bloquer totalement la visibilité BASIC.
- Prix **39€/mois** est un placeholder modifiable depuis Stripe Dashboard — pas hardcodé dans le code (utiliser `STRIPE_PRICE_ID` en env var).

</specifics>

<deferred>
## Deferred Ideas

- **Multi-catégories par pro** — un pro pourra couvrir plusieurs catégories. Déferré Phase 5+.
- **Filtre zone / rayon km** — matching géographique configurable par le pro. Pertinent pour le scale multi-villes. Déferré Phase 5.
- **Score de pertinence des leads** (budget, urgence, distance) — affiché dans le tri du dashboard. Déferré.
- **Portail Stripe** (annulation, mise à jour CB en self-service) — à implémenter si le volume pro le justifie.
- **Crédit par lead** (modèle alternatif à l'abonnement) — évalué mais écarté pour Phase 4. À reconsidérer si le taux de conversion abonnement est faible.
- **Lemon Squeezy / Paddle** (MoR pour TVA EU automatique) — évalués mais Stripe retenu pour Phase 4. À reconsidérer si la gestion TVA devient un problème.

</deferred>

---

*Phase: 4-le-verrou-stripe-billing*
*Context gathered: 2026-06-05*
