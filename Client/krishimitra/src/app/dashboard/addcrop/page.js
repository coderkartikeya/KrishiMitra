'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, ArrowLeft, Save, Calendar, MapPin, Droplets, Sun, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../middleware/clientAuth';
import { motion, AnimatePresence } from 'framer-motion';

const AddCropPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    localName: '',
    variety: '',
    category: '',
    area: '',
    unit: 'acres',
    plantedDate: '',
    expectedHarvestDate: '',
    soilType: 'unknown',
    irrigationType: 'rainfed',
    waterRequirement: 'medium',
    expectedYield: '',
    yieldUnit: 'quintals',
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

    setLoading(true);
    setError('');

    try {
      // Calculate total investment
      const totalInvestment = Object.values(formData.investment).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);

      const payload = {
        ...formData,
        farmerId: user?.id,
        farmId: `farm_${user?.id}_${Date.now()}`, // Generate a simple farm ID
        area: parseFloat(formData.area),
        expectedYield: formData.expectedYield ? parseFloat(formData.expectedYield) : null,
        investment: {
          ...formData.investment,
          total: totalInvestment
        }
      };

      const response = await fetch('/api/crops', {
        method: 'POST',
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
        setError(data.message || 'Failed to add crop');
      }
    } catch (err) {
      console.error('Error adding crop:', err);
      setError('Failed to add crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysToHarvest = () => {
    if (formData.plantedDate && formData.expectedHarvestDate) {
      const planted = new Date(formData.plantedDate);
      const harvest = new Date(formData.expectedHarvestDate);
      const diffTime = harvest - planted;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
  };

  return (
    <DashboardLayout 
      title="नई फसल जोड़ें (Add New Crop)" 
      subtitle="Add a new crop to track and manage"
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
            <p>Crop added successfully! Redirecting to your crops...</p>
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

        {/* Farm Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Planting Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {calculateDaysToHarvest() && (
                <p className="text-green-600 text-xs mt-1">
                  Growing period: {calculateDaysToHarvest()} days
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Irrigation & Water */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-blue-500" />
            Irrigation & Water
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Irrigation Type
              </label>
              <select
                value={formData.irrigationType}
                onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {irrigationTypes.map(irr => (
                  <option key={irr.value} value={irr.value}>{irr.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Requirement
              </label>
              <select
                value={formData.waterRequirement}
                onChange={(e) => handleInputChange('waterRequirement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low (कम)</option>
                <option value="medium">Medium (मध्यम)</option>
                <option value="high">High (अधिक)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Expected Yield */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sun className="w-5 h-5 mr-2 text-yellow-500" />
            Expected Yield
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Submit Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding Crop...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Add Crop
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </DashboardLayout>
  );
};

export default AddCropPage;
