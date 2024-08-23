function setBackground(inp) {
    var videoSrc = document.getElementById("backgroundVideoSource")
    var video = document.getElementById("backgroundVideo")
    videoSrc.src = `assets/backgrounds/${inp}`
    video.load();
    video.play();
    video.classList.add("animate-fadein")
}
function formatHour(hour) {
    let period = hour >= 12 ? 'PM' : 'AM'
    var hour = hour % 12 || 12;
    return `${hour}${period.toLowerCase()}`;
}
function codeToBackground(code) {
    if ([0, 1, 2].includes(code)) {
        // Clear
        setBackground("sunny.mp4")
    } else if ([3].includes(code)) {
        // Cloudy
        setBackground("cloudy.mp4")
    } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) {
        // Rainy
        setBackground("rainy.mp4")
    } else if ([80, 81, 82, 95, 96, 99].includes(code)) {
        // Thunderstorms
        setBackground("thunder.mp4")
    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        // Snowing
        setBackground("snowing.mp4")
    } else if ([45, 48].includes(code)) {
        // Foggy
        setBackground("foggy.mp4")
    } else {
        console.warn(`Undefined code: ${code}`)
    }
}
function codeToDescription(code) {
    if ([0, 1].includes(code)) {
        return {
            title: "Clear",
            description: "Clear skies until ",
            dayIcon: "wi-day-sunny",
            nightIcon: "wi-night-clear"
        }
    } else if ([2].includes(code)) {
        return {
            title: "Partly Cloudy",
            description: "Partly cloudy until ",
            dayIcon: "wi-day-cloudy",
            nightIcon: "wi-night-alt-cloudy"
        }
    } else if ([3].includes(code)) {
        return {
            title: "Cloudy",
            description: "Cloudy until ",
            dayIcon: "wi-cloud",
            nightIcon: "wi-cloud"
        }
    } else if ([45, 48].includes(code)) {
        return {
            title: "Foggy",
            description: "Foggy until ",
            dayIcon: "wi-fog",
            nightIcon: "wi-fog"
        }
    } else if ([51, 53, 55].includes(code)) {
        return {
            title: "Light rain",
            description: "Light rain until ",
            dayIcon: "wi-sprinkle",
            nightIcon: "wi-sprinkle"
        }
    } else if ([56, 57].includes(code)) {
        return {
            title: "Freezing Drizzles",
            description: "Freezing drizzles until ",
            dayIcon: "wi-rain-mix",
            nightIcon: "wi-rain-mix"
        }
    } else if ([61, 63, 65].includes(code)) {
        return {
            title: "Rain",
            description: "Raining until ",
            dayIcon: "wi-rain",
            nightIcon: "wi-rain"
        }
    } else if ([66, 67].includes(code)) {
        return {
            title: "Freezing rain",
            description: "Freezing rain until ",
            dayIcon: "wi-rain-mix",
            nightIcon: "wi-rain-mix"
        }
    } else if ([71, 73, 75].includes(code)) {
        return {
            title: "Snow",
            description: "Snowing until ",
            dayIcon: "wi-snow",
            nightIcon: "wi-snow"
        }
    } else if ([77].includes(code)) {
        return {
            title: "Light Snowfall",
            description: "Light snowfall until ",
            dayIcon: "wi-snow",
            nightIcon: "wi-snow"
        }
    } else if ([80, 81, 82].includes(code)) {
        return {
            title: "Rain Showers",
            description: "Rain showers until ",
            dayIcon: "wi-showers",
            nightIcon: "wi-showers"
        }
    } else if ([85, 86].includes(code)) {
        return {
            title: "Heavy Snowfall",
            description: "Heavy snowfalls until ",
            dayIcon: "wi-snow-wind",
            nightIcon: "wi-snow-wind"
        }
    } else if ([95].includes(code)) {
        return {
            title: "Thunderstorms",
            description: "Thunderstorms until ",
            dayIcon: "wi-thunderstorm",
            nightIcon: "wi-thunderstorm"
        }
    } else if ([96, 99].includes(code)) {
        return {
            title: "Hailing Thunderstorms",
            description: "Hailing Thunderstorms until ",
            dayIcon: "wi-thunderstorm",
            nightIcon: "wi-thunderstorm"
        }
    }
}
function isSameHour(givenDateString) {
    const givenDate = new Date(givenDateString);
    const currentDate = new Date();
    const isSameYear = givenDate.getFullYear() === currentDate.getFullYear();
    const isSameMonth = givenDate.getMonth() === currentDate.getMonth();
    const isSameDay = givenDate.getDate() === currentDate.getDate();
    const isSameHour = givenDate.getHours() === currentDate.getHours();
    return isSameYear && isSameMonth && isSameDay && isSameHour;
}
async function getData(coords) {
    const cachedData = (await chrome.storage.local.get("weatherData")).weatherData
    if (!cachedData || !isSameHour(cachedData.current.time)) {
        console.log("Cached data not found!")
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,is_day,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&timezone=auto`)
        const data = await response.json()
        await chrome.storage.local.set({ "weatherData": data })
        return data
    } else {
        console.log("Using cached data!")
        return cachedData
    }
}
async function getWeather(coords) {
    // ${coords.latitude}&longitude=${coords.longitude}
    const cityName = (await (await fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`)).json()).locality
    const data = await getData(coords)
    console.log(data)
    console.log(cityName)

    codeToBackground(data.current.weather_code)
    document.getElementById("currentWeather").innerHTML = codeToDescription(data.current.weather_code).title
    document.getElementById("currentTemp").innerHTML = Math.round(data.current.temperature_2m)
    document.getElementById("tempType").innerHTML = data.current_units.temperature_2m[0]
    document.getElementById("currentHigh").innerHTML = `H:${Math.round(data.daily.temperature_2m_max[0])}${data.daily_units.temperature_2m_max[0]}`
    document.getElementById("currentLow").innerHTML = `L:${Math.round(data.daily.temperature_2m_min[0])}${data.daily_units.temperature_2m_min[0]}`
    document.getElementById("cityName").innerHTML = cityName
    // Hourly Weather
    const hourlyOffset = new Date(data.current.time).getHours();
    var currentCondition = codeToDescription(data.hourly.weather_code[hourlyOffset])
    for (let i = 0; i < 24; i++) {
        const time = data.hourly.time[i + hourlyOffset]
        const temp = data.hourly.temperature_2m[i + hourlyOffset]
        let wrapper = document.createElement("div");
        let wrapperTime = document.createElement("p");
        let wrapperIcon = document.createElement("i")
        let wrapperTempWrapper = document.createElement("div")
        let wrapperTemp = document.createElement("p")
        let wrapperTempSign = document.createElement("p")
        if (data.hourly.is_day[i + hourlyOffset]) {
            wrapperIcon.className = "flex py-2 justify-center wi " + codeToDescription(data.hourly.weather_code[hourlyOffset + i]).dayIcon
        } else {
            wrapperIcon.className = "flex py-2 justify-center wi " + codeToDescription(data.hourly.weather_code[hourlyOffset + i]).nightIcon
        }
        wrapper.className = "flex flex-col justify-center whitespace-nowrap w-auto"
        if (i == 0) {
            wrapperTime.className = "flex justify-center text-md font-bold"
            wrapperTime.innerHTML = "Now"
        } else {
            wrapperTime.className = "flex justify-center text-md"
            wrapperTime.innerHTML = formatHour(new Date(time).getHours())
        }

        wrapperTempWrapper.className = "relative"
        wrapperTemp.className = "block font-bold text-center text-md"
        wrapperTempSign.className = "absolute top-0 right-[-0.3rem] font-bold text-center text-md"
        wrapperTemp.innerHTML = `${Math.round(temp)}`
        wrapperTempSign.innerHTML = `${data.daily_units.temperature_2m_min[0]}`
        wrapper.appendChild(wrapperTime)
        wrapper.appendChild(wrapperIcon)
        wrapperTempWrapper.appendChild(wrapperTemp)
        wrapperTempWrapper.appendChild(wrapperTempSign)
        wrapper.appendChild(wrapperTempWrapper)
        document.getElementById("currentWeatherRow").appendChild(wrapper)
        if (currentCondition.description != false && currentCondition.description != codeToDescription(data.hourly.weather_code[hourlyOffset + i]).description) {
            document.getElementById("currentWeatherDesc").innerHTML = `${currentCondition.description}${formatHour(new Date(time).getHours())}.`
            currentCondition.description = false;
        } else if (i == 23 && currentCondition.description != false) {
            document.getElementById("currentWeatherDesc").innerHTML = "Current conditions will continue."
        }
    }
    // Daily Weather

    let minTemp = Math.min(...data.daily.temperature_2m_max, ...data.daily.temperature_2m_min)
    let maxTemp = Math.max(...data.daily.temperature_2m_max, ...data.daily.temperature_2m_min)
    for (let i = 0; i < 7; i++) {
        let lowTemp = data.daily.temperature_2m_min[i]
        let highTemp = data.daily.temperature_2m_max[i]

        let wrapper = document.createElement("div")
        let wrapperLeftDiv = document.createElement("div")
        let wrapperRightDiv = document.createElement("div")
        let wrapperDateDiv = document.createElement("div")
        let wrapperIconDiv = document.createElement("div")
        let wrapperLowTemp = document.createElement("p")
        let wrapperChartDiv = document.createElement("div")
        let wrapperChartOverlay = document.createElement("div")
        let wrapperHighTemp = document.createElement("p")

        wrapper.className = "flex flex-row py-3 border-t border-white/50"
        wrapperLeftDiv.className = "flex flex-row w-2/5"
        wrapperRightDiv.className = "flex flex-row w-3/5 justify-center"
        wrapperDateDiv.className = "flex w-1/2 justify-start"
        wrapperIconDiv.className = "flex w-1/2 justify-start"
        wrapperLowTemp.className = "flex w-1/5 justify-start"
        wrapperChartDiv.className = "relative flex justify-center w-3/5 h-1 bg-gray-800/50 self-center rounded-2xl"
        wrapperChartOverlay.className = `absolute h-full bg-white rounded-2xl w-[${width = ((highTemp - lowTemp) / (maxTemp - minTemp)) * 100}%] left-[${left = ((lowTemp - minTemp) / (maxTemp - minTemp)) * 100}%]`
        wrapperHighTemp.className = "flex w-1/5 font-bold justify-end"

        if (i == 0) {
            wrapperDateDiv.innerHTML = `<p class="font-bold">Today</p>`
        } else {
            wrapperDateDiv.innerHTML = `<p class="font-bold">${new Date(data.daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', timeZone: "UTC" })}</p>`
        }

        wrapperIconDiv.innerHTML = `<i class="wi ${codeToDescription(data.daily.weather_code[i]).dayIcon} self-center"></i>`
        wrapperLowTemp.innerHTML = `${Math.round(lowTemp)}${data.daily_units.temperature_2m_min[0]}`
        wrapperHighTemp.innerHTML = `${Math.round(highTemp)}${data.daily_units.temperature_2m_min[0]}`

        wrapperLeftDiv.appendChild(wrapperDateDiv)
        wrapperLeftDiv.appendChild(wrapperIconDiv)
        wrapperChartDiv.appendChild(wrapperChartOverlay)
        wrapperRightDiv.appendChild(wrapperLowTemp)
        wrapperRightDiv.appendChild(wrapperChartDiv)
        wrapperRightDiv.appendChild(wrapperHighTemp)
        wrapper.appendChild(wrapperLeftDiv)
        wrapper.appendChild(wrapperRightDiv)
        document.getElementById("weeklyWeatherRow").appendChild(wrapper)
    }

}
navigator.geolocation.getCurrentPosition(function (position) {
    const coords = position.coords
    getWeather(coords)
}, function (err) {
    console.log(`Geolocation failed with error ${err}`)
})