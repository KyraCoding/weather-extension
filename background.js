// Run on extention reload/install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Installed!")
});
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'refresh') {
    console.log("Manual refresh initiated!")
  }
})