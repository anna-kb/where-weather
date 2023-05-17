import { getCityNames } from "./api/citiesApi";
import { dropdown } from "./weatherOptions";

let possibleCities = [];
export let chosenCity = [];
export const cityTextBox = document.getElementById("city-text-box");
const datalist = document.getElementById("datalist");
let apiCooldown = false;

cityTextBox.addEventListener("input", () => {
  const cityValue = cityTextBox.value;
  for (let i = 0; i < datalist.options.length; i++) {
    let optionText = datalist.options[i].text;

    if (optionText === cityValue) {
      const coordSplit = datalist.options[i].coords.split(",");
      chosenCity = [
        coordSplit[0].trim(),
        coordSplit[1].trim(),
        datalist.options[i].cityId.trim(),
      ];
      return;
    }
  }
  if (cityValue.length > 3 && !apiCooldown) setDropdownOptions(cityValue);
  chosenCity = [];
});

async function setDropdownOptions(cityValue) {
  if (apiCooldown) return;
  try {
    startCooldown();
    possibleCities = await getCityNames(cityValue);

    possibleCities?.forEach((city) => {
      // add the possibleCities to the dropdown, while first checking if it doesnt exist already
      for (let i = 0; i < datalist.options.length; i++) {
        if (datalist.options[i].cityId === `${city.id}`) return;
      }
      const option = document.createElement("option");
      option.text = `${city.name}, ${city.country}`;
      option.coords = `${city.lat}, ${city.lon}`;
      option.cityId = `${city.id}`;
      datalist.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

//slow down API requests
function startCooldown() {
  apiCooldown = true;
  setTimeout(() => {
    apiCooldown = false;
  }, 600);
}
