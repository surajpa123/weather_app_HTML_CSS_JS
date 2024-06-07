async function fetchForecast(lat, lon, unit) {
  const API_KEY = "d96fbc08bde7396bb8edcbceb063129b";
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
    );
    return response.data.list;
  } catch (error) {
    console.error("Unable to fetch forecast data", error);
    return null;
  }
}

function groupByDate(list) {
  return list.reduce((acc, curr) => {
    const date = new Date(curr.dt * 1000).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  }, {});
}

function calculateDailySummary(groupedData) {
  return Object.keys(groupedData)
    .map((date) => {
      const dayData = groupedData[date];
      const tempSum = dayData.reduce((sum, curr) => sum + curr.main.temp, 0);
      const tempMin = Math.min(...dayData.map((curr) => curr.main.temp_min));
      const tempMax = Math.max(...dayData.map((curr) => curr.main.temp_max));
      const humiditySum = dayData.reduce(
        (sum, curr) => sum + curr.main.humidity,
        0
      );

      return {
        date,
        avgTemp: tempSum / dayData.length,
        tempMin,
        tempMax,
        avgHumidity: humiditySum / dayData.length,
        dayName: moment(date).format("dddd"),
        weatherDescription: dayData[0].weather[0].description,
        weather: dayData[0].weather[0].main,
        windSpeed: dayData[0].wind.speed,
        visibility: dayData[0].visibility,
      };
    })
    .slice(0, 7);
}

function renderForecastCard(day) {
  return `
      <div class="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
        <h3 class="text-lg font-bold">${day.dayName}</h3>
        <p class="capitalize">${day.weatherDescription}</p>
        <p>${day.tempMax}°</p>
      </div>
    `;
}

function renderForecastList(forecast) {
  const groupedData = groupByDate(forecast);
  const summaryData = calculateDailySummary(groupedData);
  const forecastList = document.getElementById("forecastList");
  forecastList.innerHTML = summaryData.map(renderForecastCard).join("");
}

async function displayWeather(lat, lon, unit) {
  const forecast = await fetchForecast(lat, lon, unit);
  if (forecast) {
    renderForecastList(forecast);
  }
}

export { displayWeather };
