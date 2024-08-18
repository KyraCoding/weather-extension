// Run on extention reload/install
chrome.runtime.onInstalled.addListener(async () => {
    console.log("Installed!")
  });