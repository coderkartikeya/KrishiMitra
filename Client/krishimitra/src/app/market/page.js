"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Market() {
  // State for location and market data
  const [location, setLocation] = useState('Bangalore');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('crops');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [alertItem, setAlertItem] = useState(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [compareItems, setCompareItems] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // Available locations
  const locations = [
    'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  // Categories
  const categories = ['crops', 'seeds', 'fertilizers', 'pesticides', 'equipment'];

  // Mock data for demonstration
  const mockMarketData = {
    crops: [
      { id: 1, name: 'Rice', price: 2200, unit: 'per quintal', trend: 'up', change: 2.5, image: '/rice.jpg' },
      { id: 2, name: 'Wheat', price: 2050, unit: 'per quintal', trend: 'down', change: 1.2, image: '/wheat.jpg' },
      { id: 3, name: 'Maize', price: 1850, unit: 'per quintal', trend: 'up', change: 3.7, image: '/maize.jpg' },
      { id: 4, name: 'Sugarcane', price: 290, unit: 'per quintal', trend: 'stable', change: 0, image: '/sugarcane.jpg' },
      { id: 5, name: 'Cotton', price: 6200, unit: 'per quintal', trend: 'up', change: 5.2, image: '/cotton.jpg' },
      { id: 6, name: 'Soybean', price: 3800, unit: 'per quintal', trend: 'down', change: 2.1, image: '/soybean.jpg' },
    ],
    seeds: [
      { id: 7, name: 'Hybrid Rice Seeds', price: 450, unit: 'per kg', trend: 'up', change: 1.5, image: '/rice-seeds.jpg' },
      { id: 8, name: 'Wheat Seeds', price: 380, unit: 'per kg', trend: 'stable', change: 0, image: '/wheat-seeds.jpg' },
      { id: 9, name: 'Maize Seeds', price: 320, unit: 'per kg', trend: 'down', change: 0.8, image: '/maize-seeds.jpg' },
      { id: 10, name: 'Vegetable Seeds Mix', price: 520, unit: 'per kg', trend: 'up', change: 2.3, image: '/veg-seeds.jpg' },
    ],
    fertilizers: [
      { id: 11, name: 'Urea', price: 267, unit: 'per 50kg bag', trend: 'stable', change: 0, image: '/urea.jpg' },
      { id: 12, name: 'DAP', price: 1350, unit: 'per 50kg bag', trend: 'up', change: 1.8, image: '/dap.jpg' },
      { id: 13, name: 'NPK Complex', price: 1200, unit: 'per 50kg bag', trend: 'down', change: 0.5, image: '/npk.jpg' },
      { id: 14, name: 'Organic Compost', price: 800, unit: 'per 50kg bag', trend: 'up', change: 3.2, image: '/compost.jpg' },
    ],
    pesticides: [
      { id: 15, name: 'Insecticide', price: 450, unit: 'per liter', trend: 'stable', change: 0, image: '/insecticide.jpg' },
      { id: 16, name: 'Fungicide', price: 520, unit: 'per liter', trend: 'up', change: 1.2, image: '/fungicide.jpg' },
      { id: 17, name: 'Herbicide', price: 480, unit: 'per liter', trend: 'down', change: 0.7, image: '/herbicide.jpg' },
    ],
    equipment: [
      { id: 18, name: 'Tractor', price: 650000, unit: 'per unit', trend: 'up', change: 2.0, image: '/tractor.jpg' },
      { id: 19, name: 'Power Tiller', price: 75000, unit: 'per unit', trend: 'stable', change: 0, image: '/tiller.jpg' },
      { id: 20, name: 'Sprayer', price: 3500, unit: 'per unit', trend: 'down', change: 1.5, image: '/sprayer.jpg' },
      { id: 21, name: 'Harvester', price: 120000, unit: 'per unit', trend: 'up', change: 3.0, image: '/harvester.jpg' },
    ],
  };

  // AI price predictions (mock data)
  const aiPredictions = {
    crops: {
      'Rice': { nextWeek: 2250, nextMonth: 2300, trend: 'rising' },
      'Wheat': { nextWeek: 2030, nextMonth: 2000, trend: 'falling' },
      'Maize': { nextWeek: 1900, nextMonth: 1950, trend: 'rising' },
    },
    seeds: {
      'Hybrid Rice Seeds': { nextWeek: 455, nextMonth: 460, trend: 'rising' },
      'Wheat Seeds': { nextWeek: 380, nextMonth: 385, trend: 'stable' },
    },
    fertilizers: {
      'Urea': { nextWeek: 267, nextMonth: 270, trend: 'stable' },
      'DAP': { nextWeek: 1370, nextMonth: 1400, trend: 'rising' },
    }
  };

  // Simulate fetching market data based on location
  useEffect(() => {
    setLoading(true);
    // Simulate API call with setTimeout
    setTimeout(() => {
      setMarketData(mockMarketData);
      setLoading(false);
    }, 1000);
  }, [location]);

  // Filter data based on search query
  const filteredData = marketData && marketData[category] ? 
    marketData[category].filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

  // Handle price alert setup
  const setupPriceAlert = (item) => {
    setAlertItem(item);
    setAlertPrice('');
    setShowPriceAlert(true);
  };

  // Handle adding item to comparison
  const addToCompare = (item) => {
    if (compareItems.length < 3 && !compareItems.some(i => i.id === item.id)) {
      setCompareItems([...compareItems, item]);
    }
  };

  // Handle removing item from comparison
  const removeFromCompare = (itemId) => {
    setCompareItems(compareItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Market Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Agricultural Market Prices</h1>
          <p className="mt-2 text-green-100">
            Real-time market prices powered by AI analytics
          </p>
          
          {/* Location Selector */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-auto">
              <label htmlFor="location" className="block text-sm font-medium text-green-100">
                Select Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            {/* Search Bar */}
            <div className="w-full sm:w-64 md:w-96">
              <label htmlFor="search" className="block text-sm font-medium text-green-100">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              />
            </div>
            
            {/* Compare Button */}
            <div className="mt-4 sm:mt-auto">
              <button
                onClick={() => setShowCompare(true)}
                disabled={compareItems.length < 2}
                className={`px-4 py-2 rounded-md text-white ${
                  compareItems.length < 2 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                Compare ({compareItems.length}/3)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${category === cat
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Market Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* AI Price Insights */}
            <div className="mb-8 bg-green-50 p-4 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Price Predictions
              </h2>
              <p className="text-green-700 mb-4">Our AI analyzes market trends to predict future prices</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {aiPredictions[category] && Object.keys(aiPredictions[category]).slice(0, 3).map((itemName) => {
                  const prediction = aiPredictions[category][itemName];
                  return (
                    <div key={itemName} className="bg-white p-4 rounded-md shadow-sm border border-green-100">
                      <h3 className="font-medium text-gray-900">{itemName}</h3>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Next Week</p>
                          <p className="text-sm font-medium text-gray-900">₹{prediction.nextWeek}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Next Month</p>
                          <p className="text-sm font-medium text-gray-900">₹{prediction.nextMonth}</p>
                        </div>
                      </div>
                      <div className={`mt-2 text-sm ${
                        prediction.trend === 'rising' ? 'text-red-600' : 
                        prediction.trend === 'falling' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {prediction.trend === 'rising' ? '↗ Rising' : 
                         prediction.trend === 'falling' ? '↘ Falling' : '→ Stable'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market Prices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-200 relative">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <span>{item.name} Image</span>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-xl font-semibold text-gray-900">₹{item.price}</span>
                      <span className="ml-1 text-sm text-gray-500">{item.unit}</span>
                    </div>
                    
                    <div className="mt-1 flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.trend === 'up' ? 'bg-red-100 text-red-800' :
                        item.trend === 'down' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.trend === 'up' ? `↑ ${item.change}%` :
                         item.trend === 'down' ? `↓ ${item.change}%` :
                         'Stable'}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => setupPriceAlert(item)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Set Alert
                      </button>
                      <button
                        onClick={() => addToCompare(item)}
                        disabled={compareItems.some(i => i.id === item.id) || compareItems.length >= 3}
                        className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded ${
                          compareItems.some(i => i.id === item.id) || compareItems.length >= 3
                            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        }`}
                      >
                        {compareItems.some(i => i.id === item.id) ? 'Added' : 'Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Market Insights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Price Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Trends</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Rice</span>
                  <span className="text-sm text-red-600">+2.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Wheat</span>
                  <span className="text-sm text-green-600">-1.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Maize</span>
                  <span className="text-sm text-red-600">+3.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Market News */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Market News</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Government Announces MSP Hike for Kharif Crops</h4>
                <p className="text-sm text-gray-500 mt-1">The cabinet has approved higher minimum support prices for 14 kharif crops.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Monsoon Update: Normal Rainfall Expected</h4>
                <p className="text-sm text-gray-500 mt-1">Meteorological Department predicts normal monsoon this year, boosting crop prospects.</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Fertilizer Subsidy to Continue</h4>
                <p className="text-sm text-gray-500 mt-1">Government confirms continuation of fertilizer subsidy scheme for the next fiscal year.</p>
                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
          
          {/* Seasonal Calendar */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Seasonal Crop Calendar</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Planting Season</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Growing Season</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Harvesting Season</span>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Season Crops</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-xs text-gray-700">Rice</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                    <span className="text-xs text-gray-700">Cotton</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs text-gray-700">Wheat</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                    <span className="text-xs text-gray-700">Sugarcane</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Alert Modal */}
      {showPriceAlert && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Set Price Alert for {alertItem?.name}
                    </h3>
                    <div className="mt-4">
                      <label htmlFor="alert-price" className="block text-sm font-medium text-gray-700">
                        Alert me when price is below
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          id="alert-price"
                          value={alertPrice}
                          onChange={(e) => setAlertPrice(e.target.value)}
                          className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Current price: ₹{alertItem?.price} {alertItem?.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Handle alert setup
                    setShowPriceAlert(false);
                    // In a real app, this would save the alert to a database
                  }}
                >
                  Set Alert
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPriceAlert(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Compare Items
                    </h3>
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            {compareItems.map((item) => (
                              <th key={item.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-between">
                                  <span>{item.name}</span>
                                  <button
                                    onClick={() => removeFromCompare(item.id)}
                                    className="text-gray-400 hover:text-gray-500"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Price
                            </td>
                            {compareItems.map((item) => (
                              <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{item.price} {item.unit}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Trend
                            </td>
                            {compareItems.map((item) => (
                              <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  item.trend === 'up' ? 'bg-red-100 text-red-800' :
                                  item.trend === 'down' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.trend === 'up' ? `↑ ${item.change}%` :
                                  item.trend === 'down' ? `↓ ${item.change}%` :
                                  'Stable'}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              AI Prediction
                            </td>
                            {compareItems.map((item) => {
                              const prediction = aiPredictions[category]?.[item.name];
                              return (
                                <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {prediction ? (
                                    <div>
                                      <div>Next Week: ₹{prediction.nextWeek}</div>
                                      <div>Next Month: ₹{prediction.nextMonth}</div>
                                      <div className={`mt-1 ${
                                        prediction.trend === 'rising' ? 'text-red-600' : 
                                        prediction.trend === 'falling' ? 'text-green-600' : 'text-gray-600'
                                      }`}>
                                        {prediction.trend === 'rising' ? '↗ Rising' : 
                                        prediction.trend === 'falling' ? '↘ Falling' : '→ Stable'}
                                      </div>
                                    </div>
                                  ) : (
                                    <span>No prediction available</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCompare(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}