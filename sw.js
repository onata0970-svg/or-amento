const CACHE_NAME = 'campo-pro-auto-v1';

// Arquivos leves de suporte offline (bibliotecas externas)
const urlsToCache = [
  './',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Instala o Service Worker e cacheia apenas as bibliotecas estáticas
self.addEventListener('install', event => {
  self.skipWaiting(); // Força o SW a assumir o controle imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativa e limpa caches antigos automaticamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle das abas abertas na hora
  );
});

// Estratégia "Network First" para o index.html e arquivos locais:
// Tenta buscar a versão mais nova na web. Se estiver sem internet, usa o cache.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se encontrou na rede, atualiza o cache silenciosamente e retorna
        return response;
      })
      .catch(() => {
        // Se estiver sem internet (offline), busca no cache local do celular
        return caches.match(event.request);
      })
  );
});
