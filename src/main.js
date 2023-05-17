import { getWeatherData } from "./api/weatherApi";
import { getNearestCities } from "./api/citiesApi";
import { chosenCity, cityTextBox } from "./searchCity";
import { getChosenWeather, checkMatch, dropdown } from "./weatherOptions";

const chosenWeather = getChosenWeather();
const button = document.getElementById("submit");
button.addEventListener("click", handleSubmit);

const response = document.getElementById("response-body");

const forecast = document.getElementById("forecast-container");
const elements = forecast.getElementsByClassName("forecast-day");
const forecastHeader = document.getElementById("forecast-header");
const celsiusToggle = document.getElementById("celsius");
const fahrenheitToggle = document.getElementById("fahrenheit");

celsiusToggle.addEventListener("change", handleTempChange);
fahrenheitToggle.addEventListener("change", handleTempChange);

async function handleSubmit() {
  if (
    chosenCity === undefined ||
    chosenCity === null ||
    chosenCity.length === 0
  ) {
    setResponseBody("Please enter a valid city.");
    return;
  }
  resetForecast();
  const initialCityData = await getWeatherData(chosenCity[0], chosenCity[1]);
  // does the current weather right now satisfy?
  const code = initialCityData.current.condition.code;
  const initialCheck = checkMatch(`${code}`);
  const desiredWeatherString = dropdown.options[dropdown.selectedIndex].label;
  setResponseBody(
    `Searching for the nearest city with ${desiredWeatherString} weather...`
  );
  if (initialCheck) {
    setResponseBody(
      `Woo! Looks like ${cityTextBox.value} is already ${desiredWeatherString}.`
    );
    generateForecast(initialCityData, cityTextBox.value);
  } else {
    // does the average weather for the day satisfy?
    const secondCode =
      initialCityData.forecast.forecastday[0].day.condition.code;
    const secondCheck = checkMatch(`${secondCode}`);

    if (secondCheck) {
      setResponseBody(
        `At some time today, ${cityTextBox.value} will be ${desiredWeatherString}.`
      );
      generateForecast(initialCityData, cityTextBox.value);
    } else {
      // finally, check the nearby cities for a match
      const nearestCities = await getNearestCities(chosenCity[2], "100");

      for (let i = 0; i < nearestCities.length; i++) {
        const cityData = await getWeatherData(
          nearestCities[i].lat,
          nearestCities[i].lon
        );
        const cityCode = cityData.current.condition.code;
        if (checkMatch(cityCode)) {
          setResponseBody(
            `You can find ${desiredWeatherString} weather in the nearby city of ${nearestCities[i].name}.`
          );
          generateForecast(
            cityData,
            `${nearestCities[i].name}, ${nearestCities[i].country}`
          );
          return;
        }
      }
      setResponseBody(`No nearby cities with ${desiredWeatherString} weather.`);
      generateForecast(initialCityData, cityTextBox.value);
    }
  }
}

function handleTempChange() {
  if (cityTextBox.value === "") return;
  handleSubmit();
}

function setResponseBody(message) {
  response.innerHTML = message;
}

function generateForecast(data, cityName) {
  forecastHeader.innerHTML = `Forecast for ${cityName}`;
  forecastHeader.removeAttribute("hidden");
  const forecastArray = data.forecast.forecastday;
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (let i = 0; i < forecastArray.length; i++) {
    setTimeout(() => {
      const d = new Date(forecastArray[i].date);
      setForecastDay(
        elements[i],
        weekday[d.getDay()],
        celsiusToggle.checked
          ? forecastArray[i].day.avgtemp_c
          : forecastArray[i].day.avgtemp_f,
        forecastArray[i].day.condition.text
      );
    }, i * 25);
  }
}

function setForecastDay(element, day, temp, weather) {
  element.getElementsByClassName("day-header")[0].innerHTML = day;
  if (celsiusToggle.checked)
    element.getElementsByClassName("temp")[0].innerHTML = temp + " °C";
  else element.getElementsByClassName("temp")[0].innerHTML = temp + " °F";
  element.getElementsByClassName("weather")[0].innerHTML = weather;
  element.removeAttribute("hidden");
}

function resetForecast() {
  forecastHeader.setAttribute("hidden", "");
  for (let i = 0; i < elements.length; i++) {
    elements[i].setAttribute("hidden", "");
  }
}
