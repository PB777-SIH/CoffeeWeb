const CACHE_NAME = 'coffee-web-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/img/logo.png',
  '/img/bg.png',
  '/img/main.png',
  '/img/about.jpg',
  '/img/p1.png',
  '/img/p2.png',
  '/img/p3.png',
  '/img/p4.png',
  '/img/p5.png',
  '/img/p6.png',
  '/img/rev1.jpg',
  '/img/rev2.jpg',
  '/img/rev3.jpg',
  '/img/footer-bg.jpg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap',
  'https://unpkg.com/boxicons@latest/css/boxicons.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background Sync for offline cart functionality
self.addEventListener('sync', function(event) {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  }
});

function syncCart() {
  // Sync cart data when online
  return new Promise((resolve) => {
    console.log('Syncing cart data...');
    resolve();
  });
}

// Push notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New coffee deals available!',
    icon: '/img/logo.png',
    badge: '/img/logo.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Deals',
        icon: '/img/logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/img/logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Premium Coffee Co.', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});