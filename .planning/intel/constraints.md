# Technical Constraints

Captured constraints from architecture guidelines and ADRs.

- **Stack**: Nuxt 3 (Vue 3) hébergé 100% sur Cloudflare Pages. (source: docs/decisions/ADR-008-NUXT-ONLY-ARCHITECTURE.md)
- **Database**: PostgreSQL (Supabase) avec migrations versionnées via CLI et RLS strict. (source: docs/core/DATABASE_MODEL.md)
- **Storage**: Cloudflare R2 pour les documents avec URLs présignées générées par Nitro. (source: docs/decisions/ADR-003-CLOUDFLARE-R2-STORAGE.md)
- **Privacy & Security**: Floutage côté serveur Nitro (pas de fuite côté client), conformité LCEN (consentement explicite requis pour teasing SMS) et RGPD. (source: docs/decisions/ADR-004-BLUR-LOCK-MECHANISM.md, docs/decisions/ADR-007-RGPD-LCEN.md)
- **Environments**: Séparation stricte Dev (local docker), Staging (Cloudflare Pages Preview) et Prod. (source: docs/decisions/ADR-006-ENVIRONMENTS.md)
