# SPEC.md : Phase 5 (Espace Client & Messagerie Asynchrone)

## Boundaries

**In Scope:**
- Génération d'un `access_token` unique par projet lors de sa soumission.
- Espace Client accessible via un Magic Link URL (`/mon-projet/[token]`).
- Messagerie asynchrone entre le Pro (qui a accès aux coordonnées) et le Particulier.
- Simulation d'envoi d'emails (via console.log en dev) contenant le Magic Link à chaque notification de message.
- Blocage de l'envoi de messages pour les Pros Basic qui n'ont pas débloqué le lead.

**Out of Scope:**
- Intégration SMS (Twilio, etc.). *Repoussé à une phase ultérieure par décision produit.*
- Authentification complexe (OTP, Supabase Auth pour le particulier). *Friction zéro exigée.*
- Messagerie Temps Réel (WebSockets). *La messagerie est asynchrone (HTTP classique).*
- Configuration d'un vrai provider email (Resend/Sendgrid). *Sera fait lors d'une passe d'intégration prod globale.*

## Falsifiable Requirements

### REQ-01: Token d'accès au projet
- **Current State:** Les projets n'ont pas de lien d'accès sécurisé pour le grand public.
- **Target State:** Lors du POST `/api/v1/projects`, un UUID aléatoire `access_token` est généré et stocké dans la table `projects`.
- **Acceptance Criteria:** 
  - [ ] La base de données contient une colonne `access_token` unique sur `projects`.
  - [ ] Un appel POST sur l'API de soumission d'un projet loggue dans la console le lien `/mon-projet/[token]`.

### REQ-02: Accès à l'Espace Client (Magic Link)
- **Current State:** L'URL `/mon-projet/[token]` n'existe pas.
- **Target State:** La visite de `/mon-projet/[token]` charge le détail du projet et l'historique des conversations. Une mauvaise URL renvoie une 404.
- **Acceptance Criteria:**
  - [ ] L'API backend `/api/v1/magic-link/[token]` retourne les infos du projet et les messages.
  - [ ] Une tentative avec un token inexistant renvoie une erreur 404 propre.

### REQ-03: Création de Message (Côté Pro)
- **Current State:** Pas de table `messages` ni de logique de discussion.
- **Target State:** L'UI de la page détaillée d'un lead (côté Pro) permet d'envoyer un message au particulier.
- **Acceptance Criteria:**
  - [ ] L'API `/api/v1/leads/[id]/messages` vérifie que le Pro a bien débloqué le lead (Premium ou free_grant) avant d'insérer le message en base.
  - [ ] La requête échoue (403 Forbidden) si le Pro n'a pas accès aux coordonnées complètes.
  - [ ] Un message inséré par un pro loggue *"MOCK EMAIL ENVOYÉ: Vous avez reçu un message. Répondez ici : /mon-projet/[token]"* dans la console serveur.

### REQ-04: Création de Message (Côté Client)
- **Current State:** Le client ne peut pas discuter avec les professionnels intéressés.
- **Target State:** L'Espace Client affiche un thread pour chaque artisan ayant pris contact. Le client peut y répondre.
- **Acceptance Criteria:**
  - [ ] L'API permet au client (authentifié uniquement via le payload/header de son `access_token`) de poster un message ciblant l'ID du professionnel.
  - [ ] L'insertion d'un message par le client loggue *"MOCK EMAIL ENVOYÉ: [Client] vous a répondu"* à destination du pro concerné.
