self.importScripts('/sw-toolbox.js');
self.importScripts('/sw-offline-google-analytics.js');

self.toolbox.precache(['/offline.html', '/network-error.svg', '/networkStatus-offline.svg']);

goog.offlineGoogleAnalytics.initialize();

self.addEventListener('install', event => {
	self.skipWaiting();
});

self.addEventListener('activate', event => {
	event.waitUntil(clients.claim());
});

self.toolbox.router.get('/', toolbox.cacheFirst, {
  cache: {
    name: 'toolbox-image',
    maxEntries: 250
  }
});

self.toolbox.router.get(/^https:\/\/ajax.googleapis.com\//, toolbox.cacheFirst, {
  cache: {
    name: 'toolbox-googleapis',
    maxEntries: 250
  }
});

self.toolbox.router.get(/^https:\/\/unpkg.com\//, toolbox.cacheFirst, {
  cache: {
    name: 'toolbox-unpkg',
    maxEntries: 30
  }
});

self.toolbox.router.get(/^https:\/\/cdnjs.cloudflare.com\//, toolbox.cacheFirst, {
  cache: {
    name: 'toolbox-cloudflare',
    maxEntries: 30
  }
});

self.toolbox.router.get('/(.*)', function(request, values, options) {
  return self.toolbox.networkFirst(request, values, options).catch(function(error) {
    if (request.method === 'GET' && request.headers.get('accept').includes('text/html')) {
      return toolbox.cacheOnly(new Request('/offline.html'), values, options);
    } else {
      console.log("service worker error")
    }
    throw error;
  });
});
