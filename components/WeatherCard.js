import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getWeatherEmoji } from '../constants/weatherThemes';

export default function WeatherCard({ weather, textColor }) {
  if (!weather) return null;

  const {
    name,
    sys,
    main,
    weather: conditions,
    wind,
    visibility,
  } = weather;

  const condition = conditions[0];
  const emoji = getWeatherEmoji(condition.main);

  return (
    <View style={styles.container}>
      <Text style={[styles.city, { color: textColor }]}>
        {name}, {sys.country}
      </Text>
      <Text style={[styles.date, { color: `${textColor}cc` }]}>
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      <Text style={styles.emoji}>{emoji}</Text>

      <Text style={[styles.temp, { color: textColor }]}>
        {Math.round(main.temp)}°C
      </Text>
      <Text style={[styles.description, { color: `${textColor}dd` }]}>
        {condition.description.charAt(0).toUpperCase() + condition.description.slice(1)}
      </Text>
      <Text style={[styles.feelsLike, { color: `${textColor}bb` }]}>
        Feels like {Math.round(main.feels_like)}°C
      </Text>

      <View style={styles.statsRow}>
        <StatItem icon="thermometer" label="Min" value={`${Math.round(main.temp_min)}°`} color={textColor} />
        <StatItem icon="thermometer-outline" label="Max" value={`${Math.round(main.temp_max)}°`} color={textColor} />
        <StatItem icon="water" label="Humidity" value={`${main.humidity}%`} color={textColor} />
        <StatItem icon="speedometer" label="Wind" value={`${Math.round(wind.speed)} m/s`} color={textColor} />
      </View>

      <View style={styles.extraRow}>
        <StatItem icon="eye" label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} color={textColor} />
        <StatItem icon="cellular" label="Pressure" value={`${main.pressure} hPa`} color={textColor} />
        <StatItem icon="navigate" label="Wind Dir" value={`${wind.deg}°`} color={textColor} />
      </View>
    </View>
  );
}

function StatItem({ icon, label, value, color }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: `${color}99` }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  city: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 15,
    marginTop: 4,
  },
  emoji: {
    fontSize: 90,
    marginVertical: 12,
  },
  temp: {
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: -2,
  },
  description: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  extraRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 11,
  },
});
