// Bump this when app files change so installed copies drop the old cache.
const CACHE_NAME = "id-cert-generator-v4";
const APP_FILES = [
  "./",
  "index.html",
  "style.css?v=14",
  "manifest.webmanifest",
  "fmg logo.png",
  "backlogo.png",
  "qr.png",
  "authorized-signature.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
];
const CDN_FILES = [
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_FILES);
      // CDN scripts are optional at install time; they are cached on first use too.
      await Promise.allSettled(
        CDN_FILES.map((url) =>
          fetch(url, { mode: "no-cors" }).then((response) => cache.put(url, response)),
        ),
      );
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || request.url.startsWith("blob:")) return;
  const isAppFile = new URL(request.url).origin === self.location.origin;

  if (isAppFile) {
    // Network first so edits show up right away; the cache is the offline fallback.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request, { ignoreSearch: request.mode === "navigate" })
            .then(
              (cached) =>
                cached ||
                (request.mode === "navigate"
                  ? caches.match("index.html")
                  : Response.error()),
            ),
        ),
    );
    return;
  }

  // Fonts and PDF libraries: cache first, since versioned CDN files never change.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok || response.type === "opaque") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
