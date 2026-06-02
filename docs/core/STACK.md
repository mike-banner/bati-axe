# 🛠️ STACK TECHNIQUE — BÂTI-AXE

| Segment | Technologie | Rôle | Statut |
| :--- | :--- | :--- | :--- |
| **Frontend unique** | Nuxt 3 (Vue 3) | Vitrine SEO (SSG/prerender) + App Pro (SSR protégé) dans une seule app | 🔒 LOCKED |
| **Database & Auth** | Supabase (PostgreSQL) | Pros, projets, leads, consentements | 🔒 LOCKED |
| **Stockage fichiers** | Cloudflare R2 | PDF décennales / Kbis (Egress 0€) | 🔒 LOCKED |
| **Emailing** | Resend | Emails transactionnels, opt-in, alertes | 🔒 LOCKED |
| **SMS** | Twilio | SMS Teasing (après opt-in vérifié) | 🔒 LOCKED |
| **Paiements** | Stripe Billing | Abonnements PRO récurrents | 🔒 LOCKED |
| **Hosting** | Cloudflare Pages (Nitro preset) | Déploiement Edge unique | 🔒 LOCKED |
| **Observabilité** | Sentry + Axiom | Erreurs, logs structurés, audit | 🔒 LOCKED |
| **Monorepo / packages** | Aucun | Repo unique sans workspaces pour simplifier | 🔒 LOCKED |

---

## Philosophie de Maintenance
- **Une seule app, un seul deploy** : Nuxt 3 sert la vitrine (`batiaxe.fr`, prerender SSG) et l'app pro (`/app/*`, SSR auth) depuis le même projet, via `routeRules` Nitro.
- **Zéro Serveur à gérer** : 100% managé/serverless (Cloudflare Pages + Supabase + R2).
- **Data Integrity** : Supabase = source de vérité unique. R2 ne stocke que des fichiers, jamais de métier.
- **Vendor lock-in mitigé** : voir ADR-005.
