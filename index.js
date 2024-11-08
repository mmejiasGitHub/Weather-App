// Weather App Project

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apikey = "d56038d9a2e7833302f067ec8449cb1c";

function hideParagraph() {
  // Get the paragraph element by its ID
  var paragraph = document.getElementById("myParagraph");

  // Set the paragraph's display property to 'none' to hide it
  paragraph.style.display = "none";
}

// Event listener to handle form submission (city-based search)
weatherForm.addEventListener("submit", async event => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherDataByCity(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city");
  }
});

// Function to get weather data by city name
async function getWeatherDataByCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }

  return await response.json();
}

// Function to get weather data by geolocation (latitude and longitude)
async function getWeatherDataByLocation(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data for your location");
  }

  return await response.json();
}

// Get the user's geolocation and display weather
function getUserWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const weatherData = await getWeatherDataByLocation(latitude, longitude);
        displayWeatherInfo(weatherData);
      } catch (error) {
        console.error(error);
        //displayError(error);
      }
    }, () => {
    //  displayError("Unable to retrieve your location.");
    });
  } else {
    //displayError("Geolocation is not supported by this browser");
  }
}

// Function to display weather information on the page
function displayWeatherInfo(data) {
  console.log(data);
  const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;
  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`; // Convert Kelvin to Celsius
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);
}

// Function to get the emoji corresponding to the weather condition
function getWeatherEmoji(weatherId) {
  switch (true) {
    case (weatherId >= 200 && weatherId < 300):
      return "⛈️"; // Thunderstorm
    case (weatherId >= 300 && weatherId < 400):
      return "🌧️"; // Drizzle
    case (weatherId >= 500 && weatherId < 600):
      return "🌧️"; // Rain
    case (weatherId >= 600 && weatherId < 700):
      return "❄️"; // Snow
    case (weatherId >= 700 && weatherId < 800):
      return "🌫️"; // Atmosphere (fog, mist, haze)
    case (weatherId === 800):
      return "☀️"; // Clear sky
    case (weatherId >= 801 && weatherId < 810):
      return "☁️"; // Clouds
    default:
      return "❓"; // Unknown weather
  }
}

// Function to display an error message
function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}

// Call the function to get user's weather based on their location
getUserWeather();
