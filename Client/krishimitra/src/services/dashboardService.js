// Dashboard data service for KrishiMitra

// Base API URL - would be configured based on environment in a real app
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch weather data for the dashboard
 * @param {string} location - Location to get weather for
 * @returns {Promise<Object>} - Weather data
 */
export const fetchWeatherData = async (location = 'Meerut, UP') => {
  try {
    // In a real app, this would be an API call
    // const response = await fetch(`${API_BASE_URL}/api/weather?location=${encodeURIComponent(location)}`);
    // if (!response.ok) throw new Error('Failed to fetch weather data');
    // return await response.json();
    
    // Mock data for development
    return {
      temperature: 24,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 'Good'
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetch crop statistics for the dashboard
 * @returns {Promise<Array>} - Crop statistics data
 */
export const fetchCropStats = async () => {
  try {
    // In a real app, this would be an API call
    // const response = await fetch(`${API_BASE_URL}/api/crops/stats`);
    // if (!response.ok) throw new Error('Failed to fetch crop statistics');
    // return await response.json();
    
    // Mock data for development
    return [
      { name: 'Wheat', yield: 24, target: 30, fill: '#4CAF50' },
      { name: 'Rice', yield: 18, target: 20, fill: '#2196F3' },
      { name: 'Maize', yield: 12, target: 15, fill: '#FFC107' },
      { name: 'Potato', yield: 32, target: 25, fill: '#FF5722' },
      { name: 'Sugarcane', yield: 45, target: 50, fill: '#9C27B0' },
    ];
  } catch (error) {
    console.error('Error fetching crop statistics:', error);
    throw error;
  }
};

/**
 * Fetch soil analysis data including salt levels
 * @param {string} fieldId - Optional field ID for specific field data
 * @returns {Promise<Object>} - Soil analysis data
 */
export const fetchSoilData = async (fieldId = 'default') => {
  try {
    // In a real app, this would be an API call
    // const response = await fetch(`${API_BASE_URL}/api/soil/analysis?fieldId=${fieldId}`);
    // if (!response.ok) throw new Error('Failed to fetch soil data');
    // return await response.json();
    
    // Mock data for development
    return {
      ph: 6.8,
      moisture: 42,
      nitrogen: 120,
      phosphorus: 45,
      potassium: 85,
      salt: 1.2, // EC (Electrical Conductivity) in dS/m
      organicMatter: 3.2,
      soilType: 'Loamy',
      saltLevel: 'Low', // Low, Medium, High
      composition: [
        { name: 'Sand', value: 40, color: '#E8C07D' },
        { name: 'Silt', value: 40, color: '#B49A67' },
        { name: 'Clay', value: 20, color: '#8B4513' },
      ]
    };
  } catch (error) {
    console.error('Error fetching soil data:', error);
    throw error;
  }
};

/**
 * Fetch all dashboard data in a single call
 * @returns {Promise<Object>} - All dashboard data
 */
export const fetchDashboardData = async (location = 'Meerut, UP', fieldId = 'default') => {
  try {
    // Fetch all data in parallel
    const [weather, cropStats, soilData] = await Promise.all([
      fetchWeatherData(location),
      fetchCropStats(),
      fetchSoilData(fieldId)
    ]);
    
    return {
      weather,
      cropStats,
      soilData
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Get salt level recommendations based on EC value
 * @param {number} saltValue - EC value in dS/m
 * @returns {Object} - Status and recommendations
 */
export const getSaltRecommendations = (saltValue) => {
  let status = { text: '', color: '', recommendations: [] };
  
  if (saltValue < 1.0) {
    status.text = 'Optimal';
    status.color = 'text-green-500';
    status.recommendations = [
      'Current salt levels are optimal for most crops',
      'Continue with regular irrigation practices'
    ];
  } else if (saltValue < 2.0) {
    status.text = 'Acceptable';
    status.color = 'text-yellow-500';
    status.recommendations = [
      'Monitor salt levels during dry periods',
      'Consider increasing irrigation to prevent salt buildup'
    ];
  } else if (saltValue < 4.0) {
    status.text = 'Concerning';
    status.color = 'text-orange-500';
    status.recommendations = [
      'Implement leaching to reduce salt concentration',
      'Consider salt-tolerant crops for next season',
      'Apply organic matter to improve soil structure'
    ];
  } else {
    status.text = 'Critical';
    status.color = 'text-red-500';
    status.recommendations = [
      'Urgent action required - implement deep leaching',
      'Install drainage if not present',
      'Switch to salt-tolerant crops only',
      'Consider soil amendments like gypsum'
    ];
  }
  
  return status;
};