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

let creatingDocument = null

async function createOffscreen() {
  const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] })
  console.log(chrome.runtime.getURL("/offscreen.html"))
  console.log(existingContexts)
  // Can't create more than one!
  if (existingContexts.length > 0) {
    console.log("Offscreen docment already exists!")
    return;
  } else {
    // Already being created
    if (creatingDocument) {
      console.log("Offscreen docment already being created!")
      await creatingDocument;
      createOffscreen()
    } else {
      creatingDocument = chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['GEOLOCATION'],
        justification: 'To get the user location',
      });
      await creatingDocument;
      console.log(await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] }))
      creatingDocument = null;
      console.log("Offscreen docment added!")
    }
  }
}
async function getGeolocation() {
  await createOffscreen()
  const geolocation = await chrome.runtime.sendMessage({
    type: 'get-geolocation',
    target: 'offscreen'
  });
  const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] })
  if (existingContexts.length > 0) {
    await chrome.offscreen.closeDocument();
  }
  return geolocation
}

async function cacheRequest() {
  const location = await getGeolocation()
  console.log(location.coords)
}
cacheRequest()
