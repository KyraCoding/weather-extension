// Background updates
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Installed!")
  chrome.alarms.create('backgroundUpdates', { periodInMinutes: 15 });
});
let creatingDocument = null
async function createOffscreen() {
  const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] })
  // Can't create more than one!
  if (existingContexts.length > 0) {
    return;
  } else {
    // Already being created
    if (creatingDocument) {
      await creatingDocument;
    } else {
      creatingDocument = chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['GEOLOCATION'],
        justification: 'To get the user location',
      });
      await creatingDocument;
      creatingDocument = null;
    }
  }
}
async function closeOffscreen() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}
async function hasDocument() {
  const offscreenUrl = chrome.runtime.getURL("/offscreen.html");
  const matchedClients = await clients.matchAll();

  return matchedClients.some(c => c.url === offscreenUrl)
}
async function getGeolocation() {
  await createOffscreen()
  const geolocation = await chrome.runtime.sendMessage({
    type: 'get-geolocation',
    target: 'offscreen'
  });
  await closeOffscreen()
  return geolocation
}
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "backgroundUpdates") {
    cacheRequest()
  }
});
async function cacheRequest() {
  const location = await getGeolocation()
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,is_day,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&timezone=auto`)
  const data = await response.json()
  await chrome.storage.local.set({ "weatherData": data })
}
cacheRequest()