import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getWeatherEmoji } from '../constants/weatherThemes';

export default function ForecastCard({ forecast, textColor }) {
  if (!forecast) return null;

  const dailyData = getDailyForecast(forecast.list);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>5-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dailyData.map((day, index) => (
          <View key={index} style={[styles.dayCard, { borderColor: `${textColor}33` }]}>
            <Text style={[styles.dayName, { color: `${textColor}cc` }]}>{day.name}</Text>
            <Text style={styles.emoji}>{getWeatherEmoji(day.main)}</Text>
            <Text style={[styles.tempHigh, { color: textColor }]}>{day.high}°</Text>
            <Text style={[styles.tempLow, { color: `${textColor}88` }]}>{day.low}°</Text>
            <Text style={[styles.desc, { color: `${textColor}99` }]}>{day.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function getDailyForecast(list) {
  const days = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();
    if (!days[key]) {
      days[key] = {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [],
        main: item.weather[0].main,
        desc: item.weather[0].description,
      };
    }
    days[key].temps.push(item.main.temp);
  });

  return Object.values(days)
    .slice(0, 5)
    .map((day) => ({
      ...day,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      desc: day.desc.charAt(0).toUpperCase() + day.desc.slice(1),
    }));
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
  dayCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    minWidth: 90,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 32,
    marginVertical: 6,
  },
  tempHigh: {
    fontSize: 18,
    fontWeight: '700',
  },
  tempLow: {
    fontSize: 14,
    fontWeight: '500',
  },
  desc: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
