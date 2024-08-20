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
function codeToBackground(code) {
    if ([0,1,2].includes(code)) {
        // Clear
    } else if ([3].includes(code)) {
        // Cloudy
        
    } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) {
        // Rainy

    } else if ([80, 81, 82, 95, 96, 99].includes(code)) {
        // Thunderstorms

    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        // Snowing

    } else if ([45, 48].includes(code)) {
        // Foggy
    } else {
        console.warn(`Undefined code: ${code}`)
    }
}
setBackground()
navigator.geolocation.getCurrentPosition(function (position) {
    const coords = position.coords
    getWeather(coords)
}, function (err) {
    console.log(`Geolocation failed with error ${err}`)
})