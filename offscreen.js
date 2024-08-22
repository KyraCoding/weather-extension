chrome.runtime.onMessage.addListener(handleMessages);
function handleMessages(message, sender, sendResponse) {
  if (message.target !== 'offscreen') {
    return;
  }
  if (message.type !== 'get-geolocation') {
    console.warn(`Unexpected message type received: '${message.type}'.`);
    return;
  }

  getLocation().then((loc) => sendResponse(loc));

  return true;
}
function clone(obj) {
  const copy = {};
  if (obj === null || !(obj instanceof Object)) {
    return obj;
  } else {
    for (const p in obj) {
      copy[p] = clone(obj[p]);
    }
  }
  return copy;
}
async function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (loc) => resolve(clone(loc)),
      (err) => reject(err)
    );
  });
}