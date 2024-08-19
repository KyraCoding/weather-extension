function setBackground(inp) {
    var videos = ["sunny.mp4","thunder.mp4","rainy.mp4","cloudy.mp4"]
    var video = document.getElementById("backgroundVideo")
    video.src = `assets/backgrounds/${inp ?? videos[Math.floor(Math.random()*videos.length)]}`
    console.log("Setting: "+video.src)
}
setBackground()