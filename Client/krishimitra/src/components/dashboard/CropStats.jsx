'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Sprout, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CropStats = () => {
  const [cropData, setCropData] = useState({
    isLoading: true,
    error: null,
    data: []
  });
  const [viewMode, setViewMode] = useState('current'); // 'current' or 'comparison'

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/crops/stats');
        // const data = await response.json();
        
        // Simulate API response delay
        setTimeout(() => {
          setCropData({
            isLoading: false,
            error: null,
            data: [
              { name: 'Wheat', yield: 24, target: 30, fill: '#4CAF50', previousYield: 20 },
              { name: 'Rice', yield: 18, target: 20, fill: '#2196F3', previousYield: 16 },
              { name: 'Maize', yield: 12, target: 15, fill: '#FFC107', previousYield: 10 },
              { name: 'Potato', yield: 32, target: 25, fill: '#FF5722', previousYield: 28 },
              { name: 'Sugarcane', yield: 45, target: 50, fill: '#9C27B0', previousYield: 42 },
            ],
            summary: {
              totalArea: 125, // hectares
              averageYield: 26.2, // q/ha
              yieldIncrease: 15.3, // percent from previous season
              bestPerformer: 'Potato' // crop with highest yield vs target
            }
          });
        }, 1000);
      } catch (error) {
        setCropData({
          isLoading: false,
          error: 'Failed to load crop data',
          data: []
        });
      }
    };

    fetchCropData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-green-600">Yield: {data.yield} q/ha</p>
          <p className="text-sm text-blue-600">Target: {data.target} q/ha</p>
          {viewMode === 'comparison' && (
            <p className="text-sm text-purple-600">Previous: {data.previousYield} q/ha</p>
          )}
          <p className="text-sm font-medium mt-1">
            {data.yield >= data.target ? (
              <span className="text-green-600">Target achieved! (+{data.yield - data.target})</span>
            ) : (
              <span className="text-amber-600">Target gap: {data.target - data.yield}</span>
            )}
          </p>
        </div>
      );
    }
  
    return null;
  };

  if (cropData.isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-100 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (cropData.error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-red-100">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-center text-red-500 text-lg font-medium">Unable to load crop data</p>
          <p className="text-center mt-2 text-gray-600">फसल डेटा लोड करने में असमर्थ</p>
          <p className="text-center mt-2 text-gray-500">Please try again later</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Refresh Page (पेज रिफ्रेश करें)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-xl">Crop Yield Statistics <span className="text-gray-600 text-base">(फसल उपज आंकड़े)</span></h3>
            <p className="text-base text-gray-500">Current season performance <span className="text-gray-400">(वर्तमान मौसम का प्रदर्शन)</span></p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+{cropData.summary?.yieldIncrease || 12}% from last season</span>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              className={`px-4 py-2 text-sm rounded-md transition-colors ${viewMode === 'current' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}
              onClick={() => setViewMode('current')}
            >
              Current <span className="text-xs text-gray-500">(वर्तमान)</span>
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md transition-colors ${viewMode === 'comparison' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}
              onClick={() => setViewMode('comparison')}
            >
              Compare <span className="text-xs text-gray-500">(तुलना)</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-gray-600 mb-1">Total Area <span className="text-gray-400">(कुल क्षेत्र)</span></p>
          <p className="font-bold text-green-700 text-lg">{cropData.summary?.totalArea || 120} ha</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Avg. Yield <span className="text-gray-400">(औसत उपज)</span></p>
          <p className="font-bold text-blue-700 text-lg">{cropData.summary?.averageYield || 26} q/ha</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm text-gray-600 mb-1">Yield Change <span className="text-gray-400">(उपज में बदलाव)</span></p>
          <p className="font-bold text-amber-700 text-lg">+{cropData.summary?.yieldIncrease || 12}%</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Top Performer <span className="text-gray-400">(सर्वश्रेष्ठ फसल)</span></p>
          <p className="font-bold text-purple-700 text-lg">{cropData.summary?.bestPerformer || 'Potato'}</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cropData.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}q`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="yield" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={30} />
            {viewMode === 'comparison' && (
              <Bar dataKey="previousYield" fill="rgba(156, 39, 176, 0.5)" radius={[4, 4, 0, 0]} barSize={30} />
            )}
            {viewMode === 'current' && (
              <Bar dataKey="target" fill="rgba(33, 150, 243, 0.3)" radius={[4, 4, 0, 0]} barSize={30} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-base text-gray-700">Current Yield <span className="text-gray-500">(वर्तमान उपज)</span></span>
        </div>
        {viewMode === 'current' ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-300"></div>
            <span className="text-base text-gray-700">Target Yield <span className="text-gray-500">(लक्षित उपज)</span></span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-300"></div>
            <span className="text-base text-gray-700">Previous Season <span className="text-gray-500">(पिछला मौसम)</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropStats;