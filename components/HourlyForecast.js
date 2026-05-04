import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getWeatherEmoji } from '../constants/weatherThemes';

export default function HourlyForecast({ forecast, textColor }) {
  if (!forecast) return null;

  const hourly = forecast.list.slice(0, 8);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hourly.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const hour = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          return (
            <View key={index} style={[styles.card, { borderColor: `${textColor}33` }]}>
              <Text style={[styles.time, { color: `${textColor}cc` }]}>{index === 0 ? 'Now' : hour}</Text>
              <Text style={styles.emoji}>{getWeatherEmoji(item.weather[0].main)}</Text>
              <Text style={[styles.temp, { color: textColor }]}>{Math.round(item.main.temp)}°</Text>
              <View style={styles.rainRow}>
                <Text style={[styles.pop, { color: `${textColor}88` }]}>
                  💧{Math.round((item.pop || 0) * 100)}%
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 10,
    minWidth: 72,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 26,
    marginVertical: 6,
  },
  temp: {
    fontSize: 16,
    fontWeight: '700',
  },
  rainRow: {
    marginTop: 4,
  },
  pop: {
    fontSize: 11,
  },
});
