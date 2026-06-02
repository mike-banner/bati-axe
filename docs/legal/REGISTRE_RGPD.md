# Registre des Traitements (RGPD) - BÂTI-AXE

Registre tenu en conformité avec l'Article 30 du Règlement Général sur la Protection des Données (RGPD).

---

## 1. Fiche du Traitement : Gestion de la mise en relation et conformité des prestataires

### A. Responsable de Traitement
- **Organisme** : BÂTI-AXE SAS
- **Représentant légal** : Mike Banner, Président
- **Contact RGPD** : rgpd@bati-axe.fr

### B. Catégories de Personnes Concernées
- Professionnels du bâtiment (prestataires).
- Porteurs de projets de travaux (clients).

### C. Données Personnelles Traitées
- **Professionnels** : Nom, prénom, e-mail, téléphone, Siret, Kbis (contenant données d'identité des dirigeants), décennales (assurance).
- **Clients** : Nom, prénom, e-mail, téléphone, adresse du chantier, description du projet.

### D. Finalités du Traitement
1. Mise en relation commerciale entre les prestataires et les clients.
2. Vérification de l'existence juridique et des assurances décennales obligatoires des prestataires (Obligation de vigilance légale).
3. Facturation des commissions et prestations.

### E. Durée de Conservation
- **Données de compte et documents légaux** : 5 ans après la fermeture du compte (prescription légale de responsabilité civile).
- **Factures** : 10 ans (obligation légale comptable).
- **Prospects non actifs** : 3 ans max après le dernier contact.

### F. Destinataires des Données
- Personnel autorisé de BÂTI-AXE SAS (service conformité, service technique).
- Prestataires partenaires (uniquement pour les coordonnées du client après mise en relation valide).
- Hébergeur Cloud (Cloudflare Pages, Supabase DB).

### G. Mesures de Sécurité
- Chiffrement en transit (HTTPS / TLS 1.3).
- Base de données chiffrée au repos.
- Floutage des numéros de téléphone et adresses côté serveur Nitro (`/api/v1/leads/*`) tant que le verrou n'est pas débloqué par le professionnel.
- Stockage sécurisé des décennales sur Cloudflare R2 avec des URLs pré-signées de courte durée.
