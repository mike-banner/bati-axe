<template>
  <div class="max-w-6xl mx-auto px-6 py-20 text-center space-y-8">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
      <span>🚀 Phase 1 active : Foundations & Compliance</span>
    </div>
    
    <h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto">
      La plateforme de mise en relation <span class="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">bâtiment & travaux</span>
    </h1>
    
    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
      Mise en relation directe, conformité automatisée (Kbis et Décennale vérifiés), et protection des données personnelles garantie.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
      <NuxtLink 
        to="/legal/mentions-legales"
        class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Voir les Mentions Légales
      </NuxtLink>
      <NuxtLink 
        to="/legal/confidentialite"
        class="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Politique de Confidentialité
      </NuxtLink>
    </div>
  </div>
</template>
