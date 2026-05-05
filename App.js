import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  SafeAreaView, TouchableOpacity, TextInput, Keyboard,
  StatusBar,
} from 'react-native';

const API_KEY = '63cf608092032353d69e6d58d191c919';
const BASE    = 'https://api.openweathermap.org/data/2.5';

const THEMES = {
  Clear:        { bg: '#2980B9', text: '#fff' },
  Clouds:       { bg: '#4b6cb7', text: '#fff' },
  Rain:         { bg: '#1c3b4a', text: '#e0f0ff' },
  Drizzle:      { bg: '#2c5364', text: '#e0f0ff' },
  Thunderstorm: { bg: '#0f0c29', text: '#d0d0ff' },
  Snow:         { bg: '#83a4d4', text: '#1a3a5c' },
  Mist:         { bg: '#606c88', text: '#e8eaf6' },
  Haze:         { bg: '#606c88', text: '#e8eaf6' },
};
const EMOJIS = {
  Clear:'☀️', Clouds:'☁️', Rain:'🌧️', Drizzle:'🌦️',
  Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Haze:'🌫️', Fog:'🌫️',
};
const getTheme = (main) => THEMES[main] || { bg: '#2980B9', text: '#fff' };
const getEmoji = (main) => EMOJIS[main] || '🌤️';

export default function App() {
  const [weather,  setWeather]  = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [city,     setCity]     = useState('');
  const [lastCity, setLastCity] = useState('London');

  const theme = weather ? getTheme(weather.weather[0].main) : getTheme('Clear');

  async function fetchWeather(searchCity) {
    setLoading(true);
    setError(null);
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${searchCity}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE}/forecast?q=${searchCity}&appid=${API_KEY}&units=metric&cnt=40`),
      ]);
      if (!wRes.ok) throw new Error(String(wRes.status));
      const wData = await wRes.json();
      const fData = await fRes.json();
      setWeather(wData);
      setForecast(fData);
      setLastCity(searchCity);
    } catch (err) {
      setError(err.message === '404' ? 'City not found.' : 'Failed to fetch. Try again.');
      setWeather(null);
      setForecast(null);
    }
    setLoading(false);
  }

  function handleSearch() {
    if (city.trim()) {
      fetchWeather(city.trim());
      Keyboard.dismiss();
    }
  }

  function getDailyForecast() {
    if (!forecast) return [];
    const days = {};
    forecast.list.forEach(item => {
      const key = new Date(item.dt * 1000).toDateString();
      if (!days[key]) days[key] = {
        name: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [], main: item.weather[0].main, desc: item.weather[0].description,
      };
      days[key].temps.push(item.main.temp);
    });
    return Object.values(days).slice(0, 5).map(d => ({
      ...d,
      high: Math.round(Math.max(...d.temps)),
      low:  Math.round(Math.min(...d.temps)),
    }));
  }

  const tc = theme.text;

  return (
    <View style={[s.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Search */}
          <View style={s.searchRow}>
            <View style={[s.inputWrap, { borderColor: `${tc}55` }]}>
              <Text style={s.searchIcon}>🔍</Text>
              <TextInput
                style={[s.input, { color: tc }]}
                placeholder="Search city..."
                placeholderTextColor={`${tc}88`}
                value={city}
                onChangeText={setCity}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity style={[s.searchBtn, { borderColor: `${tc}55` }]} onPress={handleSearch}>
              <Text style={{ color: tc, fontWeight: '700' }}>Go</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={s.center}>
              <ActivityIndicator size="large" color={tc} />
              <Text style={{ color: tc, marginTop: 12, fontSize: 16 }}>Loading...</Text>
            </View>
          )}

          {error && !loading && (
            <View style={s.errorBox}>
              <Text style={{ fontSize: 40 }}>⚠️</Text>
              <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{error}</Text>
              <TouchableOpacity style={s.retryBtn} onPress={() => fetchWeather(lastCity)}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && !weather && (
            <View style={s.center}>
              <Text style={{ fontSize: 80 }}>🌤️</Text>
              <Text style={{ fontSize: 30, fontWeight: '700', color: tc, marginTop: 12 }}>Weather App</Text>
              <Text style={{ fontSize: 15, color: `${tc}bb`, marginTop: 8, textAlign: 'center' }}>
                Type a city name and tap Go
              </Text>
            </View>
          )}

          {!loading && !error && weather && (
            <>
              <View style={{ alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: tc }}>
                  {weather.name}, {weather.sys.country}
                </Text>
                <Text style={{ color: `${tc}cc`, fontSize: 14, marginTop: 4 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
              </View>

              <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Text style={{ fontSize: 90 }}>{getEmoji(weather.weather[0].main)}</Text>
                <Text style={{ fontSize: 72, fontWeight: '200', color: tc }}>{Math.round(weather.main.temp)}°C</Text>
                <Text style={{ fontSize: 20, color: `${tc}dd`, marginTop: 4 }}>
                  {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
                </Text>
                <Text style={{ fontSize: 15, color: `${tc}bb`, marginTop: 4 }}>
                  Feels like {Math.round(weather.main.feels_like)}°C
                </Text>
              </View>

              <View style={[s.statsRow, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                {[
                  ['🌡️','Min',      `${Math.round(weather.main.temp_min)}°`],
                  ['🌡️','Max',      `${Math.round(weather.main.temp_max)}°`],
                  ['💧','Humidity', `${weather.main.humidity}%`],
                  ['💨','Wind',     `${Math.round(weather.wind.speed)}m/s`],
                ].map(([icon, label, val]) => (
                  <View key={label} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 22 }}>{icon}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: tc }}>{val}</Text>
                    <Text style={{ fontSize: 11, color: `${tc}99` }}>{label}</Text>
                  </View>
                ))}
              </View>

              <View style={[s.statsRow, { backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 10 }]}>
                {[
                  ['👁️','Visibility', `${(weather.visibility / 1000).toFixed(1)}km`],
                  ['📊','Pressure',   `${weather.main.pressure}hPa`],
                  ['🧭','Wind Dir',   `${weather.wind.deg}°`],
                ].map(([icon, label, val]) => (
                  <View key={label} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 22 }}>{icon}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: tc }}>{val}</Text>
                    <Text style={{ fontSize: 11, color: `${tc}99` }}>{label}</Text>
                  </View>
                ))}
              </View>

              <Text style={[s.sectionTitle, { color: tc }]}>Hourly Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {forecast.list.slice(0, 8).map((item, i) => (
                  <View key={i} style={[s.hourCard, { borderColor: `${tc}33` }]}>
                    <Text style={{ fontSize: 11, color: `${tc}cc` }}>
                      {i === 0 ? 'Now' : new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={{ fontSize: 24, marginVertical: 4 }}>{getEmoji(item.weather[0].main)}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: tc }}>{Math.round(item.main.temp)}°</Text>
                    <Text style={{ fontSize: 10, color: `${tc}88` }}>💧{Math.round((item.pop || 0) * 100)}%</Text>
                  </View>
                ))}
              </ScrollView>

              <Text style={[s.sectionTitle, { color: tc }]}>5-Day Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getDailyForecast().map((day, i) => (
                  <View key={i} style={[s.dayCard, { borderColor: `${tc}33` }]}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: `${tc}cc` }}>{day.name}</Text>
                    <Text style={{ fontSize: 30, marginVertical: 6 }}>{getEmoji(day.main)}</Text>
                    <Text style={{ fontSize: 17, fontWeight: '700', color: tc }}>{day.high}°</Text>
                    <Text style={{ fontSize: 13, color: `${tc}88` }}>{day.low}°</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1 },
  scroll:      { padding: 20, paddingTop: 50, paddingBottom: 40 },
  searchRow:   { flexDirection: 'row', gap: 10, marginBottom: 24 },
  inputWrap:   { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 30, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  searchIcon:  { fontSize: 16, marginRight: 8 },
  input:       { flex: 1, fontSize: 16 },
  searchBtn:   { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 30, borderWidth: 1, paddingHorizontal: 18, justifyContent: 'center' },
  center:      { alignItems: 'center', marginTop: 80 },
  errorBox:    { alignItems: 'center', marginTop: 60, padding: 30, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, gap: 12 },
  retryBtn:    { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 20, marginTop: 8 },
  statsRow:    { flexDirection: 'row', justifyContent: 'space-around', borderRadius: 20, paddingVertical: 16, paddingHorizontal: 8 },
  sectionTitle:{ fontSize: 17, fontWeight: '600', marginTop: 22, marginBottom: 12 },
  hourCard:    { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 12, marginRight: 10, minWidth: 68 },
  dayCard:     { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 16, marginRight: 10, minWidth: 85 },
});
