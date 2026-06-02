# ADR-008 : Architecture Frontend Unique — Nuxt 3 Mono-App

- **Date** : 2026-06-02
- **Statut** : Accepted (supersedes ADR-002)
- **Auteurs** : @mike

## Contexte
ADR-002 actait une séparation Astro (vitrine) + Next.js (app pro). La stratégie produit a pivoté vers un prototype mono-ville développé en solo, et le développeur démarre sur l'écosystème Vue. Maintenir deux frameworks UI distincts est disproportionné.

## Décision
Une seule application **Nuxt 3** servant :
- **Routes publiques prerender** (`/`, `/simulateur`, `/[metier]/[ville]`, pages SEO) via Nitro `routeRules: { prerender: true }`.
- **Routes app pro SSR auth** (`/app/**`) protégées par middleware Supabase SSR.
- **Routes API** (`/api/**`) gérées par Nitro pour les Server Actions critiques (floutage, signed URLs R2, webhooks Stripe/Twilio).

Hébergement unique : **Cloudflare Pages** (preset Nitro `cloudflare-pages`).

## Justification
- Solo dev → un seul framework, un seul langage UI, un seul deploy.
- Nuxt 3 + Nitro couvre les deux besoins (SSG SEO + SSR auth) sans compromis majeur.
- Suppression du monorepo dual-framework → vélocité accrue.
- `routeRules` Nuxt permet un mix prerender/SSR/swr fin par préfixe de route.

## Conséquences
- **Positives** : un seul code, un seul build, un seul CI, un seul observability stack. Onboarding ultérieur simple.
- **Négatives** :
    - SEO légèrement moins extrême qu'Astro pur (acceptable Phase 1).
    - Risque de couplage entre couche publique et app pro → discipline : séparer en `app/pages/(public)/*` et `app/pages/(pro)/*` avec layouts distincts, pas d'imports croisés.

## Implémentation
- Structure : `app/pages/(public)/...`, `app/pages/(pro)/...`, `server/api/...`, `server/middleware/...`.
- `routeRules` :
    ```ts
    {
      '/': { prerender: true },
      '/simulateur/**': { prerender: false, ssr: true },
      '/[metier]/[ville]/**': { prerender: true },
      '/app/**': { ssr: true, headers: { 'cache-control': 'no-store' } },
      '/api/**': { cors: false }
    }
    ```
- Auth Supabase via `@nuxtjs/supabase` module + middleware `auth` sur `/app/**`.

## Alternatives
- **Astro + Vue (vitrine) + Nuxt (app)** : rejeté, deux apps à maintenir.
- **Vue + Vite seul (SPA)** : rejeté, perte SEO inacceptable.
- **Maintenir ADR-002** : rejeté, voir contexte.
