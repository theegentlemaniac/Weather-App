function getWeather() {
  const apiKey = "2ffda2bc6652d34e1283befd1fcc6db4";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => displayWeather(data))
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching weather data. Please try again.");
    });

  // Fetch forecast data
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const mainCondition = data.weather[0].main; // Use this for sound mapping
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHtml = `<p>${temperature}°C</p>`;
    const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

    tempDivInfo.innerHTML = temperatureHtml;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
    playWeatherSound(mainCondition); // Play the sound based on weather condition
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  const next24Hours = hourlyData.slice(0, 8);

  hourlyForecastDiv.innerHTML = ""; // Clear previous content

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}°C</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}

// Weather sound mapping
const weatherSounds = {
  Clear: "sounds/sunny.mp3",
  Rain: "sounds/rain.mp3",
  Snow: "sounds/snow.mp3",
  Clouds: "sounds/cloudy.mp3",
  Thunderstorm: "sounds/thunderstorm.mp3",
};

// Function to play weather sound
function playWeatherSound(condition) {
  const weatherSound = document.getElementById("weather-sound");
  const soundFile = weatherSounds[condition];

  if (soundFile) {
    weatherSound.src = soundFile; // Set the source to the appropriate sound file
    weatherSound.play(); // Play the sound
  } else {
    weatherSound.pause(); // Stop the sound if no matching condition
  }
}

function pauseSound() {
  const weatherSound = document.getElementById("weather-sound");
  weatherSound.pause();
}

function resumeSound() {
  const weatherSound = document.getElementById("weather-sound");
  weatherSound.play();
}

