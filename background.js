// Run on extention reload/install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Installed!")
});
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'refresh') {
    console.log("Manual refresh initiated!")
    getWeather(event.data.data)
  }
})

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

async function test() {
  const location = await getGeolocation()
  console.log(location)
}
// testing for attempted offscreen document duplication 
test()
test()