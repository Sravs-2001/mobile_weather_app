export const getTheme = (weatherMain) => {
  const themes = {
    Clear: {
      gradient: ['#2980B9', '#6DD5FA', '#ffffff'],
      icon: 'sunny',
      textColor: '#fff',
    },
    Clouds: {
      gradient: ['#4b6cb7', '#6c8ebf', '#a0b5d1'],
      icon: 'cloudy',
      textColor: '#fff',
    },
    Rain: {
      gradient: ['#1c3b4a', '#2c5364', '#4a7c8e'],
      icon: 'rainy',
      textColor: '#e0f0ff',
    },
    Drizzle: {
      gradient: ['#2c5364', '#4a7c8e', '#6aaab8'],
      icon: 'rainy-outline',
      textColor: '#e0f0ff',
    },
    Thunderstorm: {
      gradient: ['#0f0c29', '#302b63', '#24243e'],
      icon: 'thunderstorm',
      textColor: '#d0d0ff',
    },
    Snow: {
      gradient: ['#83a4d4', '#b6fbff', '#e0f0ff'],
      icon: 'snow',
      textColor: '#1a3a5c',
    },
    Mist: {
      gradient: ['#606c88', '#3f4c6b', '#8a9bb0'],
      icon: 'partly-sunny',
      textColor: '#e8eaf6',
    },
    Haze: {
      gradient: ['#606c88', '#3f4c6b', '#8a9bb0'],
      icon: 'partly-sunny',
      textColor: '#e8eaf6',
    },
    Fog: {
      gradient: ['#d3cce3', '#e9e4f0', '#c9c9c9'],
      icon: 'partly-sunny',
      textColor: '#333',
    },
  };
  return themes[weatherMain] || themes['Clear'];
};

export const getWeatherEmoji = (weatherMain) => {
  const emojis = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Haze: '🌫️',
    Fog: '🌫️',
    Smoke: '💨',
    Dust: '💨',
    Sand: '💨',
    Ash: '🌋',
    Squall: '🌬️',
    Tornado: '🌪️',
  };
  return emojis[weatherMain] || '🌤️';
};
