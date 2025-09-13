'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, MapPin, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const MarketPage = () => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedLocation, setSelectedLocation] = useState('meerut');

  const marketData = {
    wheat: {
      name: 'गेहूं (Wheat)',
      currentPrice: 2450,
      previousPrice: 2380,
      change: 70,
      changePercent: 2.94,
      unit: 'per quintal',
      trend: 'up',
      locations: [
        { name: 'Meerut Mandi', price: 2450, change: 70 },
        { name: 'Delhi Mandi', price: 2520, change: 80 },
        { name: 'Agra Mandi', price: 2400, change: 50 }
      ]
    },
    rice: {
      name: 'चावल (Rice)',
      currentPrice: 3200,
      previousPrice: 3150,
      change: 50,
      changePercent: 1.59,
      unit: 'per quintal',
      trend: 'up',
      locations: [
        { name: 'Meerut Mandi', price: 3200, change: 50 },
        { name: 'Delhi Mandi', price: 3350, change: 75 },
        { name: 'Agra Mandi', price: 3100, change: 25 }
      ]
    },
    maize: {
      name: 'मक्का (Maize)',
      currentPrice: 1850,
      previousPrice: 1920,
      change: -70,
      changePercent: -3.65,
      unit: 'per quintal',
      trend: 'down',
      locations: [
        { name: 'Meerut Mandi', price: 1850, change: -70 },
        { name: 'Delhi Mandi', price: 1950, change: -50 },
        { name: 'Agra Mandi', price: 1800, change: -80 }
      ]
    }
  };

  const crops = [
    { id: 'wheat', name: 'गेहूं (Wheat)', icon: '🌾' },
    { id: 'rice', name: 'चावल (Rice)', icon: '🍚' },
    { id: 'maize', name: 'मक्का (Maize)', icon: '🌽' }
  ];

  const currentCrop = marketData[selectedCrop];

  return (
    <DashboardLayout 
      title="बाज़ार भाव (Market Prices)" 
      subtitle="Real-time crop prices and market trends"
      icon={<TrendingUp className="w-6 h-6 text-green-600" />}
    >
      {/* Crop Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Crop</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCrop === crop.id
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{crop.icon}</div>
                <p className="font-medium text-gray-800">{crop.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Price */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Current Price</h4>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            ₹{currentCrop.currentPrice.toLocaleString()}
          </div>
          <p className="text-gray-600 text-sm">{currentCrop.unit}</p>
        </div>

        {/* Price Change */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Price Change</h4>
            {currentCrop.trend === 'up' ? (
              <TrendingUp className="w-6 h-6 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className={`text-3xl font-bold mb-2 ${
            currentCrop.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentCrop.trend === 'up' ? '+' : ''}₹{currentCrop.change}
          </div>
          <p className={`text-sm ${
            currentCrop.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentCrop.trend === 'up' ? '+' : ''}{currentCrop.changePercent}%
          </p>
        </div>

        {/* Market Status */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Market Status</h4>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div className={`text-2xl font-bold mb-2 ${
            currentCrop.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentCrop.trend === 'up' ? 'Rising' : 'Falling'}
          </div>
          <p className="text-gray-600 text-sm">vs Previous Day</p>
        </div>
      </div>

      {/* Location-wise Prices */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Prices by Location</h3>
        <div className="space-y-4">
          {currentCrop.locations.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-800">{location.name}</h4>
                  <p className="text-sm text-gray-600">Updated 2 hours ago</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-800">
                  ₹{location.price.toLocaleString()}
                </div>
                <div className={`text-sm ${
                  location.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {location.change >= 0 ? '+' : ''}₹{location.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">Market Insights</h4>
          <ul className="space-y-2 text-blue-700">
            <li>• Demand is high due to festival season</li>
            <li>• Supply chain disruptions affecting prices</li>
            <li>• Government MSP support expected</li>
            <li>• Weather conditions favorable for harvest</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Trading Tips</h4>
          <ul className="space-y-2 text-green-700">
            <li>• Monitor prices daily for best timing</li>
            <li>• Consider selling in smaller batches</li>
            <li>• Check quality standards before selling</li>
            <li>• Keep track of transportation costs</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketPage;