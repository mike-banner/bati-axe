# AI RULES — Gouvernance des Agents IA

> Ce fichier définit le contrat de collaboration entre les agents IA et le projet BÂTI-AXE.
> Toute IA (Antigravity, Claude, Cursor, Copilot) doit respecter ces règles sans exception.

---

## 🚨 Contexte de Lecture Obligatoire

Avant toute génération de code, suggestion d'architecture, ou modification de fichier, l'agent IA DOIT avoir lu :

| Priorité | Fichier | Raison |
| :--- | :--- | :--- |
| 1 | `docs/core/MASTER_PLAN.md` | Vision et modèle (Le Verrou, Annuaire, SMS). |
| 2 | `docs/memory/roadmap.md` | **LA BIBLE D'EXÉCUTION**. Ne jamais devancer la roadmap. |
| 3 | `docs/decisions/ADR-*.md` | Comprendre POURQUOI Nuxt 3, R2 et le Floutage. |
| 4 | `docs/core/ARCHITECTURE_RULES.md` | Lois immuables (Architecture unique Nuxt 3, Rule 009). |
| 5 | `docs/rules/DATABASE_RULES.md` | Avant tout script SQL. |

---

## Comportements Obligatoires

### Conscience de l'Architecture Mono-App Nuxt 3 (ADR-008)
- Configurer les pages vitrines/SEO en pré-rendu statique (`prerender: true`) pour la vitesse et le SEO.
- Veiller à ce que les routes `/app` privées et authentifiées soient exclues du pré-rendu et protégées côté serveur.
- Séparer proprement les composants de capture (simulateur public) des composants privés (dashboard).

### Sécurité des Données (ADR-004 & ADR-003)
- **Le Verrou** : Ne jamais exposer `phone`, `email`, ou `full_name` dans une payload d'API Nitro sans avoir implémenté la vérification (Premium OU >24h). C'est une faute professionnelle grave.
- **R2** : Ne jamais utiliser le SDK Supabase Storage. Toujours utiliser les API S3-compatibles via Presigned URLs générées côté Nitro.

### Lors de la génération de code
- TypeScript strict : `no any` non justifié.
- Validation Zod sur tous les inputs (Simulateur Nuxt ET endpoints d'API Nitro).
- Format de réponse API standard.
- Gestion des erreurs silencieuses.

---

## Protocol d'Escalade
1. **Doute sur le contexte** : Consulter la roadmap.
2. **Besoin d'une nouvelle techno** : Refusé par défaut. Rédiger un ADR et demander au CTO (l'humain).
3. **Modification du schéma DB** : Mettre à jour `DATABASE_MODEL.md` EN MÊME TEMPS que la migration SQL.
