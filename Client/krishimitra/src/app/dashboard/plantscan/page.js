'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Leaf, AlertCircle, Check } from 'lucide-react';
import Navbar from '../../../components/NavBar';

const PlantScanPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Mock function to simulate plant scanning
  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        disease: 'पत्ती धब्बा रोग (Leaf Spot Disease)',
        confidence: 92,
        description: 'यह एक आम फंगल रोग है जो पत्तियों पर भूरे या काले धब्बे बनाता है।',
        englishDescription: 'This is a common fungal disease that creates brown or black spots on leaves.',
        treatment: [
          'नीम तेल स्प्रे का उपयोग करें (Use neem oil spray)',
          'प्रभावित पत्तियों को हटा दें (Remove affected leaves)',
          'पौधों के बीच हवा के प्रवाह में सुधार करें (Improve air circulation between plants)'
        ],
        severity: 'मध्यम (Moderate)'
      });
    }, 2000);
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset scan
  const resetScan = () => {
    setScanResult(null);
    setUploadedImage(null);
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      <Navbar activeTab="/dashboard/plantscan" onTabChange={handleTabChange}/>
      
      {/* Desktop Layout with proper spacing for navbar */}
      <div className="md:ml-80 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">पौधा स्कैन (Plant Scan)</h1>
            </div>
            <p className="text-gray-600 mt-1 max-w-3xl">अपने पौधों की बीमारियों का पता लगाएं और उपचार पाएं (Detect plant diseases and get treatments)</p>
          </div>
          
          {/* Page Content */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('camera')}
          className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'camera' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Camera className="inline-block w-4 h-4 mr-2" />
          कैमरा (Camera)
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'upload' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Upload className="inline-block w-4 h-4 mr-2" />
          फोटो अपलोड (Upload Photo)
        </button>
      </div>
      
      {/* Camera Tab */}
      {activeTab === 'camera' && !scanResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8 mb-6 relative">
              <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg flex items-center justify-center h-64">
                {isScanning ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-2"></div>
                    <p className="text-gray-600">स्कैन हो रहा है... (Scanning...)</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">कैमरा एक्सेस की अनुमति दें (Allow camera access)</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${isScanning ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {isScanning ? 'स्कैन हो रहा है... (Scanning...)' : 'पौधे को स्कैन करें (Scan Plant)'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Instructions Section */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="font-medium text-gray-800 mb-4 text-lg">स्कैन कैसे करें (How to scan)</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">1</span>
                  <span>पौधे की प्रभावित पत्ती को स्पष्ट रूप से दिखाएं (Clearly show the affected leaf)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">2</span>
                  <span>अच्छी रोशनी में स्कैन करें (Scan in good lighting)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">3</span>
                  <span>कैमरे को स्थिर रखें (Keep the camera steady)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <h3 className="font-medium text-gray-800 mb-4 text-lg">सुझाव (Tips)</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• पत्ती के दोनों तरफ की तस्वीर लें (Take photos of both sides of the leaf)</li>
                <li>• क्लोज़-अप में स्पष्ट तस्वीर लें (Take clear close-up photos)</li>
                <li>• पृष्ठभूमि साफ रखें (Keep background clean)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Tab */}
      {activeTab === 'upload' && !scanResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8 mb-6">
              {uploadedImage ? (
                <div className="mb-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded plant" 
                    className="max-h-64 mx-auto rounded-lg shadow-md" 
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-2">फोटो अपलोड करें (Upload a photo)</p>
                  <p className="text-gray-400 text-sm">JPG, PNG या HEIC फॉर्मेट (JPG, PNG or HEIC format)</p>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <label className="w-full py-3 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 font-medium text-center transition-colors">
                  फोटो चुनें (Choose Photo)
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                </label>
                
                {uploadedImage && (
                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${isScanning ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    {isScanning ? 'विश्लेषण हो रहा है... (Analyzing...)' : 'फोटो का विश्लेषण करें (Analyze Photo)'}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="font-medium text-gray-800 mb-4 text-lg">अच्छी फोटो के टिप्स (Tips for good photos)</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">1</span>
                  <span>प्रभावित क्षेत्र को क्लोज़-अप में लें (Take close-ups of affected areas)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">2</span>
                  <span>प्राकृतिक प्रकाश का उपयोग करें (Use natural light)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">3</span>
                  <span>छाया से बचें (Avoid shadows)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <h3 className="font-medium text-gray-800 mb-4 text-lg">फोटो गुणवत्ता (Photo Quality)</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• उच्च रिज़ॉल्यूशन वाली तस्वीरें लें (Take high-resolution photos)</li>
                <li>• फोकस स्पष्ट रखें (Keep focus clear)</li>
                <li>• पूरे पत्ते को दिखाएं (Show the entire leaf)</li>
                <li>• कई कोणों से तस्वीरें लें (Take photos from multiple angles)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Scan Results */}
      {scanResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-green-50 p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">स्कैन पूरा हुआ (Scan Complete)</h3>
                    <p className="text-sm text-gray-500">हमने आपके पौधे की समस्या का पता लगा लिया है (We've identified your plant's issue)</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{scanResult.disease}</h3>
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {scanResult.confidence}% विश्वास (confidence)
                    </div>
                    <div className="ml-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {scanResult.severity}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-1">{scanResult.description}</p>
                  <p className="text-gray-500 text-sm">{scanResult.englishDescription}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">अनुशंसित उपचार (Recommended Treatment)</h4>
                  <ul className="space-y-2">
                    {scanResult.treatment.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={resetScan}
                    className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    नया स्कैन (New Scan)
                  </button>
                  <button className="flex-1 py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    विशेषज्ञ से पूछें (Ask Expert)
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">महत्वपूर्ण नोट (Important Note)</h4>
         