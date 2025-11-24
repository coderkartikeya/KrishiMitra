'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow, CloudFog, Thermometer, MapPin, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeather, getWeatherCondition } from '../../services/weatherService';

const WeatherWidget = ({ location = 'Meerut, UP' }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        // Default to Meerut coordinates if not provided differently
        // In a real app, you might geocode the location string
        const data = await fetchWeather(28.9845, 77.7064);
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [location]);

  // Helper to get icon component
  const getIconComponent = (iconName, size = 24, className = "") => {
    switch (iconName) {
      case 'sun': return <Sun size={size} className={`text-yellow-400 ${className}`} />;
      case 'sun_cloud': return <Cloud size={size} className={`text-yellow-200 ${className}`} />; // Simplified
      case 'cloud_sun': return <Cloud size={size} className={`text-gray-100 ${className}`} />;
      case 'cloud': return <Cloud size={size} className={`text-gray-200 ${className}`} />;
      case 'fog': return <CloudFog size={size} className={`text-gray-300 ${className}`} />;
      case 'rain_light': return <CloudRain size={size} className={`text-blue-300 ${className}`} />;
      case 'rain': return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
      case 'rain_heavy': return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
      case 'snow': return <CloudSnow size={size} className={`text-white ${className}`} />;
      case 'thunder': return <CloudRain size={size} className={`text-purple-400 ${className}`} />;
      default: return <Sun size={size} className={`text-yellow-400 ${className}`} />;
    }
  };

  // Get farming advice based on weather code and temp
  const getFarmingAdvice = (current) => {
    const code = current.weather_code;
    const temp = current.temperature_2m;
    const wind = current.wind_speed_10m;

    // Rain conditions
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return {
        hindi: 'बारिश के कारण खेत के काम को स्थगित करने पर विचार करें। घर के अंदर के कामों के लिए अच्छा समय है। ☔',
        english: 'Consider postponing field work due to rain. Good time for indoor tasks. ☔',
        type: 'rain'
      };
    }

    // Thunderstorm
    if ([95, 96, 99].includes(code)) {
      return {
        english: "Keep livestock sheltered. Avoid working in open fields. Ensure proper drainage.",
        hindi: "पशुधन को आश्रय दें। खुले खेतों में काम करने से बचें। उचित जल निकासी सुनिश्चित करें।",
        type: 'storm'
      };
    }

    // High Temp
    if (temp > 35) {
      return {
        hindi: 'आज उच्च तापमान है। फसलों को पर्याप्त पानी सुनिश्चित करें। 💧',
        english: 'High temperatures today. Ensure crops have adequate water. 💧',
        type: 'heat'
      };
    }

    // High Wind
    if (wind > 20) {
      return {
        hindi: 'तेज हवाओं की उम्मीद है। किसी भी ढीले उपकरण या संरचनाओं को सुरक्षित करें। 🌬️',
        english: 'Strong winds expected. Secure any loose equipment or structures. 🌬️',
        type: 'wind'
      };
    }

    return {
      hindi: 'आज खेत के काम के लिए एकदम सही मौसम! 🌾',
      english: 'Perfect weather for field work today! 🌾',
      type: 'good'
    };
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-800 font-medium animate-pulse">Loading Weather Data...</p>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="w-full h-64 bg-red-50 rounded-3xl border border-red-100 p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="font-bold text-lg mb-2">Error Loading Weather</p>
          <p>{error || "Data unavailable"}</p>
        </div>
      </div>
    );
  }

  const current = weatherData.current;
  const condition = getWeatherCondition(current.weather_code);
  const advice = getFarmingAdvice(current);
  const daily = weatherData.daily;

  // Format date
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white p-6 md:p-8"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-100 mb-1">
              <MapPin size={18} />
              <span className="font-medium tracking-wide">{location}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">{today}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="font-semibold text-sm">Live Update</span>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 shadow-inner">
              {getIconComponent(condition.icon, 80, "drop-shadow-lg")}
            </div>
            <div>
              <div className="flex items-start">
                <span className="text-7xl font-bold tracking-tighter">{Math.round(current.temperature_2m)}</span>
                <span className="text-3xl font-light mt-2">°C</span>
              </div>
              <p className="text-xl font-medium text-blue-100">{condition.label}</p>
              <p className="text-lg text-blue-200 font-hindi">{condition.hindi}</p>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-w-[100px]">
              <Droplets className="text-blue-200 mb-2" size={24} />
              <span className="text-2xl font-bold">{current.relative_humidity_2m}%</span>
              <span className="text-xs text-blue-200 uppercase tracking-wider">Humidity</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-w-[100px]">
              <Wind className="text-blue-200 mb-2" size={24} />
              <span className="text-2xl font-bold">{current.wind_speed_10m}</span>
              <span className="text-xs text-blue-200 uppercase tracking-wider">km/h</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-w-[100px]">
              <Thermometer className="text-blue-200 mb-2" size={24} />
              <span className="text-2xl font-bold">{Math.round(current.apparent_temperature)}°</span>
              <span className="text-xs text-blue-200 uppercase tracking-wider">Feels Like</span>
            </div>
          </div>
        </div>

        {/* Farming Advice Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 text-gray-800 rounded-2xl p-5 mb-8 shadow-lg border-l-8 border-green-500"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <Cloud size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Farming Advice <span className="text-green-600 font-hindi text-base">(कृषि सलाह)</span></h3>
          </div>
          <p className="text-gray-700 font-medium mb-1">{advice.english}</p>
          <p className="text-green-700 font-hindi">{advice.hindi}</p>
        </motion.div>

        {/* 3-Day Forecast */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Forecast
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {daily.time.slice(1, 4).map((date, index) => {
              const dayCondition = getWeatherCondition(daily.weather_code[index + 1]);
              const dateObj = new Date(date);
              const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });

              return (
                <div key={date} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/5 flex items-center justify-between md:flex-col md:text-center hover:bg-white/20 transition-colors">
                  <span className="font-bold text-lg">{dayName}</span>
                  <div className="my-2">
                    {getIconComponent(dayCondition.icon, 32)}
                  </div>
                  <div className="flex items-center gap-3 md:justify-center">
                    <div className="flex items-center text-sm">
                      <ArrowUp size={14} className="text-red-300 mr-1" />
                      <span>{Math.round(daily.temperature_2m_max[index + 1])}°</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-200">
                      <ArrowDown size={14} className="text-blue-300 mr-1" />
                      <span>{Math.round(daily.temperature_2m_min[index + 1])}°</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;