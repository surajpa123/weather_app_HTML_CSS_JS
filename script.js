import { displayWeather } from "./forecast.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const unitSelect = document.getElementById("unitSelect");
  const geoLocationButton = document.getElementById("geoLocationButton");

  const API_KEY = "d96fbc08bde7396bb8edcbceb063129b";

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value;
    const unit = unitSelect.value;
    fetchWeatherByLocation(query, unit);
  });

  geoLocationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude, unitSelect.value);
        displayWeather(latitude, longitude, unitSelect.value);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });

  function fetchWeatherByLocation(location, unit) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${API_KEY}`
      )
      .then((response) => {
        displayWeatherData(response.data);

        const { lon, lat } = response.data.coord;

        displayWeather(lat, lon, unitSelect.value);

        console.log(response.data, "response");
      })
      .catch((error) => {
        alert("Location not found or an error occurred");
      });
  }

  function fetchWeatherByCoordinates(lat, lon, unit) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      )
      .then((response) => {
        displayWeatherData(response.data);
      })
      .catch((error) => {
        alert("Unable to fetch weather data for your location");
      });
  }

  function displayWeatherData(data) {
    if (!data) return;

    const { name, main, weather, wind } = data;
    const { temp, humidity } = main;
    const description = weather[0]?.description;
    const windSpeed = wind?.speed;

    const weatherCard = document.getElementById("weatherCard");
    weatherCard.style.visibility = "visible";
    weatherCard.innerHTML = `
          <div>
            <h2 class="text-2xl font-bold mb-2">${name}</h2>
            <p class="text-xl mb-2">${temp}°</p>
          </div>
          <div class="text-left">
            <p class="capitalize mb-2">${description}</p>
            <div class="flex items-center mb-2 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 0 1 1 1v5.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L9 9.586V4a1 1 0 0 1 1-1z" clip-rule="evenodd" />
              </svg>
              <p>${windSpeed} m/s</p>
            </div>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 13.586V4a1 1 0 0 1 1-1z" clip-rule="evenodd" />
              </svg>
              <p>Humidity ${humidity}%</p>
            </div>
          </div>
        `;
  }
});
