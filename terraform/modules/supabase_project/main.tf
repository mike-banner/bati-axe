# modules/supabase_project/main.tf
# Crée un projet Supabase (PostgreSQL managé + Auth + Storage + Edge Functions).
#
# Architecture du module :
#  - supabase_project : provisionne le projet dans l'organisation cible
#
# Ce module est appelé une fois par workspace (dev / staging / production)
# depuis le module racine. Le nom de projet est suffixé par l'environnement.

terraform {
  required_providers {
    supabase = {
      source = "supabase/supabase"
    }
  }
}

resource "supabase_project" "this" {
  name              = var.project_name
  organization_id   = var.organization_id
  database_password = var.database_password
  region            = var.region

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [region]
  }
}
