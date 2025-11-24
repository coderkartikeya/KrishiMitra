'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload,Sprout ,Droplets ,ChevronRight , AlertCircle, Camera, X, RotateCcw, Leaf, Shield, BookOpen,Bug , CheckCircle } from 'lucide-react';
import Navbar from '../../../components/NavBar';

const PlantScanPage = () => {
  const router = useRouter();
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
        remedies: [
          "Remove infected leaves",
          "Apply copper-based fungicide",
          "Avoid overhead watering"
        ]
      },
      {
        class: "Tomato_Tomato_mosaic_virus",
        remedies: [
          "Remove and destroy infected plants",
          "Disinfect tools regularly",
          "Avoid smoking near plants"
        ]
      },
      {
        class: "Tomato_Tomato_YellowLeaf_Curl_Virus",
        remedies: [
          "Control whitefly population",
          "Use resistant varieties",
          "Remove infected plants"
        ]
      },
      {
        class: "Tomato_Bacterial_spot",
        remedies: [
          "Avoid overhead irrigation",
          "Use copper-based sprays",
          "Rotate crops yearly"
        ]
      },
      {
        class: "Tomato_Early_blight",
        remedies: [
          "Apply fungicide",
          "Avoid wetting the foliage",
          "Remove infected debris"
        ]
      },
      {
        class: "Tomato_healthy",
        remedies: [
          "Continue regular monitoring",
          "Maintain current care routines"
        ]
      },
      {
        class: "Tomato_Late_blight",
        remedies: [
          "Use resistant varieties",
          "Remove infected plants immediately",
          "Apply fungicides preventively"
        ]
      },
      {
        class: "Tomato_Leaf_Mold",
        remedies: [
          "Improve air circulation",
          "Avoid overhead watering",
          "Apply sulfur-based fungicide"
        ]
      },
      {
        class: "Tomato_Septoria_leaf_spot",
        remedies: [
          "Remove infected leaves",
          "Water at soil level",
          "Apply fungicide with chlorothalonil"
        ]
      },
      {
        class: "Tomato_Spider_mites_Two_spotted_spider_mite",
        remedies: [
          "Spray neem oil or insecticidal soap",
          "Keep humidity high",
          "Use predatory mites"
        ]
      }
    ],
    "Potato": [
      {
        class: "Potato_Early_blight",
        remedies: [
          "Apply appropriate fungicide",
          "Practice crop rotation",
          "Remove affected leaves"
        ]
      },
      {
        class: "Potato_healthy",
        remedies: [
          "Keep monitoring your crop",
          "Maintain soil and moisture levels"
        ]
      },
      {
        class: "Potato_Late_blight",
        remedies: [
          "Destroy infected plants",
          "Use certified disease-free seeds",
          "Apply copper fungicide early"
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
      setError("Please take a photo with camera or upload an image first");
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
      // console.log(data);

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      const diseaseKey = data.disease_name ?? data.predicted_class;
      
      const diseaseData = getDiseaseDetails(selectedPlant, diseaseKey);
      console.log(diseaseData);
      const formattedName = diseaseData?.class || formatDiseaseName(data.disease_name);
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

  const handleTabChange = (tabId) => {
    // Direct routing based on the tabId which contains the full path
    if (tabId.startsWith('/dashboard')) {
      router.push(tabId);
    } else {
      // Fallback for any legacy routes
      switch (tabId) {
        case 'home':
          router.push('/');
          break;
        case 'crops':
          router.push('/crops');
          break;
        case 'scan':
          router.push('/plantDisease');
          break;
        case 'market':
          router.push('/market');
          break;
        case 'community':
          router.push('/community');
          break;
        case 'profile':
          router.push('/profile');
          break;
        default:
          router.push('/dashboard');
          break;
      }
    }
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
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      <Navbar activeTab="/dashboard/plantscan" onTabChange={handleTabChange}/>
      
      {/* Desktop Layout with proper spacing for navbar */}
      <div className="md:ml-80 pt-16 md:pt-0 pb-20">
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
      
                    {/* Image Input Options */}
                    <div className="space-y-4">
                      {/* Camera Option */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                        <div className="flex flex-col items-center">
                          <Camera className="h-12 w-12 text-blue-500 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Take Photo with Camera</h3>
                          <p className="text-gray-500 mb-4">Use your device camera to capture a clear photo of the plant</p>
                          <button
                            type="button"
                            onClick={startCamera}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            <Camera className="w-5 h-5" />
                            Open Camera
                          </button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">or</span>
                </div>
                </div>
              
                      {/* Upload Option */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input 
                    type="file" 
                          onChange={handleFileChange}
                          className="hidden"
                          id="leaf-image"
                    accept="image/*" 
                        />
                        <label htmlFor="leaf-image" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload from Device</h3>
                            <p className="text-gray-500 mb-4">Choose an existing photo from your device</p>
                            <div className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                              Choose File
              </div>
            </div>
                        </label>
          </div>
            </div>
            
                    {/* Image Preview */}
                    {preview && (
                      <div className="mt-4">
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
                        <p className="text-sm text-gray-600 text-center mt-2">
                          {file?.name ? `Selected: ${file.name}` : 'Camera capture'}
                        </p>
        </div>
      )}
      
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
                        file ? 'Analyze Plant Disease' : 'Take Photo or Upload Image First'
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
                
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search diseases..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <option value="">All Plants</option>
                      <option value="tomato">Tomato</option>
                      <option value="potato">Potato</option>
                      <option value="rice">Rice</option>
                      <option value="wheat">Wheat</option>
                    </select>
                  </div>
                </div>
                
                {/* Disease Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Tomato Late Blight */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src="https://www.gardeningknowhow.com/wp-content/uploads/2019/05/late-blight.jpg" 
                        alt="Tomato Late Blight" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Severe</div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Tomato Late Blight</h3>
                      <p className="text-sm text-gray-500 mb-3">Phytophthora infestans</p>
                      <p className="text-sm text-gray-700 mb-4">A destructive disease that affects tomatoes and potatoes, causing rapid plant death.</p>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Potato Early Blight */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src="https://extension.umn.edu/sites/extension.umn.edu/files/early%20blight.jpg" 
                        alt="Potato Early Blight" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Moderate</div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Potato Early Blight</h3>
                      <p className="text-sm text-gray-500 mb-3">Alternaria solani</p>
                      <p className="text-sm text-gray-700 mb-4">Common fungal disease causing target-like spots on lower leaves.</p>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Rice Blast */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src="https://www.plantmanagementnetwork.org/img/elements/RiceBlast.jpg" 
                        alt="Rice Blast" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">High Risk</div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Rice Blast</h3>
                      <p className="text-sm text-gray-500 mb-3">Magnaporthe oryzae</p>
                      <p className="text-sm text-gray-700 mb-4">One of the most destructive rice diseases worldwide.</p>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'practices' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Safe Practices</h2>
                
                {/* Practices Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-green-800">Irrigation</span>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-800">Crop Rotation</span>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Bug className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-amber-800">Pest Management</span>
                  </div>
                </div>
                
                {/* Best Practices List */}
                <div className="space-y-6">
                  {/* Irrigation Practices */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-green-800 flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        Irrigation Best Practices
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Water at the base of plants</p>
                            <p className="text-sm text-gray-600">Avoid wetting foliage to reduce fungal disease risk</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Water deeply but infrequently</p>
                            <p className="text-sm text-gray-600">Encourages deeper root growth and drought resistance</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Water early in the morning</p>
                            <p className="text-sm text-gray-600">Allows foliage to dry during the day, reducing disease risk</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Crop Rotation */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                        <Sprout className="w-4 h-4" />
                        Crop Rotation Strategies
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Rotate crop families</p>
                            <p className="text-sm text-gray-600">Don't plant the same family in the same location for 3-4 years</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Plan rotations by nutrient needs</p>
                            <p className="text-sm text-gray-600">Follow heavy feeders with nitrogen-fixing crops</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Pest Management */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-amber-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                        <Bug className="w-4 h-4" />
                        Integrated Pest Management
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Monitor plants regularly</p>
                            <p className="text-sm text-gray-600">Early detection allows for less invasive treatments</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Use physical barriers</p>
                            <p className="text-sm text-gray-600">Row covers, netting, and collars can prevent pest access</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantScanPage;