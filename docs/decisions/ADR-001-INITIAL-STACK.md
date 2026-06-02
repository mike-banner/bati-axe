# ADR-001 : Stack Technique BÂTI-AXE (Révision Nuxt-only)

- **Date** : 2026-06-02
- **Statut** : Accepted (révise la version 2026-05-07)
- **Auteurs** : @mike

## Contexte
Le projet BÂTI-AXE est porté en solo en phase prototype. La stratégie produit cible un **prototype mono-ville** (Carrières-sous-Poissy / 78) avant scale national. La complexité d'une stack dual-frontend (Astro + Next.js, monorepo Turborepo, deux runtimes UI) est disproportionnée pour ce besoin et augmente le risque d'abandon.

## Décision
Stack minimaliste et homogène :
- **Nuxt 3 (Vue 3)** : une seule application servant à la fois la vitrine publique (SSG / prerender via Nitro `routeRules`) et l'application pro authentifiée. Hébergée sur **Cloudflare Pages** (preset Nitro `cloudflare-pages`).
- **Supabase (PostgreSQL)** : Database + Auth, source de vérité unique.
- **Cloudflare R2** : stockage PDF (Décennales / Kbis), via Presigned URLs (voir ADR-003).
- **Twilio** : SMS Teasing, déclenché uniquement après opt-in vérifié (voir ADR-007).
- **Resend** : emails transactionnels et double opt-in.
- **Stripe Billing** : abonnements PRO récurrents.
- **Sentry + Axiom** : observabilité dès le jour 1.

## Conséquences
- **Positives** : un seul langage UI (Vue), un seul deploy, un seul repo simple (pnpm workspaces sans Turborepo). Vélocité maximale en solo. Onboarding futur d'un dev unique.
- **Négatives** : on perd la promesse "0 JS" d'Astro sur la vitrine. Mitigation : `routeRules` Nuxt `{ prerender: true }` sur les pages SEO + `payloadExtraction: false` + lazy-load des composants lourds. Cible Lighthouse > 90 acceptable en Phase 1, > 95 en optimisation Phase 6.

## Alternatives
- **Astro + Next.js (ADR-001 v1)** : rejeté pour cause de complexité disproportionnée au stade prototype.
- **Astro + Vue (Astro vitrine, Nuxt app)** : rejeté pour garder un seul framework et un seul deploy.
- **Tout en Next.js** : rejeté car le dev débute sur l'écosystème Vue et ne veut pas apprendre React en parallèle.
