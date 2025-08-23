'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MyCrops() {
  const [crops, setCrops] = useState([
    { 
      id: 1, 
      name: 'Rice', 
      stage: 'Growing', 
      health: 'Good', 
      plantedDate: '2023-06-15', 
      harvestDate: '2023-10-15',
      area: '2.5 acres',
      image: '/crops/rice.svg'
    },
    { 
      id: 2, 
      name: 'Wheat', 
      stage: 'Seedling', 
      health: 'Excellent', 
      plantedDate: '2023-07-20', 
      harvestDate: '2023-12-10',
      area: '3 acres',
      image: '/crops/wheat.svg'
    },
    { 
      id: 3, 
      name: 'Cotton', 
      stage: 'Flowering', 
      health: 'Needs attention', 
      plantedDate: '2023-05-10', 
      harvestDate: '2023-11-05',
      area: '1.5 acres',
      image: '/crops/cotton.svg'
    }
  ]);

  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    stage: 'Seedling',
    health: 'Good',
    plantedDate: '',
    harvestDate: '',
    area: '',
    image: '/crops/default.svg'
  });

  const aiRecommendations = {
    'Rice': [
      'Consider increasing irrigation by 10% due to forecasted dry spell',
      'Apply nitrogen-rich fertilizer in the next 5 days',
      'Monitor for leaf folder insects in the coming weeks'
    ],
    'Wheat': [
      'Reduce irrigation frequency due to recent rainfall',
      'Apply fungicide as preventive measure against rust',
      'Consider harvesting 5 days earlier based on weather forecast'
    ],
    'Cotton': [
      'Urgent: Treat for bollworm infestation in southeast section',
      'Increase potassium application to improve boll development',
      'Consider additional pollination support for higher yield'
    ]
  };

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.plantedDate && newCrop.area) {
      setCrops([...crops, { 
        id: crops.length + 1, 
        ...newCrop 
      }]);
      setShowAddForm(false);
      setNewCrop({
        name: '',
        stage: 'Seedling',
        health: 'Good',
        plantedDate: '',
        harvestDate: '',
        area: '',
        image: '/crops/default.svg'
      });
    }
  };

  const handleCropClick = (crop) => {
    setSelectedCrop(crop);
  };

  const getHealthColor = (health) => {
    switch(health) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-green-400';
      case 'Fair': return 'bg-yellow-400';
      case 'Needs attention': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with farm background */}
      <div className="relative h-40 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/farm-pattern.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white z-10">
            <h1 className="text-3xl font-bold mb-1">My Crops</h1>
            <p className="text-lg">Manage your farm with AI-powered insights</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Action buttons */}
        <div className="flex justify-between mb-8">
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Crop
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Sync with Sensors
            </button>
          </div>
          <div>
            <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white">
              <option>All Crops</option>
              <option>Active Crops</option>
              <option>Harvested</option>
            </select>
          </div>
        </div>

        {/* Crops grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {crops.map(crop => (
            <div 
              key={crop.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              onClick={() => handleCropClick(crop)}
            >
              <div className="h-48 bg-green-50 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image 
                    src={crop.image} 
                    alt={crop.name}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
                <div className={`absolute top-4 right-4 ${getHealthColor(crop.health)} text-white text-sm px-3 py-1 rounded-full`}>
                  {crop.health}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{crop.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Stage</p>
                    <p className="text-gray-700">{crop.stage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="text-gray-700">{crop.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Planted</p>
                    <p className="text-gray-700">{new Date(crop.plantedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Harvest (Est.)</p>
                    <p className="text-gray-700">{new Date(crop.harvestDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-green-600 font-medium">View details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights Section */}
        <div className="bg-green-50 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-green-600 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">AI-Powered Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(aiRecommendations).map(([cropName, recommendations]) => (
              <div key={cropName} className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{cropName}</h3>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Weather and Soil Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Weather Forecast</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-yellow-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">28°C</p>
                  <p className="text-gray-600">Sunny</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Humidity: 65%</p>
                <p className="text-gray-600">Wind: 12 km/h</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                <div key={day} className="text-center">
                  <p className="text-gray-600 text-sm">{day}</p>
                  <div className="my-1 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-800 font-medium">{28 - i}°C</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Soil Conditions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-gray-600 text-sm">Moisture</p>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="ml-2 text-gray-800 font-medium">65%</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-gray-600 text-sm">pH Level</p>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="ml-2 text-gray-800 font-medium">6.8</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-gray-600 text-sm">Nitrogen</p>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="ml-2 text-gray-800 font-medium">45%</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-gray-600 text-sm">Phosphorus</p>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="ml-2 text-gray-800 font-medium">60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Crop Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add New Crop</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Crop Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                  placeholder="e.g., Rice, Wheat, Cotton"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Stage</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newCrop.stage}
                  onChange={(e) => setNewCrop({...newCrop, stage: e.target.value})}
                >
                  <option>Seedling</option>
                  <option>Growing</option>
                  <option>Flowering</option>
                  <option>Fruiting</option>
                  <option>Harvesting</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Health Status</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newCrop.health}
                  onChange={(e) => setNewCrop({...newCrop, health: e.target.value})}
                >
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Needs attention</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Planted Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newCrop.plantedDate}
                    onChange={(e) => setNewCrop({...newCrop, plantedDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Expected Harvest</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newCrop.harvestDate}
                    onChange={(e) => setNewCrop({...newCrop, harvestDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Area</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newCrop.area}
                  onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                  placeholder="e.g., 2.5 acres"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCrop}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">{selectedCrop.name} Details</h3>
              <button onClick={() => setSelectedCrop(null)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-green-50 p-4 rounded-xl flex items-center justify-center h-64">
                  <Image 
                    src={selectedCrop.image} 
                    alt={selectedCrop.name}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
                <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Crop Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stage:</span>
                      <span className="font-medium text-gray-800">{selectedCrop.stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health:</span>
                      <span className={`font-medium ${selectedCrop.health === 'Needs attention' ? 'text-red-600' : 'text-gray-800'}`}>
                        {selectedCrop.health}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium text-gray-800">{selectedCrop.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Planted:</span>
                      <span className="font-medium text-gray-800">{new Date(selectedCrop.plantedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Harvest:</span>
                      <span className="font-medium text-gray-800">{new Date(selectedCrop.harvestDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Growth Timeline</h4>
                  <div className="relative">
                    <div className="absolute left-5 inset-y-0 w-0.5 bg-green-200"></div>
                    <div className="space-y-6 relative">
                      <div className="flex">
                        <div className="flex-shrink-0 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h5 className="text-lg font-medium text-gray-800">Planting</h5>
                          <p className="text-gray-600">{new Date(selectedCrop.plantedDate).toLocaleDateString()}</p>
                          <p className="mt-1 text-sm text-gray-600">Seeds planted with optimal spacing and depth.</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h5 className="text-lg font-medium text-gray-800">Germination</h5>
                          <p className="text-gray-600">{new Date(new Date(selectedCrop.plantedDate).setDate(new Date(selectedCrop.plantedDate).getDate() + 10)).toLocaleDateString()}</p>
                          <p className="mt-1 text-sm text-gray-600">First sprouts emerged. Soil moisture maintained at optimal levels.</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-400 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h5 className="text-lg font-medium text-gray-800">Current Stage: {selectedCrop.stage}</h5>
                          <p className="text-gray-600">Today</p>
                          <p className="mt-1 text-sm text-gray-600">Plants are developing well. Regular monitoring for pests and diseases.</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h5 className="text-lg font-medium text-gray-800">Expected Harvest</h5>
                          <p className="text-gray-600">{new Date(selectedCrop.harvestDate).toLocaleDateString()}</p>
                          <p className="mt-1 text-sm text-gray-600">Estimated based on growth rate and weather conditions.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-3">AI Recommendations</h4>
                  <div className="space-y-3">
                    {aiRecommendations[selectedCrop.name]?.map((rec, index) => (
                      <div key={index} className="flex items-start bg-green-50 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit Details
                    </button>
                    <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Log Activity
                    </button>
                    <button className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Report Issue
                    </button>
                    <button className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete Crop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}