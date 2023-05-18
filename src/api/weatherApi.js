const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${
  import.meta.env.VITE_WEATHER_API_KEY
}&q=`;

export async function getWeatherData(lat, lon) {
  const response = await fetch(
    `${weatherUrl}${lat},${lon}&days=3&aqi=no&alerts=no`
  );

  const data = await response.json();
  try {
    return data;
  } catch (error) {
    console.log(error);
  }
}
