const apiKey = "ab9d2af94267bcdebf31fdcb3f962c7e"; // your OpenWeatherMap API key
const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");
const errorMessage = document.getElementById("error-message");
const unitToggle = document.getElementById("unit-toggle");
const currentLocationBtn = document.getElementById("current-location-btn");

let isCelsius = true; // Celsius and Fahrenheit

// Form Submit Event Listener
weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  } else {
    showError("Please enter a valid city name.");
  }
});

// Get Weather by Geolocation
currentLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        showError("Unable to retrieve your location.");
      }
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
});

// Temperature Units
unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  const tempElement = document.getElementById("temperature");
  const currentTemp = parseFloat(tempElement.dataset.temp);
  if (isCelsius) {
    tempElement.textContent = `Temperature: ${convertToCelsius(currentTemp)}°C`;
    unitToggle.textContent = "Switch to °F";
  } else {
    tempElement.textContent = `Temperature: ${convertToFahrenheit(currentTemp)}°F`;
    unitToggle.textContent = "Switch to °C";
  }
});

// Fetch Weather Data by City Name
function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeatherData(url);
}

// Fetch Weather Data by Coordinates
function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeatherData(url);
}

// Fetch Weather Data from API
function fetchWeatherData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then((data) => displayWeather(data))
    .catch((err) => showError(err.message));
}

// Display Weather Data
function displayWeather(data) {
  const { name, main, weather } = data;
  const temperature = main.temp;
  const humidity = `Humidity: ${main.humidity}%`;
  const condition = weather[0].description;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  document.getElementById("city-name").textContent = name;
  const tempElement = document.getElementById("temperature");
  tempElement.textContent = `Temperature: ${temperature}°C`;
  tempElement.dataset.temp = temperature; 
  document.getElementById("humidity").textContent = humidity;
  document.getElementById("condition").textContent = `Condition: ${condition}`;
  document.getElementById("weather-icon").src = iconUrl;

  weatherDisplay.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

// Show Error Message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherDisplay.classList.add("hidden");
}

// Convert Temperature
function convertToFahrenheit(celsius) {
  return ((celsius * 9) / 5 + 32).toFixed(1);
}

function convertToCelsius(fahrenheit) {
  return (((fahrenheit - 32) * 5) / 9).toFixed(1);
}
