// Alterar a versão (v2, v3...) obriga o celular dos usuários a baixar as atualizações do HTML
const CACHE_NAME = 'campo-pro-v4';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Cache das bibliotecas que geram o PDF e os Ícones
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Instala o App e salva os arquivos no celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos em cache offline salvos com sucesso.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Faz o celular abrir a versão offline se a internet cair
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna rápido do cache local
        }
        return fetch(event.request); // Tenta buscar da internet se não tiver no cache
      })
  );
});

// Remove versões velhas quando você atualiza o código
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
