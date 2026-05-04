import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  SafeAreaView, RefreshControl, TouchableOpacity,
  TextInput, Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import axios from 'axios';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_KEY = '63cf608092032353d69e6d58d191c919';
const BASE    = 'https://api.openweathermap.org/data/2.5';

const weatherUrl  = (city)       => `${BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`;
const forecastUrl = (city)       => `${BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=40`;
const weatherCoords  = (lat,lon) => `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
const forecastCoords = (lat,lon) => `${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=40`;

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  Clear:        { gradient: ['#2980B9','#6DD5FA','#ffffff'], text: '#fff' },
  Clouds:       { gradient: ['#4b6cb7','#6c8ebf','#a0b5d1'], text: '#fff' },
  Rain:         { gradient: ['#1c3b4a','#2c5364','#4a7c8e'], text: '#e0f0ff' },
  Drizzle:      { gradient: ['#2c5364','#4a7c8e','#6aaab8'], text: '#e0f0ff' },
  Thunderstorm: { gradient: ['#0f0c29','#302b63','#24243e'], text: '#d0d0ff' },
  Snow:         { gradient: ['#83a4d4','#b6fbff','#e0f0ff'], text: '#1a3a5c' },
  Mist:         { gradient: ['#606c88','#3f4c6b','#8a9bb0'], text: '#e8eaf6' },
  Haze:         { gradient: ['#606c88','#3f4c6b','#8a9bb0'], text: '#e8eaf6' },
};
const EMOJIS = {
  Clear:'☀️', Clouds:'☁️', Rain:'🌧️', Drizzle:'🌦️',
  Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Haze:'🌫️', Fog:'🌫️',
};
const getTheme = (main) => THEMES[main] || THEMES.Clear;
const getEmoji = (main) => EMOJIS[main] || '🌤️';

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────
function SearchBar({ onSearch, onLocate, tc }) {
  const [q, setQ] = useState('');
  const submit = () => { if (q.trim()) { onSearch(q.trim()); Keyboard.dismiss(); } };
  return (
    <View style={{ flexDirection:'row', gap:10, marginBottom:20 }}>
      <View style={[sb.wrap, { borderColor:`${tc}55` }]}>
        <Text style={{ fontSize:18, marginRight:8 }}>🔍</Text>
        <TextInput
          style={[sb.input, { color:tc }]}
          placeholder="Search city..."
          placeholderTextColor={`${tc}99`}
          value={q}
          onChangeText={setQ}
          onSubmitEditing={submit}
          returnKeyType="search"
        />
        {q.length > 0 && (
          <TouchableOpacity onPress={() => setQ('')}>
            <Text style={{ color:tc, fontSize:18 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={[sb.btn, { borderColor:`${tc}55` }]} onPress={onLocate}>
        <Text style={{ fontSize:20 }}>📍</Text>
      </TouchableOpacity>
    </View>
  );
}
const sb = StyleSheet.create({
  wrap: { flex:1, flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.15)', borderRadius:30, borderWidth:1, paddingHorizontal:14, paddingVertical:10 },
  input: { flex:1, fontSize:16 },
  btn: { backgroundColor:'rgba(255,255,255,0.15)', borderRadius:30, borderWidth:1, padding:12 },
});

// ─── WEATHER CARD ─────────────────────────────────────────────────────────────
function WeatherCard({ w, tc }) {
  if (!w) return null;
  const c = w.weather[0];
  return (
    <View style={{ alignItems:'center', paddingVertical:10 }}>
      <Text style={[wc.city, { color:tc }]}>{w.name}, {w.sys.country}</Text>
      <Text style={{ color:`${tc}cc`, fontSize:15, marginTop:4 }}>
        {new Date().toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric' })}
      </Text>
      <Text style={{ fontSize:90, marginVertical:12 }}>{getEmoji(c.main)}</Text>
      <Text style={[wc.temp, { color:tc }]}>{Math.round(w.main.temp)}°C</Text>
      <Text style={{ fontSize:20, fontWeight:'500', color:`${tc}dd`, marginTop:4 }}>
        {c.description.charAt(0).toUpperCase() + c.description.slice(1)}
      </Text>
      <Text style={{ fontSize:15, color:`${tc}bb`, marginTop:4, marginBottom:24 }}>
        Feels like {Math.round(w.main.feels_like)}°C
      </Text>

      <View style={[wc.row, { backgroundColor:'rgba(255,255,255,0.12)' }]}>
        {[
          ['🌡️','Min',`${Math.round(w.main.temp_min)}°`],
          ['🌡️','Max',`${Math.round(w.main.temp_max)}°`],
          ['💧','Humidity',`${w.main.humidity}%`],
          ['💨','Wind',`${Math.round(w.wind.speed)}m/s`],
        ].map(([icon,label,val]) => (
          <View key={label} style={{ alignItems:'center', gap:4 }}>
            <Text style={{ fontSize:22 }}>{icon}</Text>
            <Text style={{ fontSize:15, fontWeight:'600', color:tc }}>{val}</Text>
            <Text style={{ fontSize:11, color:`${tc}99` }}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={[wc.row, { backgroundColor:'rgba(255,255,255,0.08)', marginTop:10 }]}>
        {[
          ['👁️','Visibility',`${(w.visibility/1000).toFixed(1)}km`],
          ['📊','Pressure',`${w.main.pressure}hPa`],
          ['🧭','Wind Dir',`${w.wind.deg}°`],
        ].map(([icon,label,val]) => (
          <View key={label} style={{ alignItems:'center', gap:4 }}>
            <Text style={{ fontSize:22 }}>{icon}</Text>
            <Text style={{ fontSize:15, fontWeight:'600', color:tc }}>{val}</Text>
            <Text style={{ fontSize:11, color:`${tc}99` }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const wc = StyleSheet.create({
  city: { fontSize:28, fontWeight:'700' },
  temp: { fontSize:72, fontWeight:'200', letterSpacing:-2 },
  row:  { flexDirection:'row', justifyContent:'space-around', width:'100%', borderRadius:20, paddingVertical:16, paddingHorizontal:8 },
});

// ─── HOURLY FORECAST ─────────────────────────────────────────────────────────
function HourlyForecast({ forecast, tc }) {
  if (!forecast) return null;
  return (
    <View style={{ marginTop:20 }}>
      <Text style={{ fontSize:18, fontWeight:'600', color:tc, marginBottom:12 }}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {forecast.list.slice(0,8).map((item, i) => {
          const date = new Date(item.dt * 1000);
          const hour = date.toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit', hour12:true });
          return (
            <View key={i} style={[hf.card, { borderColor:`${tc}33` }]}>
              <Text style={{ fontSize:12, fontWeight:'500', color:`${tc}cc` }}>{i===0?'Now':hour}</Text>
              <Text style={{ fontSize:26, marginVertical:6 }}>{getEmoji(item.weather[0].main)}</Text>
              <Text style={{ fontSize:16, fontWeight:'700', color:tc }}>{Math.round(item.main.temp)}°</Text>
              <Text style={{ fontSize:11, color:`${tc}88`, marginTop:4 }}>
                💧{Math.round((item.pop||0)*100)}%
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
const hf = StyleSheet.create({
  card: { alignItems:'center', backgroundColor:'rgba(255,255,255,0.1)', borderRadius:16, borderWidth:1, paddingVertical:12, paddingHorizontal:14, marginRight:10, minWidth:72 },
});

// ─── 5-DAY FORECAST ───────────────────────────────────────────────────────────
function ForecastCard({ forecast, tc }) {
  if (!forecast) return null;
  const days = {};
  forecast.list.forEach(item => {
    const key = new Date(item.dt*1000).toDateString();
    if (!days[key]) days[key] = { name: new Date(item.dt*1000).toLocaleDateString('en-US',{weekday:'short'}), temps:[], main:item.weather[0].main, desc:item.weather[0].description };
    days[key].temps.push(item.main.temp);
  });
  const daily = Object.values(days).slice(0,5).map(d => ({
    ...d,
    high: Math.round(Math.max(...d.temps)),
    low:  Math.round(Math.min(...d.temps)),
    desc: d.desc.charAt(0).toUpperCase()+d.desc.slice(1),
  }));

  return (
    <View style={{ marginTop:20 }}>
      <Text style={{ fontSize:18, fontWeight:'600', color:tc, marginBottom:12 }}>5-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {daily.map((day,i) => (
          <View key={i} style={[fc.card, { borderColor:`${tc}33` }]}>
            <Text style={{ fontSize:13, fontWeight:'600', color:`${tc}cc`, marginBottom:6 }}>{day.name}</Text>
            <Text style={{ fontSize:32, marginVertical:6 }}>{getEmoji(day.main)}</Text>
            <Text style={{ fontSize:18, fontWeight:'700', color:tc }}>{day.high}°</Text>
            <Text style={{ fontSize:14, fontWeight:'500', color:`${tc}88` }}>{day.low}°</Text>
            <Text style={{ fontSize:10, color:`${tc}99`, marginTop:4, textAlign:'center' }}>{day.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const fc = StyleSheet.create({
  card: { alignItems:'center', backgroundColor:'rgba(255,255,255,0.12)', borderRadius:18, borderWidth:1, paddingVertical:14, paddingHorizontal:16, marginRight:10, minWidth:90 },
});

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [weather,   setWeather]   = useState(null);
  const [forecast,  setForecast]  = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [refreshing,setRefreshing]= useState(false);
  const [lastCity,  setLastCity]  = useState(null);
  const [useCoords, setUseCoords] = useState(false);
  const [coords,    setCoords]    = useState(null);

  const theme = weather ? getTheme(weather.weather[0].main) : getTheme('Clear');

  useEffect(() => { fetchByLocation(); }, []);

  async function fetchData(wUrl, fUrl) {
    try {
      setError(null);
      const [wRes, fRes] = await Promise.all([axios.get(wUrl), axios.get(fUrl)]);
      setWeather(wRes.data);
      setForecast(fRes.data);
    } catch (err) {
      const status = err.response?.status;
      setError(
        status === 404 ? 'City not found. Try another name.' :
        status === 401 ? 'Invalid API key.' :
        'Network error. Check your connection.'
      );
      setWeather(null); setForecast(null);
    }
  }

  async function fetchByCity(city) {
    setLoading(true); setUseCoords(false); setLastCity(city);
    await fetchData(weatherUrl(city), forecastUrl(city));
    setLoading(false);
  }

  async function fetchByLocation() {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { await fetchByCity('London'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude: lat, longitude: lon } = loc.coords;
      setCoords({ lat, lon }); setUseCoords(true); setLastCity(null);
      await fetchData(weatherCoords(lat,lon), forecastCoords(lat,lon));
    } catch { await fetchByCity('London'); }
    finally { setLoading(false); }
  }

  async function onRefresh() {
    setRefreshing(true);
    if (useCoords && coords) await fetchData(weatherCoords(coords.lat,coords.lon), forecastCoords(coords.lat,coords.lon));
    else if (lastCity) await fetchData(weatherUrl(lastCity), forecastUrl(lastCity));
    setRefreshing(false);
  }

  return (
    <LinearGradient colors={theme.gradient} style={{ flex:1 }}>
      <SafeAreaView style={{ flex:1 }}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={{ padding:20, paddingTop:50, paddingBottom:40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
        >
          <SearchBar onSearch={fetchByCity} onLocate={fetchByLocation} tc={theme.text} />

          {loading && (
            <View style={{ alignItems:'center', marginTop:80, gap:16 }}>
              <ActivityIndicator size="large" color={theme.text} />
              <Text style={{ color:theme.text, fontSize:16 }}>Fetching weather...</Text>
            </View>
          )}

          {error && !loading && (
            <View style={{ alignItems:'center', marginTop:60, padding:30, backgroundColor:'rgba(0,0,0,0.25)', borderRadius:24, gap:12 }}>
              <Text style={{ fontSize:48 }}>⚠️</Text>
              <Text style={{ color:'#fff', fontSize:16, textAlign:'center', lineHeight:24 }}>{error}</Text>
              <TouchableOpacity
                style={{ marginTop:8, backgroundColor:'rgba(255,255,255,0.25)', paddingVertical:10, paddingHorizontal:30, borderRadius:20 }}
                onPress={() => lastCity ? fetchByCity(lastCity) : fetchByLocation()}
              >
                <Text style={{ color:'#fff', fontSize:15, fontWeight:'600' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && weather && (
            <>
              <WeatherCard w={weather} tc={theme.text} />
              <HourlyForecast forecast={forecast} tc={theme.text} />
              <ForecastCard forecast={forecast} tc={theme.text} />
              <Text style={{ textAlign:'center', fontSize:12, color:`${theme.text}66`, marginTop:24 }}>
                Updated {new Date().toLocaleTimeString()} · Pull to refresh
              </Text>
            </>
          )}

          {!loading && !error && !weather && (
            <View style={{ alignItems:'center', marginTop:80, gap:12 }}>
              <Text style={{ fontSize:80 }}>🌤️</Text>
              <Text style={{ fontSize:32, fontWeight:'700', color:theme.text }}>Weather App</Text>
              <Text style={{ fontSize:16, color:`${theme.text}bb`, textAlign:'center', lineHeight:24 }}>
                Search for a city or tap 📍 to get started
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
