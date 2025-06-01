const apiKey ="1933010cfe658b309fbeb7f3f2c50b70";

function getWeather(){
const city = document.getElementById("city").value;


    if (!city) {
        alert('please enter a city name')
        return
    } 

    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;


    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.cod === "404 ") {
            document.getElementById("weather-info").innerHTML = `<p class="text-red-500">city not found</p>`;
            document.getElementById("weather-info").classList.add("opacity-100");
            return; 
        }
        
        const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        const weatherHTML = `
            <h3 class="text-xl font-semibold text-gray-800">${data.name}, ${data.sys.country}</h3>
            <p class="text-lg text-gray-600">Temperature: <strong>${data.main.temp}°C</strong></p>
            <p class="text-lg text-gray-600 capitalize">${data.weather[0].description}</p>
            <img src="${weatherIcon}" alt="Weather icon" class="mx-auto mt-2">
        `;

        const weatherInfo = document.getElementById("weather-info");
        weatherInfo.innerHTML = weatherHTML;
        weatherInfo.classList.add("opacity-100");
    })
    .catch(error => console.error("Error fetching data:", error));
}

// OPTIONAL: Auto-detect user's location
function getUserLocation() {
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                document.getElementById("city").value = data.name;
                getWeather();
            })
            .catch(error => console.error("Error fetching location weather:", error));
    });
} else {
    alert("Geolocation is not supported by this browser.");
}
}

// Call the function to get user location on page load
window.onload = getUserLocation;



// to get send morning notification

   