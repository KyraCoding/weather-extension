// Global values
let creatingDocument = false;

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
  if (creatingDocument) {
    console.log("Nice race condition, too bad I have locks");
    return;
  }
  creatingDocument = true
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL("offscreen.html")]
  })
  // Can't create more than one!
  if (existingContexts.length > 0) {
    console.log("Offscreen docment already exists!")
    return;
  } else {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['GEOLOCATION'],
      justification: 'To get the user location',
    });
    creatingDocument = false;
    console.log("Offscreen docment added!")
  }
}

async function getWeather() {
  const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=39.2673&longitude=-76.7983&hourly=temperature_2m,precipitation_probability")
  const data = await response.json()
  console.log(data)
  createOffscreen()
  createOffscreen()
}
