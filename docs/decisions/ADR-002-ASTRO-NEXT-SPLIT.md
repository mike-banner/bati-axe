# ADR-002 : Architecture Dual-Frontend (Astro + Next.js)

- **Date** : 2026-05-07
- **Statut** : **SUPERSEDED par ADR-008** (2026-06-02)
- **Auteurs** : @mike, @antigravity

> Cet ADR est conservé pour traçabilité. La décision active est ADR-008 (Nuxt-only mono-app).

## Contexte (historique)
BÂTI-AXE avait deux objectifs contradictoires :
1. Acquisition : pages SEO statiques ultra-rapides.
2. Rétention/Monétisation : dashboard Pro dynamique, sécurisé.

## Décision (historique)
Séparer physiquement les deux préoccupations :
- `batiaxe.fr` → Astro (SSG).
- `app.batiaxe.fr` → Next.js (SSR/CSR Auth).

## Pourquoi superseded
La stratégie produit a pivoté vers un **prototype mono-ville** porté en solo. La complexité d'un monorepo dual-framework (deux langages UI, deux deploys, duplication design system) est disproportionnée. ADR-008 acte le passage à Nuxt 3 unique sur un seul domaine avec routes prerender pour la vitrine et routes SSR auth pour l'app.
