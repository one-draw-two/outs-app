// NOOP Service Worker - does nothing, just to unregister previous SWs (killswitch)

importScripts('./sw/helpers.js')

const DEBUG = true
const VERSION = self.location.search.match(/appVersion=([^&]+)/)?.[1] || 'NA'

setupSWLogger(VERSION, 'NOOP', DEBUG)

console.log('Service worker initializing')

self.addEventListener('install', (event) => {
  console.log('Service worker installed, skipping waiting')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service worker activated')
  event.waitUntil(
    clients.claim().then(() => {
      console.log('Clients claimed, reloading all clients')
      return self.clients.matchAll({ type: 'window' }).then((windowClients) => windowClients.forEach((windowClient) => windowClient.navigate(windowClient.url)))
    })
  )

  self.clients.matchAll().then((clients) => clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED', version: VERSION })))
})
