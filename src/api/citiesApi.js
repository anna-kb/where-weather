import { weatherCodes, checkMatch } from "../weatherOptions";

const geoURL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities/";
const apiOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": `${import.meta.env.VITE_CITIES_API_KEY}`,
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
};

const minPopulation = "200000";

export async function getCityNames(cityName) {
  try {
    const response = await fetch(
      `${geoURL}?namePrefix=${cityName}&limit=5&minPopulation=${minPopulation}`,
      apiOptions
    );
    const result = await response.text();
    const cityJSON = JSON.parse(result);
    const returnedCities = cityJSON?.data?.map((city) => {
      return {
        id: city.wikiDataId,
        name: city.name,
        country: city.country,
        lat: city.latitude,
        lon: city.longitude,
      };
    });

    return returnedCities;
  } catch (error) {
    console.error(error);
  }
}

export async function getNearestCities(cityId, radius) {
  try {
    const response = await fetch(
      `${geoURL}${cityId}/nearbyCities?radius=${radius}&minPopulation=${
        minPopulation - 50000
      }&distanceUnit=mi`,
      apiOptions
    );
    const result = await response.text();
    const nearestJSON = JSON.parse(result);

    const nearestCities = [];
    nearestJSON?.data?.forEach((city) => {
      nearestCities.push({
        id: city.wikiDataId,
        name: city.name,
        country: city.country,
        lat: city.latitude,
        lon: city.longitude,
      });
    });
    return nearestCities;
  } catch (error) {
    console.error(error);
  }
}
