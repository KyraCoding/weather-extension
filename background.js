// Run on extention reload/install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Installed!")
});

async function getWeather() {
  const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=39.2673&longitude=-76.7983&hourly=temperature_2m,precipitation_probability")
  const data = await response.json()
  console.log(data)
}

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'refresh') {
    console.log("Manual refresh initiated!")
    getWeather()
    const location = await getGeolocation()
    console.log(location)
  }
})
chrome.offscreen.createDocument({
  url: 'offscreen.html',
  reasons: [chrome.offscreen.Reason.GEOLOCATION || chrome.offscreen.Reason.DOM_SCRAPING],
  justification: 'geolocation access',
});
const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
let creating; // A global promise to avoid concurrency issues

chrome.runtime.onMessage.addListener(handleMessages);

async function getGeolocation() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
  const geolocation = await chrome.runtime.sendMessage({
    type: 'get-geolocation',
    target: 'offscreen'
  });
  await closeOffscreenDocument();
  return geolocation;
}

async function hasDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  const matchedClients = await clients.matchAll();

  return matchedClients.some(c => c.url === offscreenUrl)
}

async function setupOffscreenDocument(path) {
  //if we do not have a document, we are already setup and can skip
  if (!(await hasDocument())) {
    // create offscreen document
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
