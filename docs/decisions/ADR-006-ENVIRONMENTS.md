# ADR-006 : Stratégie d'Environnements (CI/CD)

- **Date** : 2026-05-07
- **Statut** : Accepted
- **Auteurs** : @mike

## Contexte
BÂTI-AXE gère des communications critiques (SMS, Email) et des flux financiers (Stripe). Toute erreur en production peut détruire la confiance des professionnels importés.

## Décision
Mise en place de trois environnements isolés :

### 1. Local Development
- **Outil** : Supabase CLI + Docker.
- **Usage** : Développement des schémas SQL et composants UI.
- **Secrets** : `.env.local`.

### 2. Staging (Preview)
- **Déclencheur** : Tout push sur la branche `development` ou toute Pull Request.
- **Hosting** : Cloudflare Pages Preview.
- **Database** : Instance Supabase dédiée (Staging).
- **Services** : Stripe Test Mode, Twilio Sandbox.

### 3. Production
- **Déclencheur** : Merge sur la branche `main`.
- **Hosting** : Cloudflare Pages Production.
- **Database** : Instance Supabase Production (Isolée).
- **Services** : Stripe Live, Twilio Production.

## Conséquences
- **Positives** : Zéro risque de polluer la base de production ou d'envoyer des SMS de test aux vrais artisans.
- **Négatives** : Nécessité de synchroniser les migrations SQL entre les deux instances Supabase.

## Alternatives
- **Branching Supabase (Beta)** : Optionnelle, mais une séparation d'instances physiques est plus sûre pour la Phase 1.
