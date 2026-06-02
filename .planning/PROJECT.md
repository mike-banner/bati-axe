# BÂTI-AXE

## What This Is
BÂTI-AXE est une marketplace sélective de mise en relation B2B/B2C dans le bâtiment. Elle agit comme un tiers de confiance qui sécurise la chaîne de valeur en vérifiant les garanties décennales des professionnels. Déploiement prototype-first sur Carrières-sous-Poissy (78).

## Core Value
Garantir la sécurité et la confiance des chantiers de particuliers en les mettant en relation exclusive avec des professionnels du bâtiment certifiés (assurance décennale et labels vérifiés).

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] **INFRA-01 à 04**: Setup Nuxt 3, Supabase CLI, Cloudflare Pages, middleware sécurité
- [ ] **LEGAL-01 à 02**: Mentions légales, CGU, registre RGPD
- [ ] **CPTR-01 à 05**: Simulateur de capture 6 étapes (Zéro Friction)
- [ ] **LCK-01 à 03**: Le Verrou (floutage serveur + déblocage Premium/24h)
- [ ] **CLM-01 à 04**: Claim, Auth, Upload R2, Validation admin
- [ ] **SMS-01 à 03**: Teasing SMS opt-in (instantané Premium, différé Basic)
- [ ] **ADM-01 à 03**: Console admin (validation docs, modération, analytics)

### Out of Scope
- **Real-time chat** — Le contact se fait par téléphone/SMS direct.
- **Multi-villes initial** — Restreint à Carrières-sous-Poissy pour valider le modèle.
- **OAuth / SSO** — Email/password suffisant pour la Phase 1.

## Context
- Phase prototype axée sur Carrières-sous-Poissy (78) pour valider la conversion avant scale.
- Stack Serverless à faible coût mensuel (<50€) sur Cloudflare.
- ~7 000 prospects bruts en table interne, jamais publics sans opt-in (ADR-007).

## Constraints
- **Tech Stack**: Nuxt 3 (Vue 3) unique hébergé 100% sur Cloudflare Pages (ADR-008).
- **Database**: PostgreSQL (Supabase) avec migrations CLI et RLS strict.
- **Storage**: Cloudflare R2 pour documents et décennales (ADR-003).
- **URL Routing**: Hybride slug + nanoid(8) pour les profils pro (ADR-009).
- **Privacy & Security**: Floutage côté serveur Nitro obligatoire (ADR-004). Consentement explicite conforme LCEN (ADR-007).
- **Environments**: Dev (local Docker) / Staging (CF Pages Preview) / Prod (CF Pages main) (ADR-006).
- **API**: Préfixe `/api/v1/`, validation Zod, format de réponse standardisé (API_RULES.md).

## Key Decisions
| Decision | Rationale | Outcome |
|---|---|---|
| Pivot vers Nuxt 3 (ADR-008) | Consolide la vitrine et l'application au sein d'une stack unique performante | — Pending |
| Floutage Nitro (ADR-004) | Sécurise les coordonnées clients côté serveur avant déblocage | — Pending |
| R2 Storage (ADR-003) | Bypass le backend Supabase pour réduire les coûts d'egress | — Pending |
| Séparation Env (ADR-006) | Isole le développement local des environnements staging/prod | — Pending |
| RGPD/LCEN double opt-in (ADR-007) | Conformité légale et protection de la délivrabilité SMS | — Pending |
| URL hybride slug+ID (ADR-009) | SEO préservé, zéro collision, résistant aux changements de nom | — Pending |

---
*Last updated: 2026-06-02 after roadmap restructuration (5 phases) + ADR-009*
