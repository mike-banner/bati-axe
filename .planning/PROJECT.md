# BÂTI-AXE

## What This Is
BÂTI-AXE est une marketplace sélective de mise en relation B2B/B2C dans le bâtiment. Elle agit comme un tiers de confiance qui sécurise la chaîne de valeur en vérifiant les garanties décennales des professionnels.

## Core Value
Garantir la sécurité et la confiance des chantiers de particuliers en les mettant en relation exclusive avec des professionnels du bâtiment certifiés (assurance décennale et labels vérifiés).

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] **CPTR-01**: Sélection dynamique par nature de projet (icônes)
- [ ] **CPTR-02**: Localisation avec code postal (Focus 78)
- [ ] **CPTR-03**: Saisie du budget estimé et délai souhaité
- [ ] **CPTR-04**: Saisie des coordonnées de contact (nom, email, téléphone)
- [ ] **CPTR-05**: Enregistrement sécurisé du projet anonyme sans compte requis
- [ ] **LCK-01**: Floutage serveur (Nitro API) des coordonnées des prospects
- [ ] **LCK-02**: Accès immédiat non flouté pour les pros PREMIUM via abonnement Stripe
- [ ] **LCK-03**: Déblocage automatique gratuit après un délai d'attente de 24 heures pour les pros BASIC
- [ ] **CLM-01**: Revendication de profil pour les prospects importés
- [ ] **CLM-02**: Authentification de compte pro sécurisée
- [ ] **CLM-03**: Chargement et stockage isolé de la pièce d'identité, du KBIS et de l'assurance décennale sur R2
- [ ] **CLM-04**: Statut de vérification mis à jour après validation manuelle par l'administrateur
- [ ] **SMS-01**: Teasing par SMS instantané aux pros PREMIUM après un dépôt de projet
- [ ] **SMS-02**: Teasing par SMS avec délai de 30 minutes aux pros BASIC
- [ ] **SMS-03**: Consentement SMS explicite obligatoire (RGPD / LCEN)
- [ ] **ADM-01**: Interface de validation des documents administratifs (Kbis, décennale) stockés sur R2
- [ ] **ADM-02**: Modération et nettoyage des leads suspects avant envoi aux artisans
- [ ] **ADM-03**: Console d'analytics (taux d'ouverture SMS vs taux de clic)

## Out of Scope
- **Real-time chat** — Trop de complexité pour la v1, le contact se fait par téléphone/SMS direct.
- **Multi-villes initial** — Déploiement restreint à Carrières-sous-Poissy pour la Phase 1 pour valider le modèle localement.

## Context
- Phase prototype axée sur Carrières-sous-Poissy (78) pour valider la conversion avant de passer à l'échelle.
- Stack Serverless à faible coût mensuel (<50€) sur Cloudflare.

## Constraints
- **Tech Stack**: Nuxt 3 (Vue 3) unique hébergé 100% sur Cloudflare Pages.
- **Database**: PostgreSQL (Supabase) hébergé avec migrations CLI et RLS strict.
- **Storage**: Cloudflare R2 pour documents et décennales.
- **Privacy & Security**: Logique de floutage côté serveur Nitro obligatoire. Consentement explicite conforme LCEN pour teasing SMS.
- **Environments**: Séparation stricte Dev (local), Staging (Cloudflare Pages Preview) et Prod.

## Key Decisions
| Decision | Rationale | Outcome |
|---|---|---|
| Pivot vers Nuxt 3 (ADR-008) | Consolide la vitrine et l'application au sein d'une stack unique performante | — Pending |
| Floutage Nitro (ADR-004) | Sécurise les coordonnées clients côté serveur avant déblocage | — Pending |
| R2 Storage (ADR-003) | Bypass le backend Supabase pour réduire les coûts d'egress | — Pending |
| Séparation Env (ADR-006) | Isole le développement local des environnements staging/prod | — Pending |
| RGPD/LCEN double opt-in (ADR-007) | Assure la conformité légale et protège la délivrabilité SMS | — Pending |

---
*Last updated: 2026-06-02 after Ingest Docs*
