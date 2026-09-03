// Lembrete diário (Iteração F): notificação local via Periodic Background Sync
// (Chromium/Android, PWA instalada). Sem servidores — tudo no telemóvel.
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'treino-diario') {
    event.waitUntil(
      self.registration.showNotification('⚽ Treino do Nicolas', {
        body: 'O teu Treino de Hoje está pronto — 5 exercícios à tua espera. Bora! 🔥',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'treino-diario',
      }),
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const open = clients.find((c) => 'focus' in c)
      return open ? open.focus() : self.clients.openWindow('/')
    }),
  )
})
