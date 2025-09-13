'use client';

import React, { useState } from 'react';
import { Microscope, Droplets, Thermometer, Sun, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const SoilAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [soilData, setSoilData] = useState({
    pH: 6.8,
    nitrogen: 45,
    phosphorus: 28,
    potassium: 35,
    organicMatter: 2.1,
    moisture: 65,
    temperature: 24,
    lastTested: '2024-10-15'
  });

  const [recommendations] = useState([
    {
      id: 1,
      type: 'Fertilizer',
      title: 'Nitrogen Application',
      description: 'Add 50kg of urea per acre to improve nitrogen levels',
      priority: 'High',
      timing: 'Before next planting season'
    },
    {
      id: 2,
      type: 'Soil Amendment',
      title: 'Organic Matter Addition',
      description: 'Add compost or farmyard manure to increase organic matter content',
      priority: 'Medium',
      timing: 'During land preparation'
    },
    {
      id: 3,
      type: 'pH Adjustment',
      title: 'Lime Application',
      description: 'Apply 200kg of lime per acre to maintain optimal pH levels',
      priority: 'Low',
      timing: 'After harvest'
    }
  ]);

  const getNutrientStatus = (value, type) => {
    const ranges = {
      nitrogen: { low: 0, medium: 30, high: 60 },
      phosphorus: { low: 0, medium: 20, high: 40 },
      potassium: { low: 0, medium: 25, high: 50 },
      organicMatter: { low: 0, medium: 2, high: 4 }
    };

    const range = ranges[type];
    if (value < range.medium) return { status: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
    if (value < range.high) return { status: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'High', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout 
      title="मिट्टी विश्लेषण (Soil Analysis)" 
      subtitle="Analyze soil health and get recommendations"
      icon={<Microscope className="w-6 h-6 text-green-600" />}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`py-2 px-4 font-medium ${activeTab === 'analysis' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
        >
          <Microscope className="inline-block w-4 h-4 mr-2" />
          Soil Analysis
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`py-2 px-4 font-medium ${activeTab === 'recommendations' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
        >
          <CheckCircle className="inline-block w-4 h-4 mr-2" />
          Recommendations
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-2 px-4 font-medium ${activeTab === 'upload' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
        >
          <Upload className="inline-block w-4 h-4 mr-2" />
          Upload Test
        </button>
      </div>

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Soil Overview */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Soil Health Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800">pH Level</h4>
                <p className="text-2xl font-bold text-blue-600">{soilData.pH}</p>
                <p className="text-sm text-gray-600">Optimal: 6.0-7.0</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sun className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Moisture</h4>
                <p className="text-2xl font-bold text-green-600">{soilData.moisture}%</p>
                <p className="text-sm text-gray-600">Good</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Thermometer className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Temperature</h4>
                <p className="text-2xl font-bold text-orange-600">{soilData.temperature}°C</p>
                <p className="text-sm text-gray-600">Optimal</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Microscope className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Last Tested</h4>
                <p className="text-lg font-bold text-purple-600">{soilData.lastTested}</p>
                <p className="text-sm text-gray-600">30 days ago</p>
              </div>
            </div>
          </div>

          {/* Nutrient Levels */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nutrient Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Nitrogen (N)', value: soilData.nitrogen, unit: 'ppm', type: 'nitrogen' },
                { name: 'Phosphorus (P)', value: soilData.phosphorus, unit: 'ppm', type: 'phosphorus' },
                { name: 'Potassium (K)', value: soilData.potassium, unit: 'ppm', type: 'potassium' },
                { name: 'Organic Matter', value: soilData.organicMatter, unit: '%', type: 'organicMatter' }
              ].map((nutrient) => {
                const status = getNutrientStatus(nutrient.value, nutrient.type);
                return (
                  <div key={nutrient.name} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">{nutrient.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                        {status.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            status.status === 'Low' ? 'bg-red-500' : 
                            status.status === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((nutrient.value / 60) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {nutrient.value}{nutrient.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Soil Improvement Recommendations</h3>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{rec.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Timing: {rec.timing}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Soil Test Results</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">Upload Your Soil Test Report</h4>
              <p className="text-gray-600 mb-4">Upload PDF or image of your soil test results for analysis</p>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Choose File
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">How to Get Soil Tested</h4>
            <ul className="space-y-2 text-blue-700">
              <li>• Visit your nearest Krishi Vigyan Kendra (KVK)</li>
              <li>• Contact local agriculture department</li>
              <li>• Use private soil testing labs</li>
              <li>• Online soil testing services available</li>
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SoilAnalysisPage;