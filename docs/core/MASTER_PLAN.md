# 🏛️ MASTER PLAN — BÂTI-AXE

## 1. Vision & Positionnement
BÂTI-AXE est une marketplace sélective de mise en relation B2B/B2C dans le bâtiment.
Elle agit comme un **tiers de confiance** qui sécurise la chaîne de valeur en vérifiant les garanties décennales des professionnels.

## 2. Stratégie de Déploiement — Prototype-First
- **Phase prototype** : une seule ville pilote (**Carrières-sous-Poissy / 78**), avec une dizaine à quelques dizaines de pros recrutés et opt-in à la main.
- **Validation business** : on mesure conversion simulateur, claim rate, conversion PRO avant tout scale.
- **Scalabilité géographique** par incrément : ville → département → région → France. L'architecture (table `zones`, slugs SEO dynamiques) est prête dès la Phase 1, mais l'activation des zones se fait au fur et à mesure que la base de pros est enrichie et opt-inée.
- **Les ~7 000 contacts** d'origine sont une base brute interne (`prospects`), pas une donnée publiable. Ils intègrent progressivement la table `professionals` via opt-in email ou claim volontaire (voir ADR-007).

## 3. Parcours Utilisateurs

### A. Le Particulier (Acquisition)
- **Tunnel d'expertise** : Simulateur métier en 6 étapes (Nuxt prerender) pour qualifier le projet (type, budget, urgence).
- **Zéro Friction** : pas de compte immédiat, dépôt de projet simple.
- **Promesse** : mise en relation exclusive avec des pros vérifiés (décennale à jour).

### B. Le Professionnel (Rétention & Cash)
- **Onboarding manuel Phase 1** : ~20 pros pilotes recrutés à la main, opt-in vérifié, décennale validée par admin.
- **SMS Teasing** : moteur de revenu, déclenché uniquement après opt-in SMS explicite (case dédiée, LCEN).
- **Le Verrou** : coordonnées clients floutées côté serveur (Nuxt Nitro API), démasquage conditionné par abonnement actif ou délai de 24h.

## 4. Modèle Économique (Monétisation)
- **Gratuit** : accès aux coordonnées après un délai de 24h (obsolescence du lead).
- **Abonnement PRO** : accès instantané aux coordonnées pour appeler le client en premier.

## 5. Architecture Cible
- Frontend unique **Nuxt 3** déployé sur Cloudflare Pages (ADR-008).
- Database & Auth **Supabase** (ADR-001).
- Stockage PDF **Cloudflare R2** (ADR-003).
- Conformité **RGPD / LCEN** dès la Phase 0 (ADR-007).

## 6. Product Pillars
- **Trust First** : Vérification décennale systématique.
- **Psychologie de l'Annuaire** : Pousser les pros à s'inscrire pour "nettoyer" leur profil.
- **Vitesse (Speed to Lead)** : Le premier pro qui appelle gagne.
- **Légalité by Design** : Aucun envoi commercial ni publication sans consentement actif.
