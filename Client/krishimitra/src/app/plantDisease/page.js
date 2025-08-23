'use client'
import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, RefreshCw, AlertTriangle, 
  CheckCircle, Info, ChevronDown, ChevronUp, 
  Leaf, Droplets, Sun, Wind, Shield
} from 'lucide-react';

export default function PlantDisease() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('treatment');
  const [expandedSection, setExpandedSection] = useState(null);
  const fileInputRef = useRef(null);

  // Disease database with treatments and prevention measures
  const diseaseDatabase = {
    'late_blight': {
      name: 'आलू का झुलसा रोग (Late Blight)',
      description: 'यह फंगस फाइटोफ्थोरा इनफेस्टन्स के कारण होता है। इससे पत्तियों पर भूरे रंग के धब्बे बनते हैं और फसल को गंभीर नुकसान हो सकता है।',
      englishDescription: 'Caused by the fungus Phytophthora infestans. It creates brown lesions on leaves and can cause severe crop damage.',
      treatment: [
        'कॉपर आधारित फफूंदनाशक का छिड़काव करें',
        'प्रभावित पत्तियों को हटा दें और नष्ट कर दें',
        'मैंकोजेब या क्लोरोथैलोनिल का उपयोग करें'
      ],
      englishTreatment: [
        'Apply copper-based fungicides',
        'Remove and destroy infected plants',
        'Use Mancozeb or Chlorothalonil'
      ],
      prevention: [
        'प्रतिरोधी किस्मों का उपयोग करें',
        'फसल चक्र अपनाएं',
        'पौधों के बीच पर्याप्त हवा का संचार सुनिश्चित करें',
        'सिंचाई के दौरान पत्तियों को गीला होने से बचाएं'
      ],
      englishPrevention: [
        'Use resistant varieties',
        'Practice crop rotation',
        'Ensure adequate air circulation between plants',
        'Avoid wetting leaves during irrigation'
      ],
      severity: 'high',
      image: '/images/late_blight.jpg'
    },
    'powdery_mildew': {
      name: 'चूर्णिल फफूंदी (Powdery Mildew)',
      description: 'यह फंगल रोग पत्तियों, तनों और फलों पर सफेद पाउडर जैसी परत बनाता है। यह पौधे की वृद्धि को धीमा कर देता है और उपज को कम कर सकता है।',
      englishDescription: 'This fungal disease creates a white powdery layer on leaves, stems, and fruits. It slows plant growth and can reduce yield.',
      treatment: [
        'नीम तेल या पोटेशियम बाइकार्बोनेट स्प्रे का उपयोग करें',
        'सल्फर आधारित फफूंदनाशक लगाएं',
        'दूध और पानी का मिश्रण (1:10) स्प्रे करें'
      ],
      englishTreatment: [
        'Use neem oil or potassium bicarbonate spray',
        'Apply sulfur-based fungicides',
        'Spray milk and water mixture (1:10)'
      ],
      prevention: [
        'पौधों के बीच उचित दूरी बनाए रखें',
        'प्रतिरोधी किस्मों का चयन करें',
        'ड्रिप सिंचाई का उपयोग करें',
        'स्वस्थ बीज और रोपण सामग्री का उपयोग करें'
      ],
      englishPrevention: [
        'Maintain proper spacing between plants',
        'Select resistant varieties',
        'Use drip irrigation',
        'Use healthy seeds and planting material'
      ],
      severity: 'medium',
      image: '/images/powdery_mildew.jpg'
    },
    'leaf_spot': {
      name: 'पत्ती धब्बा रोग (Leaf Spot)',
      description: 'यह विभिन्न फंगी के कारण होता है और पत्तियों पर भूरे या काले धब्बे बनाता है। गंभीर मामलों में, पत्तियां पीली हो सकती हैं और गिर सकती हैं।',
      englishDescription: 'Caused by various fungi, it creates brown or black spots on leaves. In severe cases, leaves may yellow and fall off.',
      treatment: [
        'कॉपर ऑक्सीक्लोराइड या मैंकोजेब का छिड़काव करें',
        'प्रभावित पत्तियों को हटा दें',
        'नीम आधारित उत्पादों का उपयोग करें'
      ],
      englishTreatment: [
        'Spray copper oxychloride or mancozeb',
        'Remove affected leaves',
        'Use neem-based products'
      ],
      prevention: [
        'ओवरहेड सिंचाई से बचें',
        'फसल अवशेषों को खेत से हटा दें',
        'फसल चक्र अपनाएं',
        'पौधों के बीच हवा का संचार बढ़ाएं'
      ],
      englishPrevention: [
        'Avoid overhead irrigation',
        'Remove crop debris from the field',
        'Practice crop rotation',
        'Increase air circulation between plants'
      ],
      severity: 'medium',
      image: '/images/leaf_spot.jpg'
    },
    'healthy': {
      name: 'स्वस्थ पौधा (Healthy Plant)',
      description: 'आपका पौधा स्वस्थ दिखाई दे रहा है और कोई रोग के लक्षण नहीं हैं।',
      englishDescription: 'Your plant appears healthy with no signs of disease.',
      treatment: [
        'नियमित देखभाल जारी रखें',
        'उचित पोषण और सिंचाई प्रदान करें'
      ],
      englishTreatment: [
        'Continue regular care',
        'Provide proper nutrition and irrigation'
      ],
      prevention: [
        'नियमित निगरानी करें',
        'स्वच्छ खेती प्रथाओं का पालन करें',
        'संतुलित उर्वरक का उपयोग करें',
        'समय पर कीट प्रबंधन करें'
      ],
      englishPrevention: [
        'Monitor regularly',
        'Follow clean farming practices',
        'Use balanced fertilizers',
        'Perform timely pest management'
      ],
      severity: 'none',
      image: '/images/healthy_plant.jpg'
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setResult(null); // Clear previous results
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current.click();
  };

  const analyzeImage = () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call to disease detection model
    setTimeout(() => {
      // For demo purposes, randomly select a disease or healthy status
      const diseases = Object.keys(diseaseDatabase);
      const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
      
      setResult({
        disease: detectedDisease,
        confidence: Math.floor(Math.random() * 30) + 70, // Random confidence between 70-99%
        ...diseaseDatabase[detectedDisease]
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setImage(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-orange-600';
      case 'none': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center mb-6">
        <Leaf className="mr-2 text-green-600" />
        पौधा रोग पहचान (Plant Disease Detection)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image Upload and Preview */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-100">
          <h2 className="text-xl font-semibold mb-4">छवि अपलोड करें (Upload Image)</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              अपने पौधे की छवि अपलोड करें या कैमरे से कैप्चर करें। हम आपके पौधे के स्वास्थ्य का विश्लेषण करेंगे और किसी भी रोग की पहचान करेंगे।
              <br />
              <span className="text-sm text-gray-500">
                Upload or capture an image of your plant. We'll analyze your plant's health and identify any diseases.
              </span>
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload className="mr-2 h-5 w-5" />
                अपलोड करें (Upload)
              </button>
              
              <button 
                onClick={handleCameraCapture}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Camera className="mr-2 h-5 w-5" />
                कैमरा (Camera)
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          
          {previewUrl && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">पूर्वावलोकन (Preview)</h3>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
                <img 
                  src={previewUrl} 
                  alt="Plant preview" 
                  className="w-full h-auto max-h-80 object-contain rounded-lg"
                />
                <button 
                  onClick={resetAnalysis}
                  className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                >
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
          
          {previewUrl && !isAnalyzing && !result && (
            <button 
              onClick={analyzeImage}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Leaf className="mr-2 h-5 w-5" />
              विश्लेषण करें (Analyze)
            </button>
          )}
          
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-3"></div>
              <p className="text-gray-600">विश्लेषण हो रहा है... (Analyzing...)</p>
            </div>
          )}
        </div>
        
        {/* Right Column - Results and Recommendations */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-100">
          {!result && !isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <Leaf className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">पौधे का विश्लेषण करने के लिए तैयार</h3>
              <p className="text-gray-500 max-w-md">
                अपने पौधे की छवि अपलोड करें और हम आपको बताएंगे कि क्या कोई रोग है और आगे क्या करना है।
                <br /><br />
                Upload an image of your plant and we'll tell you if there's any disease and what to do next.
              </p>
            </div>
          ) : result ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{result.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className={`font-medium ${getSeverityColor(result.severity)}`}>
                      {result.severity === 'high' ? 'उच्च गंभीरता (High Severity)' : 
                       result.severity === 'medium' ? 'मध्यम गंभीरता (Medium Severity)' : 
                       result.severity === 'low' ? 'कम गंभीरता (Low Severity)' : 
                       'स्वस्थ (Healthy)'}
                    </span>
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                      {result.confidence}% विश्वास (Confidence)
                    </span>
                  </div>
                </div>
                {result.severity !== 'none' && (
                  <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  </div>
                )}
                {result.severity === 'none' && (
                  <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div 
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSection('description')}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-500" />
                      विवरण (Description)
                    </h3>
                    {expandedSection === 'description' ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                  {expandedSection === 'description' && (
                    <div className="mt-3 text-gray-600">
                      <p className="mb-2">{result.description}</p>
                      <p className="text-sm text-gray-500">{result.englishDescription}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === 'treatment' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-green-600'}`}
                    onClick={() => setActiveTab('treatment')}
                  >
                    उपचार (Treatment)
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === 'prevention' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-green-600'}`}
                    onClick={() => setActiveTab('prevention')}
                  >
                    रोकथाम (Prevention)
                  </button>
                </div>
                
                <div className="mt-4">
                  {activeTab === 'treatment' && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                        अनुशंसित उपचार (Recommended Treatment)
                      </h3>
                      <ul className="space-y-2">
                        {result.treatment.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-sm text-gray-500">
                        <h4 className="font-medium mb-2">English:</h4>
                        <ul className="space-y-1 list-disc pl-5">
                          {result.englishTreatment.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'prevention' && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-purple-500" />
                        भविष्य में रोकथाम (Future Prevention)
                      </h3>
                      <ul className="space-y-2">
                        {result.prevention.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-sm text-gray-500">
                        <h4 className="font-medium mb-2">English:</h4>
                        <ul className="space-y-1 list-disc pl-5">
                          {result.englishPrevention.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={resetAnalysis}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                नया विश्लेषण करें (New Analysis)
              </button>
            </div>
          ) : null}
        </div>
      </div>
      
      {/* How to Use Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6 border-2 border-blue-100">
        <h2 className="text-xl font-semibold mb-4">कैसे उपयोग करें (How to Use)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">1. छवि अपलोड करें</h3>
            <p className="text-gray-600 text-sm">अपने पौधे की स्पष्ट छवि अपलोड करें या कैमरे से कैप्चर करें</p>
            <p className="text-gray-500 text-xs mt-1">Upload or capture a clear image of your plant</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">2. विश्लेषण करें</h3>
            <p className="text-gray-600 text-sm">"विश्लेषण करें" बटन पर क्लिक करें और हमारा AI आपके पौधे का निदान करेगा</p>
            <p className="text-gray-500 text-xs mt-1">Click "Analyze" and our AI will diagnose your plant</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-lg">
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <Droplets className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">3. उपचार प्राप्त करें</h3>
            <p className="text-gray-600 text-sm">विस्तृत उपचार और रोकथाम के सुझाव प्राप्त करें</p>
            <p className="text-gray-500 text-xs mt-1">Get detailed treatment and prevention suggestions</p>
          </div>
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start">
          <div className="bg-yellow-100 p-2 rounded-full mr-3">
            <Info className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">सर्वोत्तम परिणामों के लिए सुझाव (Tips for Best Results)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• प्रभावित पत्तियों या तनों की स्पष्ट, करीबी तस्वीरें लें</li>
              <li>• अच्छे प्रकाश में छवियां लें</li>
              <li>• कई कोणों से छवियां लें यदि आप अनिश्चित हैं</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              Take clear, close-up photos of affected leaves or stems • Capture images in good lighting • Take images from multiple angles if unsure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}