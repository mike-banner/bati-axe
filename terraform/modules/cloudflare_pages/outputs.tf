# modules/cloudflare_pages/outputs.tf
# Expose les attributs calculés par Cloudflare après création du projet.
# Ces valeurs sont consommées par outputs.tf du module racine.

output "project_url" {
  description = "URL *.pages.dev générée automatiquement par Cloudflare"
  value       = "https://${cloudflare_pages_project.this.name}.pages.dev"
}

output "custom_domain" {
  description = "Domaine personnalisé attaché au projet (vide si non configuré)"
  value       = var.custom_domain != "" ? var.custom_domain : ""
}
