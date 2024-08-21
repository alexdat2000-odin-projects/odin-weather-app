window.onload = () => {
    init()
};


async function getWeatherFromAPI(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=WZLJAGY5ZL68E7MJ537NQ8FVZ`,
            {mode: 'cors'});
        const data = await response.json();

        let result = {"loc": data.resolvedAddress, "now": data.description, predict: []};
        for (let day of data.days.slice(0, 5)) {
            result.predict.push({
                "date": day.datetime,
                "tempF": day.temp,
            })
        }
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function showWeather(weatherInfo) {
    const display = document.querySelector("#weather-display");
    if (weatherInfo === null) {
        display.innerHTML = `Error`;
        return;
    }
    display.innerHTML = `Location: ${weatherInfo.loc}<br>Weather now: ${weatherInfo.now}<br>`;
    for (let day of weatherInfo.predict) {
        display.innerHTML += `Temperature ${day.date}: 
                              ${Math.round((day.tempF - 32) * 5 / 9 * 10) / 10}°C (${day.tempF}°F)<br>`;
    }
}

window.onload = () => {
    const submitBtn = document.getElementById("submit");
    const inpt = document.getElementById("val");
    const form = document.querySelector("form");
    submitBtn.addEventListener("click", async (e) => {
        if (inpt.value === "") {
            return false;
        }
        e.preventDefault();
        const location = inpt.value;
        document.querySelector("#weather-display").innerHTML = `Loading`;
        const weatherInfo = await getWeatherFromAPI(location);
        showWeather(weatherInfo);
        form.reset();
    });
};
