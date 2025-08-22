'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Droplets, Leaf, Zap, AlertTriangle, Check, Info } from 'lucide-react';

const SoilData = () => {
  const [soilData, setSoilData] = useState({
    isLoading: true,
    error: null,
    data: {}
  });
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'salt', 'recommendations'

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/soil/analysis');
        // const data = await response.json();
        
        // Simulate API response delay
        setTimeout(() => {
          setSoilData({
            isLoading: false,
            error: null,
            data: {
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
              ],
              saltDistribution: [
                { name: 'Sodium', value: 45, color: '#0088FE' },
                { name: 'Calcium', value: 25, color: '#00C49F' },
                { name: 'Magnesium', value: 15, color: '#FFBB28' },
                { name: 'Chloride', value: 10, color: '#FF8042' },
                { name: 'Other', value: 5, color: '#8884D8' }
              ],
              saltHistory: [
                { month: 'Jan', ec: 0.8 },
                { month: 'Feb', ec: 0.9 },
                { month: 'Mar', ec: 1.0 },
                { month: 'Apr', ec: 1.1 },
                { month: 'May', ec: 1.2 },
                { month: 'Jun', ec: 1.2 }
              ],
              tds: 768 // Total dissolved solids in ppm
            }
          });
        }, 1000);
      } catch (error) {
        setSoilData({
          isLoading: false,
          error: 'Failed to load soil data',
          data: {}
        });
      }
    };

    fetchSoilData();
  }, []);

  // Function to determine salt level status and color
  const getSaltStatus = (saltValue) => {
    if (saltValue < 1.0) return { text: 'Optimal', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (saltValue < 2.0) return { text: 'Acceptable', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (saltValue < 4.0) return { text: 'Concerning', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { text: 'Critical', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  // Function to get recommendations based on soil data
  const getSoilRecommendations = (data) => {
    const recommendations = [];
    
    // pH recommendations
    if (data.ph < 6.0) {
      recommendations.push({
        type: 'warning',
        text: 'Consider adding lime to increase soil pH'
      });
    } else if (data.ph > 7.5) {
      recommendations.push({
        type: 'warning',
        text: 'Consider adding sulfur to decrease soil pH'
      });
    } else {
      recommendations.push({
        type: 'success',
        text: 'Soil pH is in optimal range for most crops'
      });
    }
    
    // Salt recommendations
    if (data.salt > 2.0) {
      recommendations.push({
        type: 'danger',
        text: 'Implement leaching to reduce salt concentration'
      });
      recommendations.push({
        type: 'warning',
        text: 'Consider salt-tolerant crops for next season'
      });
    } else if (data.salt > 1.0) {
      recommendations.push({
        type: 'info',
        text: 'Monitor salt levels regularly and ensure adequate drainage'
      });
    } else {
      recommendations.push({
        type: 'success',
        text: 'Salt levels are in safe range for most crops'
      });
    }
    
    // Nutrient recommendations
    if (data.nitrogen < 100) {
      recommendations.push({
        type: 'warning',
        text: 'Apply nitrogen-rich fertilizer'
      });
    }
    
    if (data.phosphorus < 30) {
      recommendations.push({
        type: 'warning',
        text: 'Apply phosphorus-rich fertilizer'
      });
    }
    
    if (data.potassium < 70) {
      recommendations.push({
        type: 'warning',
        text: 'Apply potassium-rich fertilizer'
      });
    }
    
    return recommendations;
  };

  // Function to get recommendation icon based on type
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={16} />;
      case 'success':
        return <Check className="text-green-500" size={16} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };

  if (soilData.isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 animate-pulse">
        <div className="h-64"></div>
      </div>
    );
  }

  if (soilData.error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <p className="text-center text-red-500">Unable to load soil data</p>
      </div>
    );
  }

  const saltStatus = getSaltStatus(soilData.data.salt);
  const recommendations = getSoilRecommendations(soilData.data);

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 overflow-hidden">
      {/* Header with tabs */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
        <div className="flex">
          <button
            className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-green-700 border-b-2 border-green-600 bg-white' : 'text-gray-600 hover:text-green-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'salt' ? 'text-green-700 border-b-2 border-green-600 bg-white' : 'text-gray-600 hover:text-green-700'}`}
            onClick={() => setActiveTab('salt')}
          >
            Salt Analysis
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'recommendations' ? 'text-green-700 border-b-2 border-green-600 bg-white' : 'text-gray-600 hover:text-green-700'}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-md">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">मिट्टी विश्लेषण</h3>
                  <p className="text-base text-gray-600">Soil Analysis Report</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Soil Composition Chart */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Soil Composition</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={soilData.data.composition}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {soilData.data.composition.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium text-gray-600">Soil Type: {soilData.data.soilType}</span>
                </div>
              </div>
              
              {/* Soil Metrics */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Key Metrics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-600">Moisture</span>
                    </div>
                    <span className="font-medium">{soilData.data.moisture}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <span className="text-xs font-bold">pH</span>
                      </div>
                      <span className="text-sm text-gray-600">pH Level</span>
                    </div>
                    <span className="font-medium">{soilData.data.ph}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-600">Salt Level</span>
                    </div>
                    <div>
                      <span className="font-medium">{soilData.data.salt} dS/m</span>
                      <span className={`ml-2 text-sm ${saltStatus.color}`}>({saltStatus.text})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <span className="text-xs font-bold">OM</span>
                      </div>
                      <span className="text-sm text-gray-600">Organic Matter</span>
                    </div>
                    <span className="font-medium">{soilData.data.organicMatter}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* NPK Values */}
            <div className="mt-8">
              <h4 className="font-medium text-gray-700 mb-4">Nutrient Levels</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold">N</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">Nitrogen</p>
                  <p className="font-bold text-xl text-green-700">{soilData.data.nitrogen}</p>
                  <p className="text-xs text-gray-500">ppm</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold">P</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">Phosphorus</p>
                  <p className="font-bold text-xl text-blue-700">{soilData.data.phosphorus}</p>
                  <p className="text-xs text-gray-500">ppm</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold">K</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">Potassium</p>
                  <p className="font-bold text-xl text-purple-700">{soilData.data.potassium}</p>
                  <p className="text-xs text-gray-500">ppm</p>
                </div>
              </div>
            </div>
            
            {/* Salt Summary */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 text-lg">Salt Level</h4>
                    <p className="text-blue-700">EC: {soilData.data.salt} dS/m | TDS: {soilData.data.tds} ppm</p>
                    <p className={`text-sm font-medium mt-1 ${saltStatus.color}`}>Status: {saltStatus.text}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('salt')} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-md"
                >
                  View Details
                </button>
              </div>
            </div>
          </>
        )}
        
        {/* Salt Analysis Tab */}
        {activeTab === 'salt' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Salt Analysis</h3>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${saltStatus.bgColor}`}>
                {saltStatus.text}
              </div>
            </div>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-xl">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">EC Value</p>
                  <p className="font-medium">{soilData.data.salt} dS/m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">TDS</p>
                  <p className="font-medium">{soilData.data.tds} ppm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className={`font-medium ${saltStatus.color}`}>{saltStatus.text}</p>
                </div>
              </div>
            </div>
            
            {/* Salt Distribution Chart */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Salt Distribution</h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={soilData.data.saltDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {soilData.data.saltDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Historical Salt Readings */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Historical EC Readings</h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={soilData.data.saltHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 'dataMax + 0.5']} />
                      <Tooltip />
                      <Bar dataKey="ec" fill="#0088FE" name="EC Value (dS/m)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-2">Salt Management Tips</h4>
              <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li>Ensure proper drainage to prevent salt accumulation</li>
                <li>Use high-quality irrigation water when possible</li>
                <li>Consider salt-tolerant crops if levels remain high</li>
                <li>Apply organic matter to improve soil structure</li>
              </ul>
            </div>
          </>
        )}
        
        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <>
            <h3 className="font-bold text-gray-800 mb-6">Soil Recommendations</h3>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl flex items-start ${rec.type === 'danger' ? 'bg-red-50' : rec.type === 'warning' ? 'bg-amber-50' : rec.type === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}
                >
                  <div className="mt-0.5 mr-3">
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <p className={`text-sm ${rec.type === 'danger' ? 'text-red-700' : rec.type === 'warning' ? 'text-amber-700' : rec.type === 'success' ? 'text-green-700' : 'text-blue-700'}`}>
                    {rec.text}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SoilData;