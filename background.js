// Background updates
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Installed!")
  chrome.alarms.create('backgroundUpdates', { periodInMinutes: 15 });
});
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "backgroundUpdates") {
    cacheRequest()
  }
});

// Manage service worker geolocation for background fetching 
let creating;
async function getGeolocation() {
  await setupOffscreenDocument("/offscreen.html");
  const geolocation = await chrome.runtime.sendMessage({
    type: 'get-geolocation',
    target: 'offscreen'
  });
  await closeOffscreenDocument();
  return geolocation;
}
async function hasDocument() {
  const offscreenUrl = chrome.runtime.getURL("/offscreen.html");
  const matchedClients = await clients.matchAll();

  return matchedClients.some(c => c.url === offscreenUrl)
}
async function setupOffscreenDocument(path) {
  if (!(await hasDocument())) {
    if (creating) {
      await creating;
    } else {
      creating = chrome.offscreen.createDocument({
        url: path,
        reasons: [chrome.offscreen.Reason.GEOLOCATION || chrome.offscreen.Reason.DOM_SCRAPING],
        justification: 'add justification for geolocation use here',
      });

      await creating;
      creating = null;
    }
  }
}
async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

// Cache background requests
async function cacheRequest() {
  const newCache = await caches.open('weatherRequests');
  const location = await getGeolocation()
  newCache.add(`https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,is_day,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&timezone=auto`)
}
cacheRequest()