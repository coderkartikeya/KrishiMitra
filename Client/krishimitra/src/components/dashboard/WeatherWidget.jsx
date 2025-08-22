'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Eye, Sun, CloudRain, CloudSnow, CloudFog, Thermometer } from 'lucide-react';

const WeatherWidget = ({ location = 'Meerut, UP' }) => {
  const [weather, setWeather] = useState({
    temperature: 24,
    condition: 'Partly Cloudy',
    hindiCondition: 'आंशिक बादल',
    humidity: 65,
    windSpeed: 12,
    visibility: 'Good',
    feelsLike: 26,
    isLoading: true,
    error: null,
    forecast: [
      { day: 'आज', englishDay: 'Today', temp: 24, condition: 'आंशिक बादल', englishCondition: 'Partly Cloudy' },
      { day: 'कल', englishDay: 'Tomorrow', temp: 26, condition: 'धूप', englishCondition: 'Sunny' },
      { day: 'परसों', englishDay: 'Day After', temp: 25, condition: 'बादल', englishCondition: 'Cloudy' },
    ]
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        // const data = await response.json();
        
        // Simulate API response delay
        setTimeout(() => {
          setWeather({
            temperature: 24,
            condition: 'Partly Cloudy',
            hindiCondition: 'आंशिक रूप से बादल',
            humidity: 65,
            windSpeed: 12,
            visibility: 'Good',
            feelsLike: 26,
            isLoading: false,
            error: null,
            forecast: [
              { day: 'आज', englishDay: 'Today', temp: 24, condition: 'आंशिक रूप से बादल', englishCondition: 'Partly Cloudy' },
              { day: 'कल', englishDay: 'Tomorrow', temp: 26, condition: 'धूप', englishCondition: 'Sunny' },
              { day: 'परसों', englishDay: 'Day After', temp: 25, condition: 'बादल', englishCondition: 'Cloudy' },
            ]
          });
        }, 1500);
      } catch (error) {
        setWeather(prev => ({
          ...prev,
          isLoading: false,
          error: 'मौसम डेटा लोड करने में विफल'
        }));
      }
    };

    fetchWeatherData();
  }, [location]);

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (!condition) return <Sun size={36} className="text-yellow-500" />;
    
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('rain') || conditionLower.includes('shower') || 
        conditionLower.includes('बारिश')) {
      return <CloudRain size={36} className="text-blue-500" />;
    } else if (conditionLower.includes('snow') || conditionLower.includes('बर्फ')) {
      return <CloudSnow size={36} className="text-blue-200" />;
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist') || 
               conditionLower.includes('haze') || conditionLower.includes('कोहरा') || 
               conditionLower.includes('धुंध')) {
      return <CloudFog size={36} className="text-gray-400" />;
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast') || 
               conditionLower.includes('बादल')) {
      return <Cloud size={36} className="text-gray-500" />;
    } else {
      return <Sun size={36} className="text-yellow-500" />;
    }
  };

  // Get farming advice based on weather in Hindi and English
  const getFarmingAdvice = (weather) => {
    const lowerCondition = weather.condition.toLowerCase();
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('shower') || 
        weather.hindiCondition.includes('बारिश')) {
      return {
        hindi: 'बारिश के कारण खेत के काम को स्थगित करने पर विचार करें। घर के अंदर के कामों के लिए अच्छा समय है। ☔',
        english: 'Consider postponing field work due to rain. Good time for indoor tasks. ☔'
      };
    }
    
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return {
        english: "Keep livestock sheltered. Avoid working in open fields. Ensure proper drainage in your fields.",
        hindi: "पशुधन को आश्रय दें। खुले खेतों में काम करने से बचें। अपने खेतों में उचित जल निकासी सुनिश्चित करें।"
      };
    }
    
    if (lowerCondition.includes('snow') || lowerCondition.includes('sleet') || lowerCondition.includes('blizzard')) {
      return {
        english: "Protect sensitive crops from frost. Ensure livestock have warm shelter and adequate feed.",
        hindi: "संवेदनशील फसलों को ठंड से बचाएं। सुनिश्चित करें कि पशुधन के पास गर्म आश्रय और पर्याप्त चारा है।"
      };
    }
    
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
      return {
        english: "Good time for light irrigation. Avoid spraying operations until visibility improves.",
        hindi: "हल्की सिंचाई के लिए अच्छा समय। दृश्यता में सुधार होने तक छिड़काव से बचें।"
      };
    }
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return {
        english: "Excellent day for harvesting, drying grains, and solar-dependent activities. Ensure adequate irrigation.",
        hindi: "फसल कटाई, अनाज सुखाने और सौर-निर्भर गतिविधियों के लिए उत्कृष्ट दिन। पर्याप्त सिंचाई सुनिश्चित करें।"
      };
    }
    
    if (weather.temperature > 30) {
      return {
        hindi: 'आज उच्च तापमान है। फसलों को पर्याप्त पानी सुनिश्चित करें। 💧',
        english: 'High temperatures today. Ensure crops have adequate water. 💧'
      };
    }
    
    if (weather.windSpeed > 20) {
      return {
        hindi: 'तेज हवाओं की उम्मीद है। किसी भी ढीले उपकरण या संरचनाओं को सुरक्षित करें। 🌬️',
        english: 'Strong winds expected. Secure any loose equipment or structures. 🌬️'
      };
    }
    
    return {
      hindi: 'आज खेत के काम के लिए एकदम सही मौसम! 🌾',
      english: 'Perfect weather for field work today! 🌾'
    };
  };

  if (weather.isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse border-2 border-blue-100">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="h-14 bg-gray-200 rounded"></div>
          <div className="h-14 bg-gray-200 rounded"></div>
          <div className="h-14 bg-gray-200 rounded"></div>
          <div className="h-14 bg-gray-200 rounded"></div>
        </div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (weather.error) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weather Information</h2>
        <p className="text-red-500">{weather.error}</p>
        <p className="mt-2">Unable to load weather data for {location}. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md overflow-hidden border-2 border-blue-100">
      {/* Simplified Weather Header */}
      <div className="bg-blue-500 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <h3 className="text-2xl font-bold">Today's Weather</h3>
              <p className="text-lg">आज का मौसम</p>
            </div>
          </div>
          <div className="text-center">
            <span className="text-6xl font-bold">{weather.temperature}°C</span>
            <div className="mt-1 text-center">
              <div className="text-lg font-medium">{weather.condition}</div>
              <div className="text-lg">{weather.hindiCondition}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simplified Weather Content */}
      <div className="p-4">
        {/* Farming advice - Most important for farmers */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="text-green-600" size={24} />
            <h3 className="text-xl font-bold text-green-800">Farming Advice <span className="text-green-600">(कृषि सलाह)</span></h3>
          </div>
          <p className="text-lg text-green-700 font-medium">{getFarmingAdvice(weather).english}</p>
          <p className="text-lg text-green-600">{getFarmingAdvice(weather).hindi}</p>
        </div>
        
        {/* Essential Weather Details - Simplified */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
            <Droplets className="text-blue-500 mr-3" size={28} />
            <div>
              <p className="text-base text-gray-500">Humidity <span>(नमी)</span></p>
              <p className="text-xl font-bold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
            <Wind className="text-blue-500 mr-3" size={28} />
            <div>
              <p className="text-base text-gray-500">Wind <span>(हवा)</span></p>
              <p className="text-xl font-bold">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
        
        {/* Simplified Forecast */}
        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-3">
          <h3 className="text-xl font-bold text-gray-700 mb-3 text-center">3-Day Forecast <span className="text-gray-500">(3-दिन का पूर्वानुमान)</span></h3>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-2">
                <p className="text-lg font-bold text-gray-700">{day.day}</p>
                <div className="flex justify-center my-1">
                  {getWeatherIcon(day.condition)}
                </div>
                <p className="text-xl font-bold">{day.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;