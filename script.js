let currentTemp = 0;
let isCelsius = true;
async function getWeather() {

    const city = document.getElementById("city").value;

    if(city === ""){
        alert("Please enter a city name");
        return;
    }

    const apiKey = "3f8c6906b1ca8a7eb331fbc7b176bc19";

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(weatherUrl);
        const data = await response.json();

        if(data.cod != 200){
            document.getElementById("description").textContent = "❌ City not found";
            return;
        }

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Update city name
        document.getElementById("cityName").textContent = data.name;

        // Update temperature
        document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";
        currentTemp = data.main.temp;
        isCelsius = true;

        // Update description
        document.getElementById("description").textContent = data.weather[0].description;

        // Update feels like
        document.getElementById("feelsLike").textContent = "Feels like " + Math.round(data.main.feels_like) + "°";

        // Update details
        document.getElementById("windSpeed").textContent = data.wind.speed + " m/s";

        document.getElementById("humidity").textContent = data.main.humidity + " %";

        document.getElementById("pressure").textContent = data.main.pressure + " hPa";

        document.getElementById("visibility").textContent = (data.visibility / 1000) + " km";

        
        document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

        document.getElementById("sunset").textContent =
            new Date(data.sys.sunset * 1000)
                .toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })
        const weatherIcon = document.getElementById("weatherIcon");
        const bgVideo = document.getElementById("bgVideo");
        const weatherMain = data.weather[0].main;
        const currentTime = data.dt;
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;

        const isDay = currentTime >= sunrise && currentTime < sunset;

        if (weatherMain === "Clear") {

            weatherIcon.innerHTML = isDay  ? "☀️" : "🌙";
            bgVideo.src = isDay
                ? "sunny.mp4"
                : "clear-night.mp4";
        }

        else if (weatherMain === "Clouds") {
            weatherIcon.innerHTML = "☁️";
            bgVideo.src = isDay
                ? "cloudy-day.mp4"
                : "cloudy-night.mp4";
        }

        else if (weatherMain === "Rain") {
            weatherIcon.innerHTML = "🌧️";
            bgVideo.src = isDay 
                ? "rain-day.mp4"
                : "rain-night.mp4";
        }

        else if (weatherMain === "Thunderstorm") {
            weatherIcon.innerHTML = "⛈️";
            bgVideo.src = "storm.mp4";
        }

        else if (weatherMain === "Snow") {
            weatherIcon.innerHTML = "❄️";
            bgVideo.src = "snow.mp4";
        }
        else {

            weatherIcon.innerHTML = "🌤️";
            bgVideo.src = isDay
                ?"cloudy-day.mp4"
                :"cloudy-night.mp4";
        }

        bgVideo.load();
        bgVideo.play().catch(error => {
            console.log("Video autoplay failed:", error);
        });

        const forecastContainer = document.getElementById("forecastContainer");

        forecastContainer.innerHTML = "";

        for(let i = 0; i < forecastData.list.length; i += 8){

            const dayData = forecastData.list[i];

            const date = new Date(dayData.dt_txt);

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "long"
            });

            const dayMonth = date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short"
            });

            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <h4>${dayName}</h4>
                    <p>${dayMonth}</p>
                    <p class="min-temp">
                        Min: ${Math.round(dayData.main.temp_min)}°C
                    </p>
                    <p class="max-temp">
                        Max: ${Math.round(dayData.main.temp_max)}°C
                    </p>
                    <div class="icon">
                        ${getWeatherEmoji(dayData.weather[0].main)}
                </div>
                <p>${dayData.weather[0].description}</p>
            </div>
        `;
    }
 }
    catch (error) {

        console.log(error);
        document.getElementById("description").textContent = "❌ Something went wrong";

    }
}
function getWeatherEmoji(weather){

    if(weather === "Clear") return "☀️";
    if(weather === "Clouds") return "☁️";
    if(weather === "Rain") return "🌧️";
    if(weather === "Thunderstorm") return "⛈️";
    if(weather === "Snow") return "❄️";

    return "🌤️";
}
document.getElementById("city").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }
});
    function toggleUnit() {

    const tempElement = document.getElementById("temp");

    if (isCelsius) {

        let fahrenheit = (currentTemp * 9 / 5) + 32;

        tempElement.textContent = Math.round(fahrenheit) + "°F";
        isCelsius = false;

    } else {

        tempElement.textContent = Math.round(currentTemp) + "°C";

        isCelsius = true;
    }
}
