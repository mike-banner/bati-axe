# 🏗️ ARCHITECTURE RULES — BÂTI-AXE

## Rule 008 — Architecture Nuxt 3 unique (Prerender vs App)
- **Vitrine (batiaxe.fr)** : Servie par Nuxt 3 avec `routeRules` en `prerender: true` (SSG) pour maximiser le SEO et la vitesse. Communication vers Supabase via Nitro API endpoints sécurisés.
- **App (batiaxe.fr/app)** : Partie privée SSR sous auth Supabase. Pas de sous-domaine `app.batiaxe.fr` pour simplifier le routage et le cookie sharing.

## Rule 009 — Le Verrou (Floutage)
- Toute donnée de contact client (`phone`, `email`, `full_name`) doit être masquée par défaut côté serveur (Nitro API) dans les résultats de recherche/listes.
- Le démasquage est conditionné par :
    1. Le statut de l'abonnement du pro (Stripe `active`).
    2. OU l'expiration d'un délai de 24h après création du lead (PG cron).

## Rule 010 — Stockage Cloudflare R2
- Les documents sensibles (Décennales, Kbis) ne doivent **pas** être stockés dans Supabase Storage.
- Utilisation exclusive de Cloudflare R2 via Presigned URLs générées par le backend Nitro.

## Rule 011 — Masse Critique (Annuaire & Prospect)
- Les prospects non consentants restent en table `prospects` interne (jamais publics).
- Les pros importés activés ou ayant revendiqué leur compte apparaissent dans l'annuaire public avec badge "Décennale vérifiée".

---

## Rule 012 — SMS Teasing & Consentement LCEN
- L'envoi de SMS Twilio est déclenché par une Supabase Edge Function ou Nitro endpoint lors de la création d'un projet.
- Aucun SMS commercial n'est envoyé sans opt-in SMS explicite en table `consents`.
- Le SMS ne doit contenir aucune donnée floutée, seulement les données publiques (Budget, Métier, Ville).
