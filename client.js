function setBackground(inp) {
    var videos = ["sunny.mp4","thunder.mp4","rainy.mp4","cloudy.mp4"]
    var video = document.getElementById("backgroundVideo")
    video.src = `assets/backgrounds/${inp ?? videos[Math.floor(Math.random()*videos.length)]}`
    console.log("Setting: "+video.src)
}
setBackground()
navigator.geolocation.getCurrentPosition(geoLocSuccess,geoLocFail)
function geoLocSuccess(position) {
    const coords = position.coords
    console.log(coords.latitude)
    console.log(coords.longitude)
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'refresh',
            data: coords
        });
    }
}
function geoLocFail(err) {
    console.log(`Geolocation failed with error ${err}`)
}