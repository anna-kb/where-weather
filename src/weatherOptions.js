export const weatherOptions = [
  { value: "sun", label: "Sunny" },
  { value: "rain", label: "Rainy" },
  { value: "storm", label: "Stormy" },
  { value: "fog", label: "Foggy" },
  { value: "snow", label: "Snowy" },
];

export const dropdown = document.getElementById("dropdown");
weatherOptions.forEach((option) => {
  const optionElement = document.createElement("option");
  optionElement.value = option.value;
  optionElement.text = option.label;
  dropdown.appendChild(optionElement);
});

const image = document.getElementById("weather-img");
dropdown.addEventListener("click", () => {
  displayImage(dropdown.value);
});
displayImage(dropdown.value);

function displayImage(value) {
  const body = document.getElementById("body-background");

  const defaultImg = `../${value}.png`;
  image.setAttribute("src", defaultImg);

  const defaultString = "background-img ";

  if (value === "sun") body.setAttribute("class", defaultString + "sun");
  else if (value === "snow") body.setAttribute("class", defaultString + "snow");
  else if (value === "fog") body.setAttribute("class", defaultString + "fog");
  else if (value === "rain") body.setAttribute("class", defaultString + "rain");
  else body.setAttribute("class", defaultString + "storm");
}

export const weatherCodes = [];
async function getWeatherCodes() {
  const response = await fetch("../data/weather_conditions.csv");
  const data = await response.text();
  try {
    const splitData = data.split("\n");

    splitData.forEach((line) => {
      const match = weatherOptions.find((option) => {
        return (
          line.toLowerCase().includes(option.value) ||
          line.toLowerCase().includes("drizzle") ||
          line.toLowerCase().includes("shower")
        );
      });

      if (match) {
        weatherCodes.push({
          code: line.substring(0, line.indexOf(",")),
          matchingOption:
            match.value === "drizzle"
              ? rain
              : match.value === "shower"
              ? rain
              : match.value,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

getWeatherCodes();

export function getChosenWeather() {
  return weatherCodes.filter(
    (option) =>
      option.matchingOption === dropdown.options[dropdown.selectedIndex].value
  );
}

export function checkMatch(code) {
  const acceptableWeather = getChosenWeather();

  // console.log("looking for code " + code);
  // acceptableWeather.forEach((w) => console.log(w));
  return acceptableWeather.some((option) => option.code == code);
}
