importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-window.prod.mjs');

const OFFLINE_HTML = './offline.html';
const PRECACHE = [
    { url: OFFLINE_HTML, revision: '70f044fda3e9647a98f084763ae2c32a' },
    { url: './?ts=10' },
    { url: './index.html?ts=10' },
    { url: './index.js?ts=10' },
    { url: './style.css?ts=10' },
    { url: './images/fox1.jpg?ts=10' },
    { url: './images/fox2.jpg?ts=10' },
    { url: './images/fox3.jpg?ts=10' },
    { url: './images/fox4.jpg?ts=10' },
    { url: './images/fox5.jpg?ts=10' },
];

/**
 * Precache Manifest for resources available offline.
 * https://developers.google.com/web/tools/workbox/modules/workbox-precaching#explanation_of_the_precache_list
 */
//workbox.precaching.precacheAndRoute(PRECACHE);
workbox.precaching.precacheAndRoute([self.__WB_MANIFEST, PRECACHE].join() || []);

/**
 * Enable navigation preload.
 */
workbox.navigationPreload.enable();

/**
 * Runtime caching for CSS and JS coming from only from the origin
 * https://developers.google.com/web/tools/workbox/modules/workbox-strategies#advanced_usage
 */
/* workbox.routing.registerRoute(
  ({ sameOrigin, url }) => sameOrigin && url.pathname.match(/\.(?:js|css)/),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'origin-js-css'
  })
); */

/**
 * Google Fonts caching
 * Learn more: https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts
 */
/**
 * Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
 */
workbox.routing.registerRoute(
    /https:\/\/fonts\.googleapis\.com\/*/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google_fonts_stylesheets'
    }),
    'GET'
);
/**
 * Cache the underlying font files with a cache-first strategy for 1 year.
 */
workbox.routing.registerRoute(
    /https:\/\/fonts\.gstatic\.com\/*/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google_fonts_webfonts',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                maxEntries: 30
            })
        ]
    }),
    'GET'
);

/**
 * Basic caching for images.
 */
workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                // Only cache 80 images.
                maxEntries: 80,
                purgeOnQuotaError: true
            })
        ]
    })
);

/*
 * Fallback to offline HTML page when a navigation request fails.
 */
const htmlHandler = new workbox.strategies.NetworkOnly();
// A NavigationRoute matches navigation requests in the browser, i.e. requests for HTML.
const navigationRoute = new workbox.routing.NavigationRoute(({ event }) => {
    const request = event.request;
    return htmlHandler.handle({ event, request }).catch(() => caches.match(OFFLINE_HTML, {
        ignoreSearch: true
    }));
});
workbox.routing.registerRoute(navigationRoute);
