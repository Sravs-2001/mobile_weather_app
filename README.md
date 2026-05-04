# Mobile Weather App

A React Native (Expo) weather app with real-time weather data, hourly and 5-day forecasts, city search, and GPS-based location detection.

## Features

- Current weather — temperature, feels like, humidity, wind, pressure, visibility
- Hourly forecast (next 24 hours with rain probability)
- 5-day daily forecast
- City search bar
- Auto-detect location via GPS
- Dynamic gradient themes that change with weather conditions
- Pull-to-refresh

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Get a free API key

1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Copy your API key from the dashboard

### 3. Add your API key

Open `constants/api.js` and replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual key.

### 4. Run the app

```bash
npm start        # Expo dev server (scan QR with Expo Go app)
npm run android  # Android emulator
npm run ios      # iOS simulator
npm run web      # Browser preview
```

## Project Structure

```
mobile_weather_app/
├── App.js                     # Root app, state management, data fetching
├── constants/
│   ├── api.js                 # API key + URL builders
│   └── weatherThemes.js       # Gradient themes & emoji per weather type
└── components/
    ├── SearchBar.js            # City search input + locate button
    ├── WeatherCard.js          # Current weather display
    ├── HourlyForecast.js       # Next 8 hours horizontal scroll
    └── ForecastCard.js         # 5-day forecast horizontal scroll
```

## Tech Stack

- **React Native + Expo** — cross-platform mobile
- **expo-linear-gradient** — dynamic weather-based backgrounds
- **expo-location** — GPS location access
- **@expo/vector-icons** — Ionicons icon set
- **axios** — HTTP requests
- **OpenWeatherMap API** — free weather data
