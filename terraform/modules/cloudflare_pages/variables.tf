# modules/cloudflare_pages/variables.tf
# Variables d'entrée du module. Le module est conçu pour être appelé
# une fois par workspace (dev / staging / production), le nom du projet
# étant suffixé par l'environnement depuis le module racine.

variable "account_id" {
  description = "ID du compte Cloudflare"
  type        = string
}

variable "project_name" {
  description = "Nom complet du projet Pages (ex: bati-axe-dev)"
  type        = string
}

variable "github_owner" {
  description = "Organisation ou utilisateur GitHub propriétaire du dépôt"
  type        = string
}

variable "github_repo_name" {
  description = "Nom du dépôt GitHub source"
  type        = string
}

variable "production_branch" {
  description = "Branche Git déclenchant les déploiements de production"
  type        = string
  default     = "main"
}

variable "custom_domain" {
  description = "Domaine personnalisé à attacher au projet Pages (optionnel)"
  type        = string
  default     = ""
}

variable "env_vars" {
  description = "Variables d'environnement injectées dans les déploiements Pages (toutes traitées comme secrets)"
  type        = map(string)
  sensitive   = true
  default     = {}
}
