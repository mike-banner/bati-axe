# Requirements: BÂTI-AXE

**Defined**: 2026-06-02
**Core Value**: Mettre en relation exclusive des particuliers porteurs de projets avec des professionnels certifiés du bâtiment dont les garanties décennales sont vérifiées.

## v1 Requirements

### Capture (Simulateur Nuxt)
- [ ] **CPTR-01**: Sélection dynamique par nature de projet (icônes)
- [ ] **CPTR-02**: Localisation avec code postal (Focus 78)
- [ ] **CPTR-03**: Saisie du budget estimé et délai souhaité
- [ ] **CPTR-04**: Saisie des coordonnées de contact (nom, email, téléphone)
- [ ] **CPTR-05**: Enregistrement sécurisé du projet anonyme sans compte requis

### Le Verrou (Logique de Floutage)
- [ ] **LCK-01**: Floutage serveur (Nitro API) des coordonnées des prospects (`customer_full_name`, `customer_phone`, `customer_email`, `exact_address`)
- [ ] **LCK-02**: Accès immédiat non flouté pour les pros PREMIUM via abonnement Stripe
- [ ] **LCK-03**: Déblocage automatique gratuit après un délai d'attente de 24 heures pour les pros BASIC

### Revendication (Claim) & Verification
- [ ] **CLM-01**: Revendication de profil pour les prospects importés
- [ ] **CLM-02**: Authentification de compte pro sécurisée
- [ ] **CLM-03**: Chargement et stockage isolé de la pièce d'identité, du KBIS et de l'assurance décennale sur R2 via presigned URLs
- [ ] **CLM-04**: Statut de vérification mis à jour après validation manuelle par l'administrateur

### SMS Teasing
- [ ] **SMS-01**: Teasing par SMS instantané aux pros PREMIUM après un dépôt de projet
- [ ] **SMS-02**: Teasing par SMS avec délai de 30 minutes aux pros BASIC
- [ ] **SMS-03**: Consentement SMS explicite obligatoire (RGPD / LCEN)

### Administration
- [ ] **ADM-01**: Interface de validation des documents administratifs (Kbis, décennale) stockés sur R2
- [ ] **ADM-02**: Modération et nettoyage des leads suspects avant envoi aux artisans
- [ ] **ADM-03**: Console d'analytics (taux d'ouverture SMS vs taux de clic)

## v2 Requirements
- **GEO-01**: Scalabilité géographique dynamique automatisée (activation multi-villes via console admin)
- **PAY-01**: Facturation automatisée Stripe et gestion des factures PDF

## Out of Scope
| Feature | Reason |
|---|---|
| Messagerie interne | Le contact se fait directement par téléphone et SMS. |
| Inscription client obligatoire | Zéro friction lors de la capture du besoin. |

## Traceability
| Requirement | Phase | Status |
|---|---|---|
| CPTR-01 | Phase 1 | Pending |
| CPTR-02 | Phase 1 | Pending |
| CPTR-03 | Phase 1 | Pending |
| CPTR-04 | Phase 1 | Pending |
| CPTR-05 | Phase 1 | Pending |
| LCK-01 | Phase 1 | Pending |
| LCK-02 | Phase 2 | Pending |
| LCK-03 | Phase 1 | Pending |
| CLM-01 | Phase 2 | Pending |
| CLM-02 | Phase 1 | Pending |
| CLM-03 | Phase 1 | Pending |
| CLM-04 | Phase 1 | Pending |
| SMS-01 | Phase 2 | Pending |
| SMS-02 | Phase 2 | Pending |
| SMS-03 | Phase 1 | Pending |
| ADM-01 | Phase 1 | Pending |
| ADM-02 | Phase 2 | Pending |
| ADM-03 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-02*
*Last updated: 2026-06-02 after Ingest Docs*
