# Phase 4: Le Verrou & Stripe Billing - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-05
**Phase:** 04-le-verrou-stripe-billing
**Areas discussed:** Matching leads → pros, Checkout Stripe, Logique de déblocage, Dashboard leads

---

## Matching leads → pros

| Option | Description | Selected |
|--------|-------------|----------|
| Auto immédiat (zone + catégorie) | Leads créés dès dépôt du projet | |
| Via étape admin | L'admin valide avant envoi | |
| Mix : auto + filtre admin | Création auto + flag 'qualified' admin | ✓ |

**User's choice:** Mix auto + filtre admin
**Notes:** Filtrage par catégorie uniquement (pas zone) — les pros du bâtiment se déplacent. Un pro peut avoir plusieurs catégories à terme (déferré). Pour la Phase 4, un pro = une catégorie. L'admin qualifie le projet via l'endpoint `/qualify`, qui crée les leads pour tous les pros vérifiés de la catégorie correspondante.

---

## Checkout Stripe

| Option | Description | Selected |
|--------|-------------|----------|
| Stripe abonnement mensuel | Classic SaaS, 39€/mois placeholder | ✓ |
| Crédits par lead | Pay-per-lead, modèle Bark/Habitissimo | |
| Lemon Squeezy | MoR EU, TVA automatique | |

**User's choice:** Stripe abonnement mensuel, 39€/mois placeholder
**Notes:** User a demandé une analyse comparative des modèles. Lemon Squeezy et Paddle évalués pour leur avantage Merchant of Record (TVA EU auto) — retenus en déferré si la compliance TVA devient problématique. Bark/Habitissimo utilisent le crédit par lead — écarté pour Phase 4 (complexité), à reconsidérer si le taux de conversion abonnement est faible.
Page dédiée `/espace/premium` choisie (pas un modal inline) pour avoir de l'espace pour présenter la valeur.

---

## Logique de déblocage

| Option | Description | Selected |
|--------|-------------|----------|
| 24h après création du lead | Spec initial LCK-03 | |
| 24h après qualification admin | Chrono depuis la qualification | |
| Jusqu'à clôture + fallback 72h | Premium exclusif, puis BASIC après 72h si non pris | ✓ |

**User's choice:** Jusqu'à clôture par un pro + fallback 72h
**Notes:** User a identifié que 24h était trop court — un Premium n'a pas le temps de se mettre d'accord avec le client en 24h, ce qui rendrait l'abonnement sans valeur. Logique révisée : Premium exclusif, si non pris dans 72h → disponible BASIC. Si un Premium prend le lead, les BASIC voient la card avec badge "Déjà attribué" (sans coordonnées) — transparence sur le volume. La commune est aussi masquée (pas seulement nom/tél/email) pour éviter l'identification géographique via photos/street view.

---

## Dashboard leads

| Option | Description | Selected |
|--------|-------------|----------|
| Onglet dans /app/dashboard | Tout en un | |
| Page séparée /espace/leads | Navigation propre, extensible | ✓ |

**User's choice:** Page séparée `/espace/leads`
**Notes:** Cards avec badge statut. CTA contextuel : "Passer Premium" (lead flouté) / "Voir le contact" (débloqué) / badge "Déjà attribué" (pris). Page détail `/espace/leads/[id]` pour afficher les coordonnées complètes.

---

## Claude's Discretion

- Structure et copywriting de la page `/espace/premium`
- Pagination vs infinite scroll sur `/espace/leads`
- Tri des leads (plus récent en premier par défaut)
- Portail Stripe pour annulation self-service

## Deferred Ideas

- Multi-catégories par pro — Phase 5+
- Filtre zone / rayon km — Phase 5 (scale multi-villes)
- Score de pertinence des leads
- Crédit par lead (modèle alternatif)
- Lemon Squeezy / Paddle pour TVA EU automatique
