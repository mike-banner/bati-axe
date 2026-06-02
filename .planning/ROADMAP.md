# Roadmap: BÂTI-AXE

## Overview
Ce projet est structuré en deux phases clés : la Phase 1 se concentre sur les fondations techniques (Nuxt 3 unifié, Supabase CLI local, R2) et la capture mono-ville (Carrières-sous-Poissy) avec claim pro de base. La Phase 2 introduit la monétisation Stripe active, le matching SMS teasing et le back-office admin complet.

## Phases

- [ ] **Phase 1: Foundations & Capture Mono-ville** - Initialisation de la stack unifiée, du simulateur de capture à Carrières-sous-Poissy, et du claim de base avec upload R2.
- [ ] **Phase 2: Monétisation, SMS Teasing & Back-Office** - Intégration Stripe, SMS Teasing différé/instantané et console d'administration pour validation des décennales.

## Phase Details

### Phase 1: Foundations & Capture Mono-ville
**Goal**: Mettre en place la structure Nuxt 3 unique sur Cloudflare Pages, le stockage R2, la database locale Supabase, et le tunnel de capture pour Carrières-sous-Poissy avec le mécanisme de claim.
**Depends on**: Nothing
**Requirements**: CPTR-01, CPTR-02, CPTR-03, CPTR-04, CPTR-05, LCK-01, LCK-03, CLM-02, CLM-03, CLM-04, SMS-03, ADM-01
**Success Criteria** (what must be TRUE):
  1. Le simulateur Nuxt 3 permet à un particulier de Carrières-sous-Poissy d'enregistrer son projet de rénovation.
  2. Le contact client est flouté côté serveur Nitro pour les requêtes anonymes ou basiques.
  3. Un professionnel peut créer son compte et charger ses pièces justificatives (décennale, KBIS) sur R2.
  4. L'administrateur peut valider ou refuser les justificatifs d'un pro et changer son statut de décennale.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Monétisation, SMS Teasing & Back-Office
**Goal**: Implémenter l'abonnement Stripe Premium pour débloquer les coordonnées instantanément, configurer l'envoi de teasing par SMS via Twilio, et finaliser la console d'administration.
**Depends on**: Phase 1
**Requirements**: LCK-02, CLM-01, SMS-01, SMS-02, ADM-02, ADM-03
**Success Criteria** (what must be TRUE):
  1. Un professionnel Premium abonné via Stripe accède instantanément et sans floutage aux coordonnées du prospect.
  2. Un SMS de teasing est envoyé à l'artisan Premium instantanément après soumission d'un projet, et après 30 min aux artisans Basic.
  3. L'administrateur dispose d'un tableau de bord de modération des leads et d'un rapport de performance SMS.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|---|---|---|---|
| 1. Foundations & Capture Mono-ville | 0/2 | Not started | - |
| 2. Monétisation, SMS Teasing & Back-Office | 0/2 | Not started | - |
