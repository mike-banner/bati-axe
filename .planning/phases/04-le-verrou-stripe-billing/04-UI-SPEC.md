# UI-SPEC — Phase 4: Le Verrou & Stripe Billing

**Generated:** 2026-06-05
**Skill:** ui-ux-pro-max
**Stack:** Nuxt 3 / Vue 3 (Composition API) / shadcn-vue / Tailwind CSS
**Status:** Ready for planning

---

## Design System

### Style
**Minimalism & Swiss Style** — Clean, fonctionnel, haute lisibilité, espacement généreux, grille stricte.
Adapté aux outils SaaS BtoB, dashboards professionnels, espace pro bâtiment.

### Palette

| Rôle | Token Tailwind | Hex | Usage |
|------|---------------|-----|-------|
| Primary | `slate-900` | `#0F172A` | Titres, nav, headers |
| Secondary | `slate-600` | `#334155` | Texte corps, labels |
| Muted | `slate-400` | `#94A3B8` | Texte désactivé, placeholders |
| Background | `slate-50` | `#F8FAFC` | Fond de page |
| Surface | `white` | `#FFFFFF` | Cards, panneaux |
| CTA | `sky-700` | `#0369A1` | Boutons primaires, liens |
| CTA Hover | `sky-800` | `#075985` | Hover état bouton |
| Premium Gold | `amber-500` | `#F59E0B` | Badge Premium, accents upsell |
| Premium Bg | `amber-50` | `#FFFBEB` | Fond CTA "Passer Premium" |
| Locked | `slate-200` | `#E2E8F0` | Card floutée background |
| Unlocked | `emerald-50` | `#ECFDF5` | Card débloquée background |
| Claimed | `slate-100` | `#F1F5F9` | Card prise (neutre, no CTA) |
| Danger | `red-600` | `#DC2626` | Erreurs |
| Border | `slate-200` | `#E2E8F0` | Bordures cards |

### Typographie
**Plus Jakarta Sans** (Google Fonts) — moderne, SaaS-ready, lisible à toutes tailles.

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
font-family: 'Plus Jakarta Sans', sans-serif;
```

| Élément | Taille | Poids | Classe Tailwind |
|---------|--------|-------|----------------|
| Page title | 24px | 700 | `text-2xl font-bold` |
| Section title | 18px | 600 | `text-lg font-semibold` |
| Card title | 15px | 600 | `text-[15px] font-semibold` |
| Body | 14px | 400 | `text-sm` |
| Label / Meta | 12px | 500 | `text-xs font-medium` |
| Countdown | 13px | 600 | `text-[13px] font-semibold` |

Line-height corps : `leading-relaxed` (1.625). Longueur max colonne : 65 caractères.

### Icônes
**Lucide Vue** uniquement — aucun emoji. Taille standard `w-4 h-4` (inline) / `w-5 h-5` (standalone).
Icônes clés : `LockKeyholeIcon`, `UnlockIcon`, `CheckCircle2Icon`, `ClockIcon`, `StarIcon`, `PhoneIcon`, `MailIcon`, `MapPinIcon`, `BuildingIcon`, `EuroIcon`.

### Spacing & Layout
- Conteneur max : `max-w-5xl mx-auto px-4 sm:px-6`
- Gap cards grid : `gap-4`
- Padding card : `p-5` (desktop) / `p-4` (mobile)
- Radius : `rounded-xl` (cards) / `rounded-lg` (boutons/badges)

### Transitions
- Hover cards : `transition-shadow duration-200`
- Boutons : `transition-colors duration-150`
- Respect `prefers-reduced-motion` : désactiver transitions si activé

---

## Page 1 — `/espace/leads` (Dashboard Leads)

### Objectif UX
Permettre au pro de scanner rapidement son pipeline de leads et d'identifier les actions prioritaires (débloquer via Premium ou attendre 72h).

### Layout

```
┌─────────────────────────────────────────────────┐
│  Navbar espace pro (existante)                  │
├─────────────────────────────────────────────────┤
│  [Titre] Mes leads        [Badge] N leads       │
│  [Sous-titre] Leads qualifiés pour votre métier │
├─────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Card     │ │ Card     │ │ Card     │        │
│  │ Flouté   │ │ Débloqué │ │ Pris     │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────┐                     │
│  │ Card     │ │ Card     │                     │
│  │ Flouté   │ │ Flouté   │                     │
│  └──────────┘ └──────────┘                     │
└─────────────────────────────────────────────────┘
```

Grid : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

### Composant LeadCard — 3 variantes

#### Variante A : Lead flouté (BASIC, <72h, non pris)

```
┌─────────────────────────────────────────┐  bg-white border border-slate-200
│  🏗 Rénovation intérieure   [🔒 Flouté] │  Badge: bg-slate-100 text-slate-500
│                                         │  rounded-xl shadow-sm
│  💰 10 000 – 20 000 €                  │
│  ⏱  1 à 3 mois                         │
│  📍 *** *** (commune masquée)           │  text-slate-300 select-none
│  👤 *** *** ***                         │  text-slate-300 select-none
│  📞 *** *** ***                         │  text-slate-300 select-none
│                                         │
│  ⏳ Disponible dans 47h 23min           │  text-amber-600 text-xs font-semibold
│                                         │
│  [★ Passer Premium]  (plein, amber)    │  bg-amber-500 hover:bg-amber-600
└─────────────────────────────────────────┘  text-white rounded-lg py-2 w-full
```

**Règles visuelles :**
- Les champs masqués (`*** *** ***`) : `text-slate-300 font-mono select-none blur-[2px]` — flou CSS *léger* sur le texte (pas sur la card entière) pour effet teasing visuel
- Le flou CSS est decoratif uniquement — les vraies données ne sont jamais envoyées (ADR-004)
- Compte à rebours : calculé depuis `unlocked_at - now()`, format `Xh Ymin`
- Border card : `border-slate-200` (pas de couleur d'accent)
- Cursor : `cursor-default` (la card entière n'est pas cliquable)

#### Variante B : Lead débloqué (Premium actif OU BASIC + 72h passées)

```
┌─────────────────────────────────────────┐  bg-emerald-50 border border-emerald-200
│  🏗 Rénovation intérieure  [✓ Débloqué]│  Badge: bg-emerald-100 text-emerald-700
│                                         │  rounded-xl
│  💰 10 000 – 20 000 €                  │
│  ⏱  1 à 3 mois                         │
│  📍 Carrières-sous-Poissy               │  text visible, text-slate-700
│  👤 Jean Dupont                         │  text-slate-900 font-medium
│  📞 06 12 34 56 78                      │  text-sky-700 font-medium
│                                         │
│  [→ Voir le contact]  (outline sky)    │  border border-sky-600 text-sky-700
└─────────────────────────────────────────┘  hover:bg-sky-50 rounded-lg py-2 w-full
```

**Règles visuelles :**
- Background `emerald-50` signale visuellement que c'est actionnable
- Téléphone en `text-sky-700` (couleur lien) pour affordance "cliquable"
- CTA `→ Voir le contact` navigue vers `/espace/leads/[id]`

#### Variante C : Lead pris (Premium a pris le lead)

```
┌─────────────────────────────────────────┐  bg-slate-100 border border-slate-200
│  🏗 Rénovation intérieure  [Attribué]   │  Badge: bg-slate-200 text-slate-500
│                                         │  opacity-75 rounded-xl
│  💰 10 000 – 20 000 €                  │  text-slate-400
│  ⏱  1 à 3 mois                         │  text-slate-400
│  📍 *** *** ***                         │  text-slate-300 (toujours masqué)
│  👤 *** *** ***                         │  text-slate-300
│  📞 *** *** ***                         │  text-slate-300
│                                         │
│  [Ce lead a déjà été attribué]          │  text-slate-400 text-xs text-center py-2
└─────────────────────────────────────────┘  no CTA button
```

**Règles visuelles :**
- Opacity réduite (`opacity-75`) pour dé-prioriser visuellement
- Aucun CTA — message informatif uniquement
- Pas de flou CSS (le masquage des données suffit)

### État vide (0 leads)
```
┌─────────────────────────────────────────────┐
│          [Icône BuildingIcon w-12 h-12]     │
│      Aucun lead pour l'instant              │  text-slate-500
│  Les leads qualifiés apparaîtront ici       │  text-slate-400 text-sm
│  dès que l'équipe BÂTI-AXE les valide.      │
└─────────────────────────────────────────────┘
```

### Banner Premium contextuel (BASIC avec leads floutés)
Si l'utilisateur est BASIC et a ≥1 lead flouté → afficher banner en haut de page :

```
┌──────────────────────────────────────────────────────────┐
│ ★  Passez Premium pour voir les coordonnées immédiatement │  bg-amber-50 border border-amber-200
│    39€/mois · Sans engagement · Annulable à tout moment  │  text-amber-800 rounded-xl p-4
│                          [Voir l'offre Premium →]        │  CTA: text-amber-700 font-semibold underline
└──────────────────────────────────────────────────────────┘
```

---

## Page 2 — `/espace/leads/[id]` (Détail Lead)

### Objectif UX
Afficher toutes les informations du projet + coordonnées complètes du prospect (si débloqué), dans une mise en page claire et orientée action.

### Layout

```
┌──────────────────────────────────────────────┐
│  ← Retour à mes leads                       │  text-sm text-sky-700 cursor-pointer
├──────────────────────────────────────────────┤
│  [Badge statut]  Rénovation intérieure       │  text-2xl font-bold text-slate-900
│  Reçu le JJ/MM/AAAA                         │  text-sm text-slate-400
├──────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌───────────────────┐  │
│  │ Infos projet    │  │ Contact prospect  │  │
│  │ (toujours vis.) │  │ (conditionnel)    │  │
│  └─────────────────┘  └───────────────────┘  │
└──────────────────────────────────────────────┘
```

### Card "Infos projet" (toujours visible)

```
┌─────────────────────────────────────┐  bg-white border border-slate-200 rounded-xl p-5
│ Détails du projet                   │  text-sm font-semibold text-slate-600 mb-3
│                                     │
│ Catégorie    Rénovation intérieure  │  grid grid-cols-2 gap-y-3
│ Budget       10 000 – 20 000 €      │
│ Délai        1 à 3 mois             │
│ Description  [texte du besoin]      │  text-slate-700 (si débloqué)
│              *** *** ***            │  text-slate-300 blur-[2px] (si flouté)
└─────────────────────────────────────┘
```

### Card "Contact prospect" — 2 variantes

**Si débloqué :**
```
┌─────────────────────────────────────┐  bg-emerald-50 border border-emerald-200 rounded-xl p-5
│ ✓ Coordonnées disponibles           │  text-sm font-semibold text-emerald-700 mb-3
│                                     │
│ 👤 Jean Dupont                      │  text-slate-900 font-medium
│ 📞 06 12 34 56 78                   │  text-sky-700 (cliquable tel:)
│ ✉  jean.dupont@email.com            │  text-sky-700 (cliquable mailto:)
│                                     │
│ [📞 Appeler]  [✉ Envoyer un email]  │  boutons outline sm, côte à côte
└─────────────────────────────────────┘
```

**Si flouté (BASIC, <72h) :**
```
┌─────────────────────────────────────┐  bg-amber-50 border border-amber-200 rounded-xl p-5
│ 🔒 Coordonnées non disponibles      │  text-sm font-semibold text-amber-700 mb-3
│                                     │
│ 👤 *** *** ***                      │  text-slate-300 blur-[2px]
│ 📞 *** *** ***                      │  text-slate-300 blur-[2px]
│ ✉  contact@***.fr                   │  text-slate-300 blur-[2px]
│                                     │
│ ⏳ Disponible dans 47h 23min        │  text-amber-600 text-sm font-semibold
│                                     │
│ [★ Passer Premium pour voir maint.] │  bg-amber-500 text-white w-full
└─────────────────────────────────────┘
```

---

## Page 3 — `/espace/premium` (Abonnement Premium)

### Objectif UX
Convaincre un pro BASIC de s'abonner. Pattern : Hero (problème) → Valeur → Prix → CTA Stripe → FAQ.

### Layout complet

```
┌─────────────────────────────────────────────────────┐
│  Navbar espace pro                                  │
├─────────────────────────────────────────────────────┤
│  HERO                                               │
│  ★ Débloquez tous vos leads instantanément         │  text-3xl font-bold text-slate-900
│  Ne perdez plus de chantiers à cause du délai 72h. │  text-lg text-slate-500 mt-2
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ +200     │ │ Immédiat │ │ 39€/mois │           │  3 stat blocks
│  │ pros     │ │ accès    │ │ sans eng.│           │
│  └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────┤
│  COMPARAISON BASIC vs PREMIUM                       │
│  ┌────────────────────┬──────────┬───────────────┐ │
│  │                    │  BASIC   │  PREMIUM ★    │ │
│  ├────────────────────┼──────────┼───────────────┤ │
│  │ Voir les leads     │   ✓      │      ✓        │ │
│  │ Coordonnées imméd. │   ✗      │      ✓        │ │
│  │ Accès après 72h    │   ✓      │      ✓        │ │
│  │ Priorité contacts  │   ✗      │      ✓        │ │
│  └────────────────────┴──────────┴───────────────┘ │
├─────────────────────────────────────────────────────┤
│  PRIX                                               │
│  ┌───────────────────────────────────────────────┐ │
│  │  ★ PREMIUM                                    │ │  bg-amber-50 border-2 border-amber-400
│  │  39 € / mois                                  │ │  text-4xl font-bold text-slate-900
│  │  Sans engagement · Annulable à tout moment    │ │  text-sm text-slate-500
│  │                                               │ │
│  │  ✓ Accès immédiat à toutes les coordonnées    │ │
│  │  ✓ Leads illimités dans votre catégorie       │ │
│  │  ✓ Avant les pros BASIC (exclusivité 72h)     │ │
│  │                                               │ │
│  │  [Démarrer Premium — 39€/mois]                │ │  bg-amber-500 hover:bg-amber-600 text-white
│  │                                               │ │  text-base font-semibold py-3 rounded-xl w-full
│  │  🔒 Paiement sécurisé par Stripe              │ │  text-xs text-slate-400 mt-2
│  └───────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│  FAQ                                                │
│  Q: Puis-je annuler à tout moment ?                │  Accordion shadcn (collapsible)
│  Q: Que se passe-t-il après annulation ?           │
│  Q: Le paiement est-il sécurisé ?                  │
└─────────────────────────────────────────────────────┘
```

### Card Prix — détail styling

```
bg-amber-50 border-2 border-amber-400 rounded-2xl p-8
max-w-md mx-auto
```

- Badge "Le plus populaire" si pertinent : `bg-amber-400 text-white text-xs px-3 py-1 rounded-full -mt-4 mx-auto`
- Bouton CTA : `bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl w-full transition-colors duration-150`
- État loading bouton : désactiver + spinner Lucide `Loader2Icon animate-spin` pendant redirect Stripe

---

## Tokens & Classes Partagés

### Badges statut (réutilisables)

```vue
<!-- Badge Flouté -->
<Badge variant="secondary" class="bg-slate-100 text-slate-500 border-0">
  <LockKeyholeIcon class="w-3 h-3 mr-1" /> Flouté
</Badge>

<!-- Badge Débloqué -->
<Badge class="bg-emerald-100 text-emerald-700 border-0">
  <UnlockIcon class="w-3 h-3 mr-1" /> Débloqué
</Badge>

<!-- Badge Attribué -->
<Badge variant="secondary" class="bg-slate-200 text-slate-500 border-0">
  Déjà attribué
</Badge>

<!-- Badge Premium -->
<Badge class="bg-amber-100 text-amber-700 border-0">
  <StarIcon class="w-3 h-3 mr-1" /> Premium
</Badge>
```

### Masquage texte (Le Verrou — effet teasing)

```vue
<!-- Champ masqué : flou CSS décoratif sur du texte placeholder -->
<span class="text-slate-300 font-mono blur-[2px] select-none pointer-events-none">
  *** *** ***
</span>
```

Note : `blur-[2px]` est purement décoratif. Les vraies données ne transitent jamais vers le client (ADR-004). C'est le serveur qui envoie les `***`, pas du CSS qui masque un vrai texte.

### Countdown composant

```vue
<!-- LeadCountdown.vue -->
<template>
  <span class="flex items-center gap-1 text-amber-600 text-xs font-semibold">
    <ClockIcon class="w-3 h-3" />
    Disponible dans {{ hours }}h {{ minutes }}min
  </span>
</template>
```

Calcul : `Math.max(0, new Date(unlocked_at).getTime() - Date.now())` → décomposer en heures/minutes. Pas de `setInterval` agressif — rafraîchir toutes les 60s.

---

## Accessibilité

- Contrast ratio garanti ≥ 4.5:1 sur toute paire texte/fond (vérifié avec la palette ci-dessus)
- Focus rings : tous les boutons et liens ont `focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2`
- `aria-label` sur les icônes seules
- Les champs masqués ont `aria-hidden="true"` — screen readers ne lisent pas `*** *** ***`
- Bouton Stripe : `aria-busy="true"` pendant le loading
- `prefers-reduced-motion` : désactiver `transition-*` si `@media (prefers-reduced-motion: reduce)`

---

## States d'erreur & Loading

### Skeleton loading (leads list)
```vue
<!-- 3 skeleton cards pendant useAsyncData -->
<div v-for="i in 3" class="bg-slate-100 rounded-xl h-[180px] animate-pulse" />
```

### Erreur API
```
┌───────────────────────────────────────────┐  bg-red-50 border border-red-200 rounded-xl p-4
│ ⚠ Impossible de charger vos leads        │  text-red-700 font-medium
│ Réessayez dans quelques instants          │  text-red-500 text-sm
│ [Réessayer]                               │  outline red button
└───────────────────────────────────────────┘
```

### Succès post-abonnement (`?upgrade=success`)
```
┌───────────────────────────────────────────┐  bg-emerald-50 border border-emerald-200 p-4 rounded-xl
│ ✓ Bienvenue dans BÂTI-AXE Premium !      │  text-emerald-700 font-semibold
│ Vos leads sont maintenant débloqués.      │  text-emerald-600 text-sm
└───────────────────────────────────────────┘
```
Afficher uniquement si `?upgrade=success` dans l'URL. Auto-dismiss après 6s.

---

## Anti-Patterns à éviter

- **Jamais** de flou CSS sur toute la card (seulement sur les champs texte masqués)
- **Jamais** d'emoji comme icône (LockKeyhole, Star via Lucide uniquement)
- **Pas** de `filter: blur()` côté client pour "cacher" des données réelles — le masquage est serveur
- **Pas** de tableau pour les leads (D-17 verrouillé)
- **Pas** de gradient AI violet/rose (anti-pattern design system)
- **Pas** de `color` comme seul indicateur de statut → toujours icône + texte + couleur

---

## Checklist pré-implémentation

- [ ] Plus Jakarta Sans importé dans `nuxt.config.ts` via `@nuxtjs/google-fonts`
- [ ] Tokens Tailwind (amber-500, emerald-50, sky-700, slate-900) disponibles sans config custom
- [ ] shadcn-vue : `Card`, `CardHeader`, `CardContent`, `Badge`, `Button` installés
- [ ] Lucide-vue : `LockKeyholeIcon`, `UnlockIcon`, `ClockIcon`, `StarIcon`, `PhoneIcon`, `MailIcon` importés
- [ ] `blur-[2px]` : classe Tailwind arbitraire (disponible par défaut avec JIT)
- [ ] `cursor-pointer` sur tous les éléments interactifs
- [ ] Transitions 150-200ms sur boutons et cards hover
- [ ] Focus rings sur tous les éléments interactifs
- [ ] `aria-hidden="true"` sur les champs masqués

---

*Phase: 04-le-verrou-stripe-billing*
*UI-SPEC generated: 2026-06-05 via ui-ux-pro-max skill*
