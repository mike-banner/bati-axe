<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
    <!-- Header -->
    <header class="border-b border-border py-4 px-6">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight text-primary">
          BÂTI-AXE
        </NuxtLink>
        <nav class="flex items-center space-x-6 text-sm font-medium">
          <NuxtLink to="/legal/mentions-legales" class="hover:underline text-muted-foreground hover:text-foreground transition-colors">
            Mentions Légales
          </NuxtLink>
          <NuxtLink to="/legal/confidentialite" class="hover:underline text-muted-foreground hover:text-foreground transition-colors">
            Confidentialité
          </NuxtLink>
          <NuxtLink to="/legal/cgu" class="hover:underline text-muted-foreground hover:text-foreground transition-colors">
            CGU
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground">
      <div class="max-w-6xl mx-auto">
        <p>&copy; {{ new Date().getFullYear() }} BÂTI-AXE. Tous droits réservés. Conforme RGPD.</p>
      </div>
    </footer>
  </div>
</template>
