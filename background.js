// Global values
let creatingDocument = null;

// Run on extention reload/install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Installed!")
});
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'refresh') {
    console.log("Manual refresh initiated!")
    getWeather()
  }
})

async function createOffscreen() {
  console.log("running!")
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
    } else {
      creating = chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['GEOLOCATION'],
        justification: 'To get the user location',
      });
      await creating;
      creating = null;
      console.log("Offscreen docment added!")
    }
  }
}

async function getWeather() {
  const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=39.2673&longitude=-76.7983&hourly=temperature_2m,precipitation_probability")
  const data = await response.json()
  console.log(data)
  createOffscreen()
  createOffscreen()
}
