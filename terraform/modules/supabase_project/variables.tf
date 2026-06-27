# modules/supabase_project/variables.tf
# Variables d'entrée du module. Un projet Supabase est créé par workspace
# (dev / staging / production). Le nom est suffixé par l'environnement
# depuis le module racine pour éviter les collisions dans le dashboard.

variable "project_name" {
  description = "Nom complet du projet Supabase (ex: bati-axe-dev)"
  type        = string
}

variable "organization_id" {
  description = "ID de l'organisation Supabase cible"
  type        = string
}

variable "database_password" {
  description = "Mot de passe administrateur PostgreSQL du projet"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "Région Supabase du projet (ex: eu-west-3 pour Paris)"
  type        = string
  default     = "eu-west-3"
}
