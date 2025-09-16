'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Plus, Edit, Trash2, Calendar, Droplets, Sun, Thermometer, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../middleware/clientAuth';
import { motion, AnimatePresence } from 'framer-motion';

const MyCropsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchCrops();
      fetchStats();
    }
  }, [user?.id]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crops?farmerId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCrops(data.data.crops);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load crops');
      console.error('Error fetching crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/crops/stats?farmerId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!confirm('Are you sure you want to delete this crop?')) return;
    
    try {
      const response = await fetch(`/api/crops/${cropId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCrops(crops.filter(crop => crop._id !== cropId));
        fetchStats(); // Refresh stats
      } else {
        alert('Failed to delete crop');
      }
    } catch (err) {
      console.error('Error deleting crop:', err);
      alert('Failed to delete crop');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'growing': return 'bg-green-100 text-green-800';
      case 'harvesting': return 'bg-yellow-100 text-yellow-800';
      case 'flowering': return 'bg-blue-100 text-blue-800';
      case 'planting': return 'bg-purple-100 text-purple-800';
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'harvested': return 'bg-emerald-100 text-emerald-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysSincePlanting = (plantedDate) => {
    const now = new Date();
    const planted = new Date(plantedDate);
    const diffTime = Math.abs(now - planted);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout 
      title="मेरी फसलें (My Crops)" 
      subtitle="Track and manage your crops"
      icon={<Sprout className="w-6 h-6 text-green-600" />}
    >
      {/* Stats Overview */}
      {stats && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Crops</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCrops}</p>
              </div>
              <Sprout className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArea.toFixed(1)} acres</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalInvestment.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{stats.totalProfit.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Add New Crop Button */}
      <div className="mb-6">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/dashboard/addcrop')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          नई फसल जोड़ें (Add New Crop)
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col justify-center items-center py-12 space-y-4"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-white"></div>
            </div>
          </div>
          <p className="text-gray-500 animate-pulse">Loading your crops...</p>
        </motion.div>
      )}

      {/* Crops Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop, index) => (
          <motion.div 
            key={crop._id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Crop Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{crop.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{crop.localName}</p>
                  <p className="text-xs text-gray-500">Variety: {crop.variety}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.push(`/dashboard/editcrop/${crop._id}`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteCrop(crop._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              {/* Status and Health Badges */}
              <div className="flex gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                  {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(crop.health)}`}>
                  {crop.health.charAt(0).toUpperCase() + crop.health.slice(1)}
                </span>
              </div>
            </div>

            {/* Crop Details */}
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Planted</span>
                  </div>
                  <span className="text-sm font-medium">{formatDate(crop.plantedDate)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Sprout className="w-4 h-4" />
                    <span className="text-sm">Area</span>
                  </div>
                  <span className="text-sm font-medium">{crop.area} {crop.unit}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Days Since Planting</span>
                  </div>
                  <span className="text-sm font-medium">{getDaysSincePlanting(crop.plantedDate)} days</span>
                </div>

                {crop.expectedYield && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Expected Yield</span>
                    </div>
                    <span className="text-sm font-medium">{crop.expectedYield} {crop.yieldUnit}</span>
                  </div>
                )}

                {crop.investment?.total > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Investment</span>
                    </div>
                    <span className="text-sm font-medium">₹{crop.investment.total.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Next Action */}
              {crop.careSchedule && crop.careSchedule.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800 font-medium mb-1">Next Action</p>
                  <p className="text-sm text-blue-700">
                    {crop.careSchedule.find(task => task.status === 'pending')?.task || 'No pending tasks'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {!loading && crops.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200 
            }}
          >
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sprout className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No crops added yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Start by adding your first crop to track its progress and get AI-powered recommendations</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/addcrop')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Crop
          </motion.button>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default MyCropsPage;