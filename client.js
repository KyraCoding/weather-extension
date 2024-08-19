function setBackground(inp) {
    var videos = ["sunny.mp4", "thunder.mp4", "rainy.mp4", "cloudy.mp4"]
    var video = document.getElementById("backgroundVideo")
    video.src = `assets/backgrounds/${inp ?? videos[Math.floor(Math.random() * videos.length)]}`
}
async function getWeather(coords) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&hourly=temperature_2m,precipitation_probability`)
    const data = await response.json()
    console.log(data)
}
setBackground()
navigator.geolocation.getCurrentPosition(function(position) {
    const coords = position.coords
    getWeather(coords)
}, function(err) {
    console.log(`Geolocation failed with error ${err}`)
})