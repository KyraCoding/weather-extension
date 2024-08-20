function setBackground(inp) {
    var videoSrc = document.getElementById("backgroundVideoSource")
    var video = document.getElementById("backgroundVideo")
    videoSrc.src = `assets/backgrounds/${inp}`
    video.load();
    video.play();
    video.classList.add("animate-fadein")
}
function codeToBackground(code) {
    if ([0, 1, 2].includes(code)) {
        // Clear
        setBackground("sunny.mp4")
        return "Sunny"
    } else if ([3].includes(code)) {
        // Cloudy
        setBackground("cloudy.mp4")
        return "Cloudy"
    } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) {
        // Rainy
        setBackground("rainy.mp4")
        return "Raining"
    } else if ([80, 81, 82, 95, 96, 99].includes(code)) {
        // Thunderstorms
        setBackground("thunder.mp4")
        return "Thundering"
    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        // Snowing
        setBackground("snowing.mp4")
        return "Snowing"
    } else if ([45, 48].includes(code)) {
        // Foggy
        setBackground("foggy.mp4")
        return "Foggy"
    } else {
        console.warn(`Undefined code: ${code}`)
    }
}
async function getWeather(coords) {
    // ${coords.latitude}&longitude=${coords.longitude}
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`)
    const data = await response.json()
    console.log(data)

    var currentWeather = codeToBackground(data.current.weather_code)
    document.getElementById("currentWeather").innerHTML = currentWeather
    document.getElementById("currentTemp").innerHTML = Math.round(data.current.temperature_2m)
    document.getElementById("currentHigh").innerHTML = `H:${Math.round(data.daily.temperature_2m_max[0])}`
    document.getElementById("currentLow").innerHTML = `L:${Math.round(data.daily.temperature_2m_min[0])}`
}
navigator.geolocation.getCurrentPosition(function (position) {
    const coords = position.coords
    getWeather(coords)
}, function (err) {
    console.log(`Geolocation failed with error ${err}`)
})