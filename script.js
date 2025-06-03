const apiKey = "1933010cfe658b309fbeb7f3f2c50b70";

function getWeather() {
    const city = document.getElementById("city").value;

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    Promise.all([
        fetch(currentUrl).then(res => res.json()),
        fetch(forecastUrl).then(res => res.json())
    ])
    .then(([current, forecast]) => {
        if (forecast.cod !== "200" || current.cod !== 200) {
            document.getElementById("weather-info").innerHTML = `<p class="text-red-500">City not found</p>`;
            document.getElementById("weather-info").classList.add("opacity-100");
            return;
        }

        const currentIcon = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        const currentDesc = current.weather[0].description;
        const currentTemp = current.main.temp;
        const feelsLike = current.main.feels_like;
        const humidity = current.main.humidity;
        const windSpeed = current.wind.speed;

        let currentAlert = "";
        if (currentDesc.includes("rain")) {
            currentAlert = "<p class='text-blue-600 font-semibold'>☔ Bring an umbrella!</p>";
        } else if (currentDesc.includes("snow")) {
            currentAlert = "<p class='text-gray-600 font-semibold'>❄️ Snow expected - stay warm!</p>";
        } else if (currentDesc.includes("storm")) {
            currentAlert = "<p class='text-red-600 font-semibold'>⚠️ Thunderstorm alert - stay indoors!</p>";
        } else if (currentTemp > 35) {
            currentAlert = "<p class='text-orange-600 font-semibold'>🔥 Heat alert - stay hydrated!</p>";
        }

        let html = `
            <h3 class="text-xl font-semibold text-gray-800">${current.name}, ${current.sys.country}</h3>
            <div class="bg-yellow-50 p-4 rounded shadow text-center mb-4 border border-yellow-300">
                <h4 class="font-medium text-yellow-800">Current Weather</h4>
                <img src="${currentIcon}" alt="Weather icon" class="mx-auto">
                <p class="text-lg text-gray-800">${currentTemp}°C <span class="text-sm text-gray-600">(Feels like ${feelsLike}°C)</span></p>
                <p class="capitalize text-gray-600">${currentDesc}</p>
                <p class="text-sm text-gray-500">Humidity: ${humidity}% | Wind: ${windSpeed} m/s</p>
                ${currentAlert}
            </div>
        `;

        const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">`;

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt_txt).toDateString();
            const temp = day.main.temp;
            const description = day.weather[0].description;
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

            let alertText = "";
            if (description.includes("rain")) {
                alertText = "<p class='text-blue-600 font-semibold'>☔ Bring an umbrella!</p>";
            } else if (description.includes("snow")) {
                alertText = "<p class='text-gray-600 font-semibold'>❄️ Snow expected - stay warm!</p>";
            } else if (description.includes("storm")) {
                alertText = "<p class='text-red-600 font-semibold'>⚠️ Thunderstorm alert - stay indoors!</p>";
            } else if (temp > 35) {
                alertText = "<p class='text-orange-600 font-semibold'>🔥 Heat alert - stay hydrated!</p>";
            }

            html += `
                <div class="bg-white p-4 rounded shadow text-center">
                    <h4 class="font-medium text-gray-700">${date}</h4>
                    <img src="${icon}" alt="Weather icon" class="mx-auto">
                    <p class="text-lg text-gray-800">${temp}°C</p>
                    <p class="capitalize text-gray-600">${description}</p>
                    ${alertText}
                </div>`;
        });

        html += `</div>`;

        const weatherInfo = document.getElementById("weather-info");
        weatherInfo.innerHTML = html;
        weatherInfo.classList.add("opacity-100");
    })
    .catch(error => console.error("Error fetching weather data:", error));
}

// OPTIONAL: Auto-detect user's location
function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

            Promise.all([
                fetch(currentUrl).then(res => res.json()),
                fetch(forecastUrl).then(res => res.json())
            ])
            .then(([current, forecast]) => {
                document.getElementById("city").value = current.name;
                getWeather();
            })
            .catch(error => console.error("Error fetching location weather:", error));
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

window.onload = getUserLocation;

const now = new Date();
const morningTime = new Date();
morningTime.setHours(10, 0, 0, 0);
let delay = morningTime.getTime() - now.getTime();
if (delay < 0) delay += 24 * 60 * 60 * 1000;

setTimeout(() => {
    sendNotification();
    setInterval(sendNotification, 24 * 60 * 60 * 1000);
}, delay);

function sendNotification() {
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            const city = document.getElementById("city").value || "your location";
            new Notification("🌤️ WeatherWake - Morning Update", {
                body: `Good morning! Check today’s weather forecast for ${city}.`,
                icon: "https://openweathermap.org/img/wn/01d@2x.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    sendNotification();
                }
            });
        }
    }
}
