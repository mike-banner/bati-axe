# ADR-007 : Conformité RGPD / LCEN — Consentement & Démarchage

- **Date** : 2026-06-02
- **Statut** : Accepted
- **Auteurs** : @mike

## Contexte
BÂTI-AXE prévoit :
1. La publication progressive de profils d'artisans issus d'une base brute (non confirmée).
2. L'envoi de SMS commerciaux (Teasing) à ces professionnels.

Sans encadrement, ces deux flux violent :
- **RGPD** (Règlement (UE) 2016/679) : pas de base légale pour publication de données personnelles et démarchage.
- **LCEN** art. L.34-5 (Code des postes et communications électroniques) : prospection directe par SMS interdite sans consentement préalable explicite, sauf relation contractuelle préexistante portant sur des biens/services analogues.

## Décision

### 1. Base brute = stockage interne, jamais public par défaut
- Les contacts de la base brute (issus de sources publiques type Sirene, partenariats, scraping légal) sont importés en table interne `prospects` (NON `professionals`).
- Aucune publication, aucune indexation SEO tant que le pro n'a pas donné un consentement actif.

### 2. Activation par opt-in vérifié, ville par ville
- Un pro entre dans `professionals` (et devient publiable) uniquement après :
    - clic sur un lien double opt-in envoyé par email (token signé, expiration 7j), **OU**
    - création de compte volontaire via le flux Claim.
- Le consentement est journalisé dans la table `consents` (cf. DATABASE_MODEL.md) avec : timestamp, IP, user-agent, version des CGU acceptées, source (email-optin / claim / cgu).

### 3. SMS Teasing — opt-in spécifique
- L'opt-in compte pro NE vaut PAS opt-in SMS.
- Case à cocher distincte ("J'accepte de recevoir par SMS des alertes projets dans ma zone — désinscription à tout moment par STOP").
- Stockage : `consents.channel='sms'`, révocable. Mot-clé STOP géré côté Twilio webhook → bascule du consent.
- Conservation du log d'envoi (`sms_logs`) avec horodatage et statut Twilio.

### 4. Droits RGPD
- Endpoints `/legal/access`, `/legal/erasure`, `/legal/rectification` côté app Nuxt.
- Suppression projet client après 90 jours (rétention par défaut), purge `prospects` non-activés après 24 mois.
- DPO référent : à nommer avant production (cf. Phase 0).

### 5. Mentions et registre
- Mentions légales + politique de confidentialité + politique cookies publiées avant tout trafic réel.
- Registre des traitements (art. 30 RGPD) maintenu dans `docs/legal/` (à créer Phase 0).

## Conséquences
- **Positives** : risque légal mitigé, base de confiance compatible avec la promesse "tiers de confiance".
- **Négatives** : ramp-up plus lent (publication conditionnée à opt-in). C'est cohérent avec la stratégie prototype-first.

## Hors scope ADR
- Choix de l'avocat / DPO (organisationnel).
- Conformité hébergement données santé / bancaire (non applicable Phase 1).
