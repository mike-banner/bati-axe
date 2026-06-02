# Architectural Decisions Index

This index lists the architectural decisions captured from ADRs.

| ADR | Title | Status | Scope | Summary |
|---|---|---|---|---|
| [ADR-001-INITIAL-STACK.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-001-INITIAL-STACK.md) | Sélection initiale de la stack technologique (Nuxt 3, Supabase, Cloudflare Pages). | LOCKED (Accepted) | `tech-stack` | Captured from docs/decisions/ADR-001-INITIAL-STACK.md |
| [ADR-002-ASTRO-NEXT-SPLIT.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-002-ASTRO-NEXT-SPLIT.md) | Choix historique d'architecture multi-repos (Astro + Next.js), désormais remplacé par Nuxt 3 unique. | Superseded | `architecture-split` | Captured from docs/decisions/ADR-002-ASTRO-NEXT-SPLIT.md |
| [ADR-003-CLOUDFLARE-R2-STORAGE.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-003-CLOUDFLARE-R2-STORAGE.md) | Stockage des pièces jointes et décennales sur Cloudflare R2 via presigned URLs Nitro. | LOCKED (Accepted) | `storage` | Captured from docs/decisions/ADR-003-CLOUDFLARE-R2-STORAGE.md |
| [ADR-004-BLUR-LOCK-MECHANISM.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-004-BLUR-LOCK-MECHANISM.md) | Mécanisme de verrouillage et floutage côté serveur Nitro des coordonnées des leads. | LOCKED (Accepted) | `lead-blurring` | Captured from docs/decisions/ADR-004-BLUR-LOCK-MECHANISM.md |
| [ADR-005-SUPABASE-EXIT-STRATEGY.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-005-SUPABASE-EXIT-STRATEGY.md) | Stratégie de migration de Supabase vers AWS (RDS, Cognito) si besoin. | LOCKED (Accepted) | `exit-strategy` | Captured from docs/decisions/ADR-005-SUPABASE-EXIT-STRATEGY.md |
| [ADR-006-ENVIRONMENTS.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-006-ENVIRONMENTS.md) | Séparation stricte des environnements Dev (local docker), Staging (Cloudflare Pages Preview) et Prod. | LOCKED (Accepted) | `environments` | Captured from docs/decisions/ADR-006-ENVIRONMENTS.md |
| [ADR-007-RGPD-LCEN.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-007-RGPD-LCEN.md) | Mécanismes de conformité RGPD, LCEN et double opt-in pour prospects et SMS. | LOCKED (Accepted) | `gdpr-compliance` | Captured from docs/decisions/ADR-007-RGPD-LCEN.md |
| [ADR-008-NUXT-ONLY-ARCHITECTURE.md](file:////home/mike/projects/bati-axe/docs/decisions/ADR-008-NUXT-ONLY-ARCHITECTURE.md) | Pivot architectural vers un projet unique Nuxt 3 hébergé 100% sur Cloudflare Pages. | LOCKED (Accepted) | `framework-pivot` | Captured from docs/decisions/ADR-008-NUXT-ONLY-ARCHITECTURE.md |
