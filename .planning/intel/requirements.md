# Extracted Requirements

This list of requirements is synthesized from project specifications.

### Module de Capture (Simulateur Nuxt)
- **REQ-CPTR-01**: Sélection dynamique par nature de projet (icônes). (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-CPTR-02**: Localisation avec code postal (Focus 78). (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-CPTR-03**: Saisie du budget estimé et délai souhaité. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-CPTR-04**: Saisie des coordonnées de contact (nom, email, téléphone). (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-CPTR-05**: Enregistrement sécurisé du projet anonyme sans compte requis. (source: docs/core/TECHNICAL_SCOPE.md)

### Le Verrou (Logique de Floutage)
- **REQ-LCK-01**: Floutage serveur (Nitro API) des données de contact client (`customer_full_name`, `customer_phone`, `customer_email`, `exact_address`). (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-LCK-02**: Accès immédiat non flouté pour les pros PREMIUM via abonnement Stripe. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-LCK-03**: Déblocage automatique gratuit après un délai d'attente de 24 heures pour les pros BASIC. (source: docs/core/TECHNICAL_SCOPE.md)

### Système de Revendication (Claim)
- **REQ-CLM-01**: Revendication de profil pour les prospects importés. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-CLM-02**: Authentification de compte pro sécurisée. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-CLM-03**: Chargement et stockage isolé de la pièce d'identité, du KBIS et de l'assurance décennale sur R2. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-CLM-04**: Statut de vérification mis à jour après validation manuelle par l'administrateur. (source: docs/core/TECHNICAL_SCOPE.md)

### Notifications SMS (Teasing)
- **REQ-SMS-01**: Teasing par SMS instantané aux pros PREMIUM après un dépôt de projet. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-SMS-02**: Teasing par SMS avec délai de 30 minutes aux pros BASIC. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-SMS-03**: Consentement SMS explicite obligatoire (RGPD / LCEN). (source: docs/core/TECHNICAL_SCOPE.md)

### Administration & Back-office
- **REQ-ADM-01**: Interface de validation des documents administratifs (Kbis, décennale) stockés sur R2. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-ADM-02**: Modération et nettoyage des leads suspects avant envoi aux artisans. (source: docs/core/TECHNICAL_SCOPE.md)
- **REQ-ADM-03**: Console d'analytics (taux d'ouverture SMS vs taux de clic). (source: docs/core/TECHNICAL_SCOPE.md)
