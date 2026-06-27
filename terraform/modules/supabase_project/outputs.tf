# modules/supabase_project/outputs.tf
# Expose les attributs calculés du projet Supabase après création.
# database_url est sensible (contient le mot de passe) — Terraform le masquera
# dans les logs et le marquera [sensitive] dans le plan.

output "database_url" {
  description = "URL de connexion PostgreSQL directe (contient le mot de passe)"
  # Format standard Supabase : postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
  value     = "postgresql://postgres:${urlencode(var.database_password)}@db.${supabase_project.this.id}.supabase.co:5432/postgres"
  sensitive = true
}

output "api_url" {
  description = "URL de l'API REST Supabase du projet (NEXT_PUBLIC_SUPABASE_URL)"
  value       = "https://${supabase_project.this.id}.supabase.co"
}

output "project_ref" {
  description = "Référence unique du projet Supabase (ex: abcdefghijklmnop)"
  value       = supabase_project.this.id
}
