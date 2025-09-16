'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sprout, ArrowLeft, Save, Calendar, MapPin, Droplets, Sun, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../middleware/clientAuth';
import { motion, AnimatePresence } from 'framer-motion';

const EditCropPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [crop, setCrop] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    localName: '',
    variety: '',
    category: '',
    area: '',
    unit: 'acres',
    plantedDate: '',
    expectedHarvestDate: '',
    actualHarvestDate: '',
    status: 'planning',
    health: 'good',
    growthStage: 'seedling',
    soilType: 'unknown',
    irrigationType: 'rainfed',
    waterRequirement: 'medium',
    expectedYield: '',
    actualYield: '',
    yieldUnit: 'quintals',
    revenue: '',
    investment: {
      seeds: '',
      fertilizers: '',
      pesticides: '',
      irrigation: '',
      labor: '',
      other: ''
    },
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
    { value: 'cereal', label: 'Cereal (अनाज)' },
    { value: 'pulse', label: 'Pulse (दाल)' },
    { value: 'oilseed', label: 'Oilseed (तिलहन)' },
    { value: 'vegetable', label: 'Vegetable (सब्जी)' },
    { value: 'fruit', label: 'Fruit (फल)' },
    { value: 'spice', label: 'Spice (मसाला)' },
    { value: 'cash_crop', label: 'Cash Crop (नकदी फसल)' },
    { value: 'other', label: 'Other (अन्य)' }
  ];

  const soilTypes = [
    { value: 'clay', label: 'Clay (मिट्टी)' },
    { value: 'sandy', label: 'Sandy (रेतली)' },
    { value: 'loamy', label: 'Loamy (दोमट)' },
    { value: 'silty', label: 'Silty (गादी)' },
    { value: 'peaty', label: 'Peaty (पीटी)' },
    { value: 'chalky', label: 'Chalky (चूना)' },
    { value: 'unknown', label: 'Unknown (अज्ञात)' }
  ];

  const irrigationTypes = [
    { value: 'drip', label: 'Drip (ड्रिप)' },
    { value: 'sprinkler', label: 'Sprinkler (स्प्रिंकलर)' },
    { value: 'flood', label: 'Flood (बाढ़)' },
    { value: 'rainfed', label: 'Rainfed (वर्षा आधारित)' },
    { value: 'manual', label: 'Manual (मैनुअल)' }
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'planting', label: 'Planting' },
    { value: 'growing', label: 'Growing' },
    { value: 'flowering', label: 'Flowering' },
    { value: 'fruiting', label: 'Fruiting' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'harvested', label: 'Harvested' },
    { value: 'failed', label: 'Failed' }
  ];

  const healthOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'critical', label: 'Critical' }
  ];

  const growthStages = [
    { value: 'seedling', label: 'Seedling' },
    { value: 'vegetative', label: 'Vegetative' },
    { value: 'flowering', label: 'Flowering' },
    { value: 'fruiting', label: 'Fruiting' },
    { value: 'maturity', label: 'Maturity' },
    { value: 'harvest', label: 'Harvest' }
  ];

  useEffect(() => {
    if (params.id) {
      fetchCrop();
    }
  }, [params.id]);

  const fetchCrop = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crops/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCrop(data.data);
        // Populate form with existing data
        setFormData({
          name: data.data.name || '',
          localName: data.data.localName || '',
          variety: data.data.variety || '',
          category: data.data.category || '',
          area: data.data.area || '',
          unit: data.data.unit || 'acres',
          plantedDate: data.data.plantedDate ? new Date(data.data.plantedDate).toISOString().split('T')[0] : '',
          expectedHarvestDate: data.data.expectedHarvestDate ? new Date(data.data.expectedHarvestDate).toISOString().split('T')[0] : '',
          actualHarvestDate: data.data.actualHarvestDate ? new Date(data.data.actualHarvestDate).toISOString().split('T')[0] : '',
          status: data.data.status || 'planning',
          health: data.data.health || 'good',
          growthStage: data.data.growthStage || 'seedling',
          soilType: data.data.soilType || 'unknown',
          irrigationType: data.data.irrigationType || 'rainfed',
          waterRequirement: data.data.waterRequirement || 'medium',
          expectedYield: data.data.expectedYield || '',
          actualYield: data.data.actualYield || '',
          yieldUnit: data.data.yieldUnit || 'quintals',
          revenue: data.data.revenue || '',
          investment: {
            seeds: data.data.investment?.seeds || '',
            fertilizers: data.data.investment?.fertilizers || '',
            pesticides: data.data.investment?.pesticides || '',
            irrigation: data.data.investment?.irrigation || '',
            labor: data.data.investment?.labor || '',
            other: data.data.investment?.other || ''
          },
          notes: data.data.notes?.[0]?.observation || ''
        });
      } else {
        setError(data.message || 'Failed to load crop');
      }
    } catch (err) {
      console.error('Error fetching crop:', err);
      setError('Failed to load crop');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleInvestmentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Crop name is required';
    if (!formData.localName.trim()) errors.localName = 'Local name is required';
    if (!formData.variety.trim()) errors.variety = 'Variety is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.area || formData.area <= 0) errors.area = 'Valid area is required';
    if (!formData.plantedDate) errors.plantedDate = 'Planted date is required';
    if (!formData.expectedHarvestDate) errors.expectedHarvestDate = 'Expected harvest date is required';
    
    // Validate dates
    if (formData.plantedDate && formData.expectedHarvestDate) {
      const planted = new Date(formData.plantedDate);
      const harvest = new Date(formData.expectedHarvestDate);
      if (harvest <= planted) {
        errors.expectedHarvestDate = 'Harvest date must be after planted date';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Calculate total investment
      const totalInvestment = Object.values(formData.investment).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);

      const payload = {
        ...formData,
        area: parseFloat(formData.area),
        expectedYield: formData.expectedYield ? parseFloat(formData.expectedYield) : null,
        actualYield: formData.actualYield ? parseFloat(formData.actualYield) : null,
        revenue: formData.revenue ? parseFloat(formData.revenue) : null,
        investment: {
          ...formData.investment,
          total: totalInvestment
        },
        notes: formData.notes ? [{ observation: formData.notes }] : []
      };

      const response = await fetch(`/api/crops/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/mycrops');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update crop');
      }
    } catch (err) {
      console.error('Error updating crop:', err);
      setError('Failed to update crop. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this crop? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/crops/${params.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/dashboard/mycrops');
      } else {
        setError('Failed to delete crop');
      }
    } catch (err) {
      console.error('Error deleting crop:', err);
      setError('Failed to delete crop');
    }
  };

  if (loading) {
    return (
      <DashboardLayout 
        title="Edit Crop" 
        subtitle="Loading crop details..."
        icon={<Sprout className="w-6 h-6 text-green-600" />}
      >
        <div className="flex flex-col justify-center items-center py-12 space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-white"></div>
            </div>
          </div>
          <p className="text-gray-500 animate-pulse">Loading crop details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !crop) {
    return (
      <DashboardLayout 
        title="Edit Crop" 
        subtitle="Error loading crop"
        icon={<Sprout className="w-6 h-6 text-green-600" />}
      >
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Edit Crop" 
      subtitle="Update crop information"
      icon={<Sprout className="w-6 h-6 text-green-600" />}
    >
      {/* Back Button */}
      <div className="mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>Crop updated successfully! Redirecting to your crops...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sprout className="w-5 h-5 mr-2 text-green-500" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Name (English) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Wheat"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local Name (हिंदी) *
              </label>
              <input
                type="text"
                value={formData.localName}
                onChange={(e) => handleInputChange('localName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.localName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., गेहूं"
              />
              {validationErrors.localName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.localName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variety *
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => handleInputChange('variety', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.variety ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., HD-2967"
              />
              {validationErrors.variety && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.variety}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.category}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Status and Health */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health
              </label>
              <select
                value={formData.health}
                onChange={(e) => handleInputChange('health', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {healthOptions.map(health => (
                  <option key={health.value} value={health.value}>{health.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Growth Stage
              </label>
              <select
                value={formData.growthStage}
                onChange={(e) => handleInputChange('growthStage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {growthStages.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Farm Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            Farm Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.area ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2.5"
              />
              {validationErrors.area && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.area}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="bigha">Bigha</option>
                <option value="kanal">Kanal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {soilTypes.map(soil => (
                  <option key={soil.value} value={soil.value}>{soil.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Planting Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Planting Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planted Date *
              </label>
              <input
                type="date"
                value={formData.plantedDate}
                onChange={(e) => handleInputChange('plantedDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.plantedDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.plantedDate && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.plantedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Harvest Date *
              </label>
              <input
                type="date"
                value={formData.expectedHarvestDate}
                onChange={(e) => handleInputChange('expectedHarvestDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.expectedHarvestDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.expectedHarvestDate && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.expectedHarvestDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Harvest Date
              </label>
              <input
                type="date"
                value={formData.actualHarvestDate}
                onChange={(e) => handleInputChange('actualHarvestDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Yield Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sun className="w-5 h-5 mr-2 text-yellow-500" />
            Yield Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Yield
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.expectedYield}
                onChange={(e) => handleInputChange('expectedYield', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Yield
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.actualYield}
                onChange={(e) => handleInputChange('actualYield', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="23"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yield Unit
              </label>
              <select
                value={formData.yieldUnit}
                onChange={(e) => handleInputChange('yieldUnit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="quintals">Quintals</option>
                <option value="tons">Tons</option>
                <option value="kg">Kilograms</option>
                <option value="bags">Bags</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Revenue (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.revenue}
              onChange={(e) => handleInputChange('revenue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>
        </motion.div>

        {/* Investment Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Save className="w-5 h-5 mr-2 text-green-500" />
            Investment Details (₹)
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seeds
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.investment.seeds}
                onChange={(e) => handleInvestmentChange('seeds', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fertilizers
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.investment.fertilizers}
                onChange={(e) => handleInvestmentChange('fertilizers', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesticides
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.investment.pesticides}
                onChange={(e) => handleInvestmentChange('pesticides', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Irrigation
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.investment.irrigation}
                onChange={(e) => handleInvestmentChange('irrigation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Labor
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.investment.labor}
                onChange={(e) => handleInvestmentChange('labor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.investment.other}
                onChange={(e) => handleInvestmentChange('other', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Total Investment Display */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">Total Investment:</span>
              <span className="text-lg font-bold text-green-900">
                ₹{Object.values(formData.investment).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Add any additional notes about this crop..."
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between items-center"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Crop
          </motion.button>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Crop
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>
    </DashboardLayout>
  );
};

export default EditCropPage;
