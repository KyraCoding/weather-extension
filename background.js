// Run on extention reload/install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Installed!")
});

async function getWeather() {
  const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=39.2673&longitude=-76.7983&hourly=temperature_2m,precipitation_probability")
  const data = response.json()
  console.log(data)
}

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'refresh') {
    console.log("Manual refresh initiated!")
    getWeather()
  }
})