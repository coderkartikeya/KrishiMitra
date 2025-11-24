'use client'
import { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, Camera, X, RotateCcw, Leaf, Shield, BookOpen, CheckCircle } from 'lucide-react';

export default function PlantDisease() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [activeTab, setActiveTab] = useState('detection');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const plantTypes = [
    { value: "Tomato", label: "Tomato", icon: "🍅" },
    { value: "Potato", label: "Potato", icon: "🥔" },
    { value: "Pepper", label: "Pepper", icon: "🌶️" },
    { value: "Lettuce", label: "Lettuce", icon: "🥬" },
    { value: "Wheat", label: "Wheat", icon: "🌾" },
    { value: "Rice", label: "Rice", icon: "🌾" },
    { value: "Corn", label: "Corn", icon: "🌽" },
    { value: "Soybean", label: "Soybean", icon: "🫘" }
  ];
  const [selectedPlant, setSelectedPlant] = useState("Tomato");
  
  const plantDiseaseData = {
    "Tomato": [
      {
        class: "Tomato_Target_Spot",
        name: "Target Spot",
        commonlyAffects: "Tomato, Pepper, Eggplant",
        symptoms: "Circular brown spots with concentric rings on leaves, stems, and fruits",
        causes: "Fungal pathogen Alternaria solani, spreads in warm, humid conditions",
        remedies: [
          "Remove infected leaves and debris",
          "Apply copper-based fungicide",
          "Avoid overhead watering",
          "Improve air circulation",
          "Use resistant varieties"
        ],
        treatment: [
          "Copper-based fungicides",
          "Chlorothalonil fungicide",
          "Biological control agents"
        ]
      },
      {
        class: "Tomato_Bacterial_spot",
        name: "Bacterial Leaf Spot",
        commonlyAffects: "Tomato, Pepper, Lettuce",
        symptoms: "Small, dark, water-soaked spots on leaves that enlarge and turn brown with yellow halos",
        causes: "Caused by various species of bacteria, spread by water splash and favored by warm, wet conditions",
        remedies: [
          "Use disease-free seeds and transplants",
          "Practice crop rotation (2-3 years)",
          "Avoid overhead irrigation",
          "Remove and destroy infected plant debris",
          "Apply copper-based bactericides preventatively"
        ],
        treatment: [
          "Copper-based bactericides",
          "Streptomycin (in some regions)",
          "Biological control agents"
        ]
      },
      {
        class: "Tomato_healthy",
        name: "Healthy",
        commonlyAffects: "All plants",
        symptoms: "No visible disease symptoms, normal growth and appearance",
        causes: "Proper care and disease prevention",
        remedies: [
          "Continue regular monitoring",
          "Maintain current care routines",
          "Preventive measures"
        ],
        treatment: [
          "No treatment needed",
          "Continue preventive care"
        ]
      }
    ],
    "Potato": [
      {
        class: "Potato_Early_blight",
        name: "Early Blight",
        commonlyAffects: "Potato, Tomato, Eggplant",
        symptoms: "Dark brown spots with concentric rings, yellowing leaves",
        causes: "Fungal pathogen Alternaria solani, thrives in warm, humid weather",
        remedies: [
          "Apply appropriate fungicide",
          "Practice crop rotation",
          "Remove affected leaves",
          "Improve air circulation"
        ],
        treatment: [
          "Chlorothalonil fungicide",
          "Copper-based fungicides",
          "Biological control"
        ]
      },
      {
        class: "Potato_healthy",
        name: "Healthy",
        commonlyAffects: "All plants",
        symptoms: "No visible disease symptoms",
        causes: "Proper care and prevention",
        remedies: [
          "Keep monitoring your crop",
          "Maintain soil and moisture levels"
        ],
        treatment: [
          "No treatment needed"
        ]
      }
    ]
  };

  const diseaseLookup = Object.entries(plantDiseaseData).reduce((acc, [plant, diseases]) => {
    acc[plant] = diseases.reduce((map, disease, index) => {
      map[disease.class] = disease;
      map[index] = disease;
      return map;
    }, {});
    return acc;
  }, {});

  const formatDiseaseName = (name = '') => {
    if (!name) return 'Unknown Disease';
    return name
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const getDiseaseDetails = (plant, key) => {
    if (!plant || key === undefined || key === null) return null;
    const lookup = diseaseLookup[plant];
    if (!lookup) return null;
    return lookup[key] || lookup[String(key)] || null;
  };

  const formatConfidence = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return 0;
    }
    return Math.min(100, Math.max(0, numeric));
  };

  // Camera functionality
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions or try uploading a file instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setFile(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    setResult(null);
    
    if (selectedFile) {
      if (!selectedFile.type.includes('image')) {
        setError("Please upload an image file");
        setFile(null);
        setPreview(null);
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setError("Please select an image first");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setResult(null);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("plant", selectedPlant);
  
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }
      
      const diseaseKey = data.disease_name ?? data.predicted_class;
      const diseaseData = getDiseaseDetails(selectedPlant, diseaseKey);
      const formattedName = diseaseData?.name || formatDiseaseName(data.disease_name);
      const diseaseClass = data.disease_name || diseaseData?.class || 'Unknown';
      const recommendations = Array.isArray(data.remedies) && data.remedies.length > 0
        ? data.remedies
        : diseaseData?.remedies || [];
      const treatments = diseaseData?.treatment || diseaseData?.treatments || [];
      const isHealthyResult = (diseaseClass || '').toLowerCase().includes('healthy');
      
      setResult({
        plantType: selectedPlant,
        disease: formattedName,
        diseaseClass,
        commonlyAffects: diseaseData?.commonlyAffects || 'Information unavailable for this disease.',
        symptoms: diseaseData?.symptoms || 'Detailed symptom information will be available soon.',
        causes: diseaseData?.causes || 'Detailed cause information will be available soon.',
        confidence: typeof data.confidence === 'number' ? Number(data.confidence.toFixed(2)) : data.confidence,
        recommendations,
        treatments,
        severity: data.severity || (isHealthyResult ? 'none' : 'moderate'),
        isHealthy: isHealthyResult
      });
    } catch (err) {
      console.error(err);
      setError("Error in disease detection: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    stopCamera();
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const confidenceValue = formatConfidence(result?.confidence);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plant Disease Detection</h1>
              <p className="text-gray-600 mt-1">Upload plant images for AI-powered disease analysis</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('detection')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'detection'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Camera className="w-5 h-5" />
              Disease Detection
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'library'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Disease Library
            </button>
            <button
              onClick={() => setActiveTab('practices')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'practices'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-5 h-5" />
              Safe Practices
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'detection' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Plant Image</h2>
              <p className="text-gray-600 mb-6">Take a clear photo of the affected plant part (leaf, stem, fruit) and upload it for analysis.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plant Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Plant Type</label>
                  <select 
                    value={selectedPlant}
                    onChange={(e) => setSelectedPlant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  >
                    {plantTypes.map((plant) => (
                      <option key={plant.value} value={plant.value}>
                        {plant.icon} {plant.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Camera Interface */}
                {showCamera && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover rounded"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Interface */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="leaf-image"
                    accept="image/*"
                  />
                  <label htmlFor="leaf-image" className="cursor-pointer">
                    {preview ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <img src={preview} alt="Leaf preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                          <div className="absolute top-2 right-2">
                            <button
                              type="button"
                              onClick={resetForm}
                              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-sm transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Image selected: {file?.name}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">Drag and drop image here or click to browse</p>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <Camera className="w-5 h-5" />
                          Take Photo
                        </button>
                      </div>
                    )}
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!file || isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                    !file || isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 shadow-sm'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Detect Disease'
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Results Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {result ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Disease Detection Result</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      result.isHealthy 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.isHealthy ? 'Healthy' : 'Detected'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Disease Name */}
                    <div>
                      <h4 className={`text-2xl font-bold ${
                        result.isHealthy ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.disease}
                      </h4>
                      <p className="text-gray-600 mt-1">Commonly affects: {result.commonlyAffects}</p>
                    </div>

                    {/* Confidence Level */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                        <span className="text-sm font-medium text-gray-900">{confidenceValue}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            result.isHealthy ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${confidenceValue}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Symptoms</h5>
                      <p className="text-gray-700 text-sm leading-relaxed">{result.symptoms}</p>
                    </div>

                    {/* Causes */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Causes</h5>
                      <p className="text-gray-700 text-sm leading-relaxed">{result.causes}</p>
                    </div>

                    {/* Prevention Methods */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Prevention Methods</h5>
                      {result.recommendations?.length ? (
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">No specific prevention methods available for this detection.</p>
                      )}
                    </div>

                    {/* Safe Treatment Options */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Safe Treatment Options</h5>
                      {result.treatments?.length ? (
                        <ul className="space-y-2">
                          {result.treatments.map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <Leaf className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">No specific treatments available for this condition.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
                  <p className="text-gray-500">Upload a plant image to get started with disease detection</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Disease Library</h2>
            <p className="text-gray-600">Comprehensive database of plant diseases and their treatments coming soon...</p>
          </div>
        )}

        {activeTab === 'practices' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Safe Practices</h2>
            <p className="text-gray-600">Best practices for plant care and disease prevention coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
