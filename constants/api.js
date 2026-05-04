export const API_KEY = '63cf608092032353d69e6d58d191c919';
export const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const WEATHER_URL = (city) =>
  `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;

export const FORECAST_URL = (city) =>
  `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=40`;

export const WEATHER_BY_COORDS_URL = (lat, lon) =>
  `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

export const FORECAST_BY_COORDS_URL = (lat, lon) =>
  `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=40`;
