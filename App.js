import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import axios from 'axios';

import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HourlyForecast from './components/HourlyForecast';
import ForecastCard from './components/ForecastCard';
import { getTheme } from './constants/weatherThemes';
import {
  WEATHER_URL,
  FORECAST_URL,
  WEATHER_BY_COORDS_URL,
  FORECAST_BY_COORDS_URL,
} from './constants/api';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [useCoords, setUseCoords] = useState(false);
  const [coords, setCoords] = useState(null);

  const theme = weather ? getTheme(weather.weather[0].main) : getTheme('Clear');

  useEffect(() => {
    fetchByLocation();
  }, []);

  const fetchWeatherData = async (weatherUrl, forecastUrl) => {
    try {
      setError(null);
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(weatherUrl),
        axios.get(forecastUrl),
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? 'City not found. Try a different name.'
          : err.response?.status === 401
          ? 'Invalid API key. Please update constants/api.js with your OpenWeatherMap API key.'
          : 'Failed to fetch weather. Check your connection.';
      setError(msg);
      setWeather(null);
      setForecast(null);
    }
  };

  const fetchByCity = async (city) => {
    setLoading(true);
    setUseCoords(false);
    setCurrentCity(city);
    await fetchWeatherData(WEATHER_URL(city), FORECAST_URL(city));
    setLoading(false);
  };

  const fetchByLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        await fetchByCity('London');
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      setCoords({ lat: latitude, lon: longitude });
      setUseCoords(true);
      setCurrentCity(null);
      await fetchWeatherData(
        WEATHER_BY_COORDS_URL(latitude, longitude),
        FORECAST_BY_COORDS_URL(latitude, longitude)
      );
    } catch {
      await fetchByCity('London');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (useCoords && coords) {
      await fetchWeatherData(
        WEATHER_BY_COORDS_URL(coords.lat, coords.lon),
        FORECAST_BY_COORDS_URL(coords.lat, coords.lon)
      );
    } else if (currentCity) {
      await fetchWeatherData(WEATHER_URL(currentCity), FORECAST_URL(currentCity));
    }
    setRefreshing(false);
  };

  return (
    <LinearGradient colors={theme.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.textColor}
            />
          }
        >
          <SearchBar
            onSearch={fetchByCity}
            onLocationPress={fetchByLocation}
            textColor={theme.textColor}
          />

          {loading && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={theme.textColor} />
              <Text style={[styles.loadingText, { color: theme.textColor }]}>
                Fetching weather...
              </Text>
            </View>
          )}

          {error && !loading && (
            <View style={styles.errorBox}>
              <Text style={styles.errorEmoji}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => (currentCity ? fetchByCity(currentCity) : fetchByLocation())}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && weather && (
            <>
              <WeatherCard weather={weather} textColor={theme.textColor} />
              <HourlyForecast forecast={forecast} textColor={theme.textColor} />
              <ForecastCard forecast={forecast} textColor={theme.textColor} />
              <Text style={[styles.updated, { color: `${theme.textColor}66` }]}>
                Updated {new Date().toLocaleTimeString()}  •  Pull to refresh
              </Text>
            </>
          )}

          {!loading && !error && !weather && (
            <View style={styles.welcome}>
              <Text style={styles.welcomeEmoji}>🌤️</Text>
              <Text style={[styles.welcomeTitle, { color: theme.textColor }]}>
                Weather App
              </Text>
              <Text style={[styles.welcomeSub, { color: `${theme.textColor}bb` }]}>
                Search for a city or tap locate to get started
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  center: {
    alignItems: 'center',
    marginTop: 80,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorBox: {
    alignItems: 'center',
    marginTop: 60,
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 24,
    gap: 12,
  },
  errorEmoji: {
    fontSize: 48,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  welcome: {
    alignItems: 'center',
    marginTop: 80,
    gap: 12,
  },
  welcomeEmoji: {
    fontSize: 80,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  welcomeSub: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  updated: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});
