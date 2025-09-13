'use client';

import React, { useState } from 'react';
import { Sprout, Plus, Edit, Trash2, Calendar, Droplets, Sun, Thermometer } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const MyCropsPage = () => {
  const [crops] = useState([
    {
      id: 1,
      name: 'गेहूं (Wheat)',
      variety: 'HD-2967',
      plantedDate: '2024-10-15',
      area: '2.5 एकड़',
      status: 'Growing',
      health: 'Good',
      nextAction: 'Fertilizer application due in 3 days',
      weather: {
        temperature: '28°C',
        humidity: '65%',
        rainfall: '5mm'
      }
    },
    {
      id: 2,
      name: 'चावल (Rice)',
      variety: 'Basmati 370',
      plantedDate: '2024-07-20',
      area: '1.8 एकड़',
      status: 'Harvesting',
      health: 'Excellent',
      nextAction: 'Harvest ready - start tomorrow',
      weather: {
        temperature: '32°C',
        humidity: '70%',
        rainfall: '2mm'
      }
    },
    {
      id: 3,
      name: 'मक्का (Maize)',
      variety: 'Hybrid 5411',
      plantedDate: '2024-09-01',
      area: '1.2 एकड़',
      status: 'Flowering',
      health: 'Good',
      nextAction: 'Pest monitoring required',
      weather: {
        temperature: '30°C',
        humidity: '60%',
        rainfall: '0mm'
      }
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Growing': return 'bg-green-100 text-green-800';
      case 'Harvesting': return 'bg-yellow-100 text-yellow-800';
      case 'Flowering': return 'bg-blue-100 text-blue-800';
      case 'Planting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout 
      title="मेरी फसलें (My Crops)" 
      subtitle="Track and manage your crops"
      icon={<Sprout className="w-6 h-6 text-green-600" />}
    >
      {/* Add New Crop Button */}
      <div className="mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-5 h-5" />
          नई फसल जोड़ें (Add New Crop)
        </button>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Crop Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{crop.name}</h3>
                  <p className="text-sm text-gray-600">{crop.variety}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                  {crop.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(crop.health)}`}>
                  {crop.health}
                </span>
              </div>
            </div>

            {/* Crop Details */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Planted: {crop.plantedDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sprout className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Area: {crop.area}</span>
                </div>
              </div>

              {/* Weather Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Weather</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <Thermometer className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{crop.weather.temperature}</p>
                  </div>
                  <div>
                    <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{crop.weather.humidity}</p>
                  </div>
                  <div>
                    <Sun className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{crop.weather.rainfall}</p>
                  </div>
                </div>
              </div>

              {/* Next Action */}
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Next Action</h4>
                <p className="text-xs text-blue-700">{crop.nextAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {crops.length === 0 && (
        <div className="text-center py-12">
          <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No crops added yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first crop to track its progress</p>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Add Your First Crop
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyCropsPage;