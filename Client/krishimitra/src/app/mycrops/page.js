'use client'
import React, { useState, useEffect } from 'react';
import { 
  Sprout, Calendar, Droplets, Sun, Wind, 
  PlusCircle, Edit, Trash2, AlertTriangle, 
  ChevronDown, ChevronUp, BarChart2
} from 'lucide-react';

export default function MyCrops() {
  const [crops, setCrops] = useState([]);
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCropId, setExpandedCropId] = useState(null);
  const [newCrop, setNewCrop] = useState({
    name: '',
    variety: '',
    plantingDate: '',
    area: '',
    status: 'growing',
    healthStatus: 'good'
  });
  const [editingCropId, setEditingCropId] = useState(null);

  // Fetch crops data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCrops([
        {
          id: 1,
          name: 'गेहूं',
          englishName: 'Wheat',
          variety: 'HD-2967',
          plantingDate: '2023-11-15',
          area: 2.5,
          status: 'growing',
          healthStatus: 'good',
          nextAction: 'Irrigation needed in 2 days',
          yieldEstimate: '45 q/ha',
          alerts: []
        },
        {
          id: 2,
          name: 'धान',
          englishName: 'Rice',
          variety: 'Pusa Basmati',
          plantingDate: '2023-07-10',
          area: 1.8,
          status: 'harvested',
          healthStatus: 'completed',
          nextAction: 'None',
          yieldEstimate: '38 q/ha',
          alerts: []
        },
        {
          id: 3,
          name: 'आलू',
          englishName: 'Potato',
          variety: 'Kufri Jyoti',
          plantingDate: '2023-10-05',
          area: 1.0,
          status: 'growing',
          healthStatus: 'warning',
          nextAction: 'Check for late blight disease',
          yieldEstimate: '320 q/ha',
          alerts: [
            'Possible late blight detected - check leaves for dark spots'
          ]
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddCrop = () => {
    if (!newCrop.name || !newCrop.plantingDate || !newCrop.area) {
      alert('कृपया सभी आवश्यक जानकारी भरें (Please fill all required fields)');
      return;
    }

    const crop = {
      id: crops.length + 1,
      ...newCrop,
      healthStatus: 'good',
      nextAction: 'Monitoring growth',
      yieldEstimate: 'Calculating...',
      alerts: []
    };

    setCrops([...crops, crop]);
    setNewCrop({
      name: '',
      variety: '',
      plantingDate: '',
      area: '',
      status: 'growing',
      healthStatus: 'good'
    });
    setIsAddingCrop(false);
  };

  const handleDeleteCrop = (id) => {
    if (confirm('क्या आप इस फसल को हटाना चाहते हैं? (Do you want to delete this crop?)')) {
      setCrops(crops.filter(crop => crop.id !== id));
    }
  };

  const handleEditCrop = (id) => {
    setEditingCropId(id);
    const cropToEdit = crops.find(crop => crop.id === id);
    setNewCrop({ ...cropToEdit });
  };

  const handleUpdateCrop = () => {
    setCrops(crops.map(crop => 
      crop.id === editingCropId ? { ...crop, ...newCrop } : crop
    ));
    setEditingCropId(null);
    setNewCrop({
      name: '',
      variety: '',
      plantingDate: '',
      area: '',
      status: 'growing',
      healthStatus: 'good'
    });
  };

  const toggleCropDetails = (id) => {
    setExpandedCropId(expandedCropId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'danger': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="h-16 bg-gray-200 rounded-md animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Sprout className="mr-2 text-green-600" />
          मेरी फसलें (My Crops)
        </h1>
        <button 
          onClick={() => setIsAddingCrop(!isAddingCrop)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle className="mr-1 h-5 w-5" />
          <span>नई फसल (Add Crop)</span>
        </button>
      </div>

      {isAddingCrop && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-green-100">
          <h2 className="text-xl font-semibold mb-4">{editingCropId ? 'फसल अपडेट करें (Update Crop)' : 'नई फसल जोड़ें (Add New Crop)'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">फसल का नाम (Crop Name) *</label>
              <input 
                type="text" 
                value={newCrop.name}
                onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="उदाहरण: गेहूं, धान, मक्का"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">किस्म (Variety)</label>
              <input 
                type="text" 
                value={newCrop.variety}
                onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="उदाहरण: HD-2967, Pusa Basmati"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">बुवाई की तारीख (Planting Date) *</label>
              <input 
                type="date" 
                value={newCrop.plantingDate}
                onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">क्षेत्रफल (हेक्टेयर) (Area in Hectares) *</label>
              <input 
                type="number" 
                value={newCrop.area}
                onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="उदाहरण: 2.5"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">स्थिति (Status)</label>
              <select 
                value={newCrop.status}
                onChange={(e) => setNewCrop({...newCrop, status: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="growing">उगाई जा रही है (Growing)</option>
                <option value="harvested">कटाई हो गई है (Harvested)</option>
                <option value="planned">योजना बनाई गई है (Planned)</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={() => {
                setIsAddingCrop(false);
                setEditingCropId(null);
                setNewCrop({
                  name: '',
                  variety: '',
                  plantingDate: '',
                  area: '',
                  status: 'growing',
                  healthStatus: 'good'
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              रद्द करें (Cancel)
            </button>
            <button 
              onClick={editingCropId ? handleUpdateCrop : handleAddCrop}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {editingCropId ? 'अपडेट करें (Update)' : 'जोड़ें (Add)'}
            </button>
          </div>
        </div>
      )}

      {crops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Sprout className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">कोई फसल नहीं मिली</h3>
          <p className="text-gray-500 mb-4">आप अभी तक कोई फसल नहीं जोड़ी है। अपनी पहली फसल जोड़ने के लिए "नई फसल" बटन पर क्लिक करें।</p>
          <p className="text-gray-500">No crops found. Click the "Add Crop" button to add your first crop.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {crops.map(crop => (
            <div key={crop.id} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500">
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleCropDetails(crop.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <Sprout className={`h-8 w-8 ${crop.healthStatus === 'warning' ? 'text-yellow-500' : crop.healthStatus === 'danger' ? 'text-red-500' : 'text-green-500'}`} />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{crop.name} <span className="text-gray-500 text-sm">({crop.englishName})</span></h3>
                      <p className="text-gray-600">{crop.variety}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.healthStatus)}`}>
                      {crop.healthStatus === 'good' ? 'स्वस्थ (Healthy)' : 
                       crop.healthStatus === 'warning' ? 'चेतावनी (Warning)' : 
                       crop.healthStatus === 'danger' ? 'खतरा (Danger)' : 
                       'पूर्ण (Completed)'}
                    </span>
                    {expandedCropId === crop.id ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">बुवाई की तारीख</p>
                      <p className="text-sm font-medium">{new Date(crop.plantingDate).toLocaleDateString('hi-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500">क्षेत्रफल</p>
                      <p className="text-sm font-medium">{crop.area} हेक्टेयर</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">अनुमानित उपज</p>
                      <p className="text-sm font-medium">{crop.yieldEstimate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-xs text-gray-500">स्थिति</p>
                      <p className="text-sm font-medium">
                        {crop.status === 'growing' ? 'उगाई जा रही है' : 
                         crop.status === 'harvested' ? 'कटाई हो गई है' : 'योजना बनाई गई है'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedCropId === crop.id && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">अगला कार्य (Next Action)</h4>
                    <p className="text-gray-600">{crop.nextAction}</p>
                  </div>
                  
                  {crop.alerts.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <h4 className="font-medium text-yellow-700 flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 mr-1" />
                        चेतावनियां (Alerts)
                      </h4>
                      <ul className="list-disc pl-5 text-yellow-700">
                        {crop.alerts.map((alert, index) => (
                          <li key={index}>{alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCrop(crop.id);
                        setIsAddingCrop(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center"
                    >
                      <Edit className="h-5 w-5 mr-1" />
                      संपादित करें (Edit)
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCrop(crop.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md flex items-center"
                    >
                      <Trash2 className="h-5 w-5 mr-1" />
                      हटाएं (Delete)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}