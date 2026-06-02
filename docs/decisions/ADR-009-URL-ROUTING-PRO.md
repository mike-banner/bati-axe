# ADR-009 : Routage URL Profils Professionnels — Hybride Slug + ID

- **Date** : 2026-06-02
- **Statut** : Accepted
- **Auteurs** : @mike

## Contexte
BÂTI-AXE publie des pages profils pour chaque artisan vérifié. L'URL doit servir deux objectifs contradictoires :
1. **SEO local** : Google doit lire le métier et la ville dans l'URL pour le ranking.
2. **Stabilité technique** : le changement de nom/raison sociale du pro ne doit pas casser les URLs existantes.

La base prospect contient ~7 000 entrées qui devront à terme avoir un slug. Les collisions de noms sont inévitables.

## Décision
Adoption du pattern **hybride slug + short ID** (standard Leboncoin, PagesJaunes, Indeed) :

```
/pro/{dept}/{metier}-{ville}-{nom}-{short_id}
```

Exemple : `/pro/78/macon-carrieres-sous-poissy-jean-dupont-V1StGXR8`

### Règles de résolution
1. Le routeur Nuxt 3 extrait le `short_id` (derniers 8 caractères après le dernier `-`).
2. La résolution en DB se fait **uniquement sur `short_id`** (index unique), jamais sur le slug.
3. Si le slug dans l'URL ne correspond pas au `canonical_slug` en DB → **redirect 301** vers l'URL canonique.
4. L'ID `short_id` est généré via `nanoid(8)` (URL-safe, non séquentiel, non devinable).

### Colonnes ajoutées à `professionals`
- `short_id` (Text, Unique, NOT NULL) — généré à l'insertion, jamais modifié.
- `canonical_slug` (Text) — régénéré si le nom ou la ville change.

### Route Nuxt 3
```
pages/pro/[dept]/[slug].vue
```

## Conséquences
- **Positives** : SEO préservé, zéro collision, résistant aux changements de nom, anti-scraping léger (l'ID n'est pas séquentiel).
- **Négatives** : URLs plus longues. Le `short_id` n'est pas humainement mémorable.

## Alternatives rejetées
- **Slug pur** (`/pro/macon-poissy-jean-dupont`) : collisions inévitables, casse à chaque changement de nom.
- **ID pur** (`/pro/78/a3f7b2c1`) : SEO mort, aucun signal sémantique pour Google.
- **UUID dans l'URL** : trop long, laid, inutile pour 7 000 entrées.
