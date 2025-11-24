import axios from 'axios';

// Open-Meteo API endpoint
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
export const getWeatherCondition = (code) => {
  const codes = {
    0: { label: 'Clear sky', hindi: 'साफ आसमान', icon: 'sun' },
    1: { label: 'Mainly clear', hindi: 'मुख्य रूप से साफ', icon: 'sun_cloud' },
    2: { label: 'Partly cloudy', hindi: 'आंशिक रूप से बादल', icon: 'cloud_sun' },
    3: { label: 'Overcast', hindi: 'बादल छाए रहेंगे', icon: 'cloud' },
    45: { label: 'Fog', hindi: 'कोहरा', icon: 'fog' },
    48: { label: 'Depositing rime fog', hindi: 'कोहरा', icon: 'fog' },
    51: { label: 'Light drizzle', hindi: 'हल्की बूंदाबांदी', icon: 'rain_light' },
    53: { label: 'Moderate drizzle', hindi: 'मध्यम बूंदाबांदी', icon: 'rain_light' },
    55: { label: 'Dense drizzle', hindi: 'घनी बूंदाबांदी', icon: 'rain_light' },
    61: { label: 'Slight rain', hindi: 'हल्की बारिश', icon: 'rain' },
    63: { label: 'Moderate rain', hindi: 'मध्यम बारिश', icon: 'rain' },
    65: { label: 'Heavy rain', hindi: 'भारी बारिश', icon: 'rain_heavy' },
    71: { label: 'Slight snow', hindi: 'हल्की बर्फबारी', icon: 'snow' },
    73: { label: 'Moderate snow', hindi: 'मध्यम बर्फबारी', icon: 'snow' },
    75: { label: 'Heavy snow', hindi: 'भारी बर्फबारी', icon: 'snow' },
    77: { label: 'Snow grains', hindi: 'बर्फ के दाने', icon: 'snow' },
    80: { label: 'Slight rain showers', hindi: 'हल्की बारिश की बौछारें', icon: 'rain' },
    81: { label: 'Moderate rain showers', hindi: 'मध्यम बारिश की बौछारें', icon: 'rain' },
    82: { label: 'Violent rain showers', hindi: 'भारी बारिश की बौछारें', icon: 'rain_heavy' },
    95: { label: 'Thunderstorm', hindi: 'आंधी तूफान', icon: 'thunder' },
    96: { label: 'Thunderstorm with hail', hindi: 'ओलावृष्टि के साथ आंधी', icon: 'thunder' },
    99: { label: 'Thunderstorm with heavy hail', hindi: 'भारी ओलावृष्टि के साथ आंधी', icon: 'thunder' },
  };

  return codes[code] || { label: 'Unknown', hindi: 'अज्ञात', icon: 'sun' };
};

export const fetchWeather = async (lat = 28.9845, lon = 77.7064) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        forecast_days: 4
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
