// ═══════════════════════════════════════════════════
// AGROTERRA · Service Worker + Firebase Cloud Messaging
// Archivo: sw.js  (debe estar en la raíz del repo)
// ═══════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyD3S2mFpOd75uuWzilWymFVWruFXTzZaGI",
  authDomain:        "agroterra-1e3c3.firebaseapp.com",
  projectId:         "agroterra-1e3c3",
  storageBucket:     "agroterra-1e3c3.firebasestorage.app",
  messagingSenderId: "289898339048",
  appId:             "1:289898339048:web:4a4582fe673cd5f3d4075d"
});

const messaging = firebase.messaging();

// Manejar notificaciones cuando la app está en background o cerrada
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Agroterra', {
    body:  body  || 'Tenés una notificación pendiente.',
    icon:  icon  || '/icon_tecnico.png',
    badge: '/icon_tecnico.png',
    tag:   'agroterra-reminder',
    renotify: true,
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Abrir app' }
    ]
  });
});

// Al hacer clic en la notificación — abrir la app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
        for (const client of list) {
          if (client.url.includes('agroterra') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('https://josemariavillalba2-dotcom.github.io/agroterra/agroterra_tecnico.html');
      })
    );
  }
});
