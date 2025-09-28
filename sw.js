// Service Worker для Flappy Bird Enhanced
const CACHE_NAME = 'flappy-bird-v1.0.0';
const STATIC_CACHE = 'flappy-bird-static-v1';
const DYNAMIC_CACHE = 'flappy-bird-dynamic-v1';

// Файлы для кеширования
const STATIC_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/main.js',
  '/js/game.js',
  '/js/bird.js',
  '/js/pipes.js',
  '/js/powerups.js',
  '/js/achievements.js',
  '/js/ui.js',
  '/manifest.json'
];

// Файлы, которые должны быть всегда свежими
const NETWORK_FIRST = [
  '/api/',
  '/analytics/'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('SW: Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('SW: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW: Error caching static files:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('SW: Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Удаляем старые кеши
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Берем контроль над всеми клиентами
      self.clients.claim()
    ])
  );
});

// Обработка запросов
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Игнорируем non-GET запросы
  if (request.method !== 'GET') {
    return;
  }
  
  // Игнорируем chrome-extension запросы
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Стратегия Cache First для статических файлов
  if (isStaticFile(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Стратегия Network First для API запросов
  if (isNetworkFirst(request.url)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Стратегия Stale While Revalidate для остальных файлов
  event.respondWith(staleWhileRevalidate(request));
});

// Проверка, является ли файл статическим
function isStaticFile(url) {
  return STATIC_FILES.some(file => url.includes(file)) || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.ico');
}

// Проверка, требует ли URL стратегию Network First
function isNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

// Стратегия Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Кешируем успешные ответы
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('SW: Cache First failed:', error);
    
    // Возвращаем офлайн страницу для HTML запросов
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html') || createOfflineResponse();
    }
    
    throw error;
  }
}

// Стратегия Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Кешируем успешные ответы
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Стратегия Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Фоновое обновление кеша
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('SW: Network failed for:', request.url);
  });
  
  // Возвращаем кешированную версию или ждем сетевой ответ
  return cachedResponse || fetchPromise;
}

// Создание офлайн ответа
function createOfflineResponse() {
  const offlineHtml = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flappy Bird - Офлайн</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #70c5ce 0%, #4a9eff 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                color: white;
                text-align: center;
            }
            .offline-container {
                background: rgba(0, 0, 0, 0.3);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            .offline-bird {
                font-size: 4rem;
                margin-bottom: 20px;
                animation: float 2s ease-in-out infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            .retry-btn {
                background: #FFD700;
                color: #333;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            .retry-btn:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-bird">🐦</div>
            <h1>Вы офлайн</h1>
            <p>Проверьте подключение к интернету</p>
            <p>Игра работает и в офлайн режиме!</p>
            <button class="retry-btn" onclick="location.reload()">Попробовать снова</button>
        </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHtml, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Обработка сообщений от клиента
self.addEventListener('message', event => {
  console.log('SW: Received message:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_ANALYTICS':
      cacheAnalyticsData(event.data.data);
      break;
  }
});

// Очистка всех кешей
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Кеширование аналитических данных
async function cacheAnalyticsData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put('/analytics/cached-data', response);
    console.log('SW: Analytics data cached');
  } catch (error) {
    console.error('SW: Error caching analytics:', error);
  }
}

// Фоновая синхронизация
self.addEventListener('sync', event => {
  console.log('SW: Background sync:', event.tag);
  
  switch (event.tag) {
    case 'background-sync-analytics':
      event.waitUntil(syncAnalytics());
      break;
      
    case 'background-sync-scores':
      event.waitUntil(syncScores());
      break;
  }
});

// Синхронизация аналитики
async function syncAnalytics() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match('/analytics/cached-data');
    
    if (cachedResponse) {
      const data = await cachedResponse.json();
      
      // Здесь была бы отправка данных на сервер
      console.log('SW: Syncing analytics data:', data);
      
      // Удаляем из кеша после успешной отправки
      await cache.delete('/analytics/cached-data');
    }
  } catch (error) {
    console.error('SW: Error syncing analytics:', error);
  }
}

// Синхронизация счетов
async function syncScores() {
  try {
    // Получаем сохраненные счета из localStorage через postMessage
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_SCORES'
      });
    });
  } catch (error) {
    console.error('SW: Error syncing scores:', error);
  }
}

// Push уведомления
self.addEventListener('push', event => {
  console.log('SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Время поиграть в Flappy Bird!',
    icon: '/assets/icon-192.png',
    badge: '/assets/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'play',
        title: 'Играть',
        icon: '/assets/action-play.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/assets/action-close.png'
      }
    ],
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification('Flappy Bird Enhanced', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'play') {
    event.waitUntil(
      clients.openWindow('/?action=play')
    );
  } else if (event.action === 'close') {
    // Просто закрываем уведомление
    return;
  } else {
    // Клик по самому уведомлению
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Обработка закрытия уведомлений
self.addEventListener('notificationclose', event => {
  console.log('SW: Notification closed:', event.notification.tag);
  
  // Аналитика закрытия уведомлений
  // В реальном приложении здесь была бы отправка данных
});

// Периодическая фоновая синхронизация (если поддерживается)
self.addEventListener('periodicsync', event => {
  console.log('SW: Periodic sync:', event.tag);
  
  if (event.tag === 'daily-sync') {
    event.waitUntil(performDailySync());
  }
});

// Ежедневная синхронизация
async function performDailySync() {
  try {
    // Очистка старых кешей
    await cleanupOldCaches();
    
    // Предварительная загрузка новых ресурсов
    await preloadResources();
    
    console.log('SW: Daily sync completed');
  } catch (error) {
    console.error('SW: Daily sync failed:', error);
  }
}

// Очистка старых кешей
async function cleanupOldCaches() {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  // Эмуляция очистки старых данных
  console.log('SW: Cleaning up old caches');
}

// Предварительная загрузка ресурсов
async function preloadResources() {
  const resourcesToPreload = [
    '/assets/icon-192.png',
    '/assets/icon-512.png'
  ];
  
  const cache = await caches.open(STATIC_CACHE);
  
  for (const resource of resourcesToPreload) {
    try {
      const response = await fetch(resource);
      if (response.ok) {
        await cache.put(resource, response);
      }
    } catch (error) {
      console.log('SW: Failed to preload:', resource);
    }
  }
}

console.log('SW: Service Worker loaded and ready!');
