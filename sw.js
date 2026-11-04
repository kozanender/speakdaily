// SpeakDaily service worker: uygulamayı internetsiz açılabilir yapar.
const VERSION = "speakdaily-v3";
const SHELL = [
  "./",
  "./index.html",
  "./whisper-worker.js",
  "./content/sentences.json",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
];
// Bu adreslerden gelen dosyalar ilk kullanımda önbelleğe alınır (yazı tipleri, ses tanıma kütüphanesi).
const RUNTIME_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("speakdaily-") && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Model dosyalarını (huggingface.co) ses tanıma kütüphanesi kendisi önbelleğe alır.
  if (url.hostname.endsWith("huggingface.co") || url.hostname.endsWith("hf.co")) return;
  // Güncelleme denetimi her zaman sunucuya gider.
  if (url.pathname.endsWith("/content/meta.json")) return;

  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin || RUNTIME_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        });
        return hit || net;
      })
    );
  }
});
