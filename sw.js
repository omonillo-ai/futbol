// sw.js — «помощник» приложения (service worker).
// Он сохраняет файлы сайта в телефоне, чтобы приложение открывалось даже без интернета.

const KESH = "futbol-mz-v1";   // имя «коробки» с сохранёнными файлами

// список файлов, которые нужно сохранить
const FAYLY = [
  "./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./yashin.png", "./neuer.png", "./buffon.png", "./beckenbauer.png",
  "./maldini.jpg", "./baresi.jpg", "./zidane.jpg", "./iniesta.jpg",
  "./xavi.jpg", "./pele.jpg", "./ronaldo.jpg", "./cruyff.jpg"
];

// 1) при установке — кладём файлы в коробку
self.addEventListener("install", function (sobytie) {
  sobytie.waitUntil(caches.open(KESH).then(function (k) { return k.addAll(FAYLY); }));
  self.skipWaiting();
});

// 2) при обновлении — удаляем старые коробки
self.addEventListener("activate", function (sobytie) {
  sobytie.waitUntil(caches.keys().then(function (imena) {
    return Promise.all(imena.filter(function (i) { return i !== KESH; })
                            .map(function (i) { return caches.delete(i); }));
  }));
  self.clients.claim();
});

// 3) когда сайт что-то просит — сначала пробуем интернет, если его нет — берём из коробки
self.addEventListener("fetch", function (sobytie) {
  sobytie.respondWith(
    fetch(sobytie.request).catch(function () { return caches.match(sobytie.request); })
  );
});
