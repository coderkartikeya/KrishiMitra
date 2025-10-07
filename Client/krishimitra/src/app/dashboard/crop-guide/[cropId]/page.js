'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LightbulbIcon ,ArrowRight ,ArrowLeft, Play, Download, Calendar, MapPin, Droplets, Sun, AlertCircle, CheckCircle, Leaf, Shield, BookOpen, Camera, Upload,Bug,Scissors,Archive ,Thermometer ,Clock  } from 'lucide-react';
import Navbar from '../../../../components/NavBar';
import cropGuidesData from '../../../../data/cropGuides.json';

const CropDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cropId = params.cropId;
    if (cropId && cropGuidesData.crops[cropId]) {
      setSelectedCrop(cropGuidesData.crops[cropId]);
    }
    setLoading(false);
  }, [params.cropId]);

  const handleTabChange = (tabId) => {
    if (tabId.startsWith('/dashboard')) {
      router.push(tabId);
    } else {
      switch (tabId) {
        case 'home':
          router.push('/');
          break;
        case 'crops':
          router.push('/crops');
          break;
        case 'scan':
          router.push('/plantscan');
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

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
        <Navbar activeTab="/dashboard/crop-guide" onTabChange={handleTabChange} />
        <div className="md:ml-80 pt-16 md:pt-0 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!selectedCrop) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
        <Navbar activeTab="/dashboard/crop-guide" onTabChange={handleTabChange} />
        <div className="md:ml-80 pt-16 md:pt-0 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">फसल नहीं मिली</h2>
            <p className="text-gray-600 mb-4">अनुरोधित फसल गाइड उपलब्ध नहीं है।</p>
            <button
              onClick={() => router.push('/dashboard/crop-guide')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              फसल गाइड पर वापस जाएं
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'अवलोकन', icon: BookOpen },
    { id: 'cultivation', label: 'खेती', icon: Leaf },
    { id: 'pest-disease', label: 'कीट और रोग', icon: Shield },
    { id: 'harvest', label: 'कटाई', icon: Sun },
    { id: 'videos', label: 'वीडियो', icon: Play }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      <Navbar activeTab="/dashboard/crop-guide" onTabChange={handleTabChange} />
      
      <div className="md:ml-80 pt-16 md:pt-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard/crop-guide')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  वापस
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedCrop.icon}</div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{selectedCrop.name}</h1>
                    <p className="text-gray-600">{selectedCrop.scientificName}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-8 border-b">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">मूलभूत जानकारी</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">उगाने का मौसम</p>
                      <p className="font-medium text-gray-900">{selectedCrop.growingSeason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sun className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-500">जलवायु</p>
                      <p className="font-medium text-gray-900">{selectedCrop.climate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">मिट्टी का प्रकार</p>
                      <p className="font-medium text-gray-900">{selectedCrop.soilType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">पानी की आवश्यकता</p>
                      <p className="font-medium text-gray-900">{selectedCrop.waterRequirement}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Leaf className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">अपेक्षित उत्पादन</p>
                      <p className="font-medium text-gray-900">{selectedCrop.yield}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">अवधि</p>
                      <p className="font-medium text-gray-900">{selectedCrop.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">विवरण</h2>
                <p className="text-gray-700 leading-relaxed">{selectedCrop.description}</p>
              </div>

              {/* Varieties */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">अनुशंसित किस्में</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCrop.varieties.map((variety, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">{variety.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{variety.description}</p>
                      <div className="space-y-1">
                        <p className="text-sm"><span className="font-medium">उत्पादन:</span> {variety.yield}</p>
                        <p className="text-sm"><span className="font-medium">अवधि:</span> {variety.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economics */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">आर्थिकी</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">खेती की लागत</p>
                    <p className="text-lg font-bold text-red-600">{selectedCrop.economics.costOfCultivation}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">अपेक्षित आय</p>
                    <p className="text-lg font-bold text-green-600">{selectedCrop.economics.expectedIncome}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">शुद्ध लाभ</p>
                    <p className="text-lg font-bold text-blue-600">{selectedCrop.economics.netProfit}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">ब्रेक-ईवन उत्पादन</p>
                    <p className="text-lg font-bold text-yellow-600">{selectedCrop.economics.breakEvenYield}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content would go here - keeping it simple for now */}
          {activeTab === 'cultivation' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">खेती विधि</h2>
              
              {/* Cultivation Steps */}
              <div className="space-y-8">
                {/* Land Preparation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">1</div>
                    भूमि तैयारी
                  </h3>
                  <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                    <ul className="space-y-3">
                      {selectedCrop.cultivation && selectedCrop.cultivation.landPreparation ? (
                        selectedCrop.cultivation.landPreparation.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{step}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">गहरी जुताई करें (8-10 इंच)</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Sowing/Planting */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">2</div>
                    बुवाई / रोपण
                  </h3>
                  <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                    <ul className="space-y-3">
                      {selectedCrop.cultivation && selectedCrop.cultivation.sowing ? (
                        selectedCrop.cultivation.sowing.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{step}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">प्रमाणित बीज का उपयोग करें</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Irrigation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">3</div>
                    सिंचाई
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <ul className="space-y-3">
                      {selectedCrop.cultivation && selectedCrop.cultivation.irrigation ? (
                        selectedCrop.cultivation.irrigation.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{step}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">महत्वपूर्ण चरणों में पर्याप्त सिंचाई सुनिश्चित करें</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Fertilizer Application */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">4</div>
                    उर्वरक प्रयोग
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                    <ul className="space-y-3">
                      {selectedCrop.cultivation && selectedCrop.cultivation.fertilizer ? (
                        selectedCrop.cultivation.fertilizer.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{step}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">मिट्टी परीक्षण के आधार पर उर्वरक का प्रयोग करें</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Weed Management */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">5</div>
                    खरपतवार प्रबंधन
                  </h3>
                  <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                    <ul className="space-y-3">
                      {selectedCrop.cultivation && selectedCrop.cultivation.weedManagement ? (
                        selectedCrop.cultivation.weedManagement.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{step}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">नियमित निराई-गुड़ाई करें</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pest-disease' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">कीट और रोग प्रबंधन</h2>
              
              <div className="space-y-8">
                {/* Common Pests */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-amber-600" />
                    सामान्य कीट
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCrop.pestManagement && selectedCrop.pestManagement.commonPests ? (
                      selectedCrop.pestManagement.commonPests.map((pest, index) => (
                        <div key={index} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <h4 className="font-medium text-amber-800 mb-2">{pest.name}</h4>
                          <p className="text-sm text-gray-700 mb-3">{pest.description}</p>
                          <div>
                            <h5 className="text-xs font-semibold uppercase text-gray-500 mb-1">नियंत्रण उपाय</h5>
                            <ul className="space-y-1">
                              {pest.control.map((method, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <span>{method}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <h4 className="font-medium text-amber-800 mb-2">एफिड्स (चेपा)</h4>
                          <p className="text-sm text-gray-700 mb-3">छोटे, हरे या काले रंग के कीट जो पौधों के रस को चूसते हैं और विकास को प्रभावित करते हैं।</p>
                          <div>
                            <h5 className="text-xs font-semibold uppercase text-gray-500 mb-1">नियंत्रण उपाय</h5>
                            <ul className="space-y-1">
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>नीम आधारित कीटनाशकों का छिड़काव</span>
                              </li>
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>लेडीबग जैसे प्राकृतिक शिकारियों को प्रोत्साहित करें</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <h4 className="font-medium text-amber-800 mb-2">तना छेदक</h4>
                          <p className="text-sm text-gray-700 mb-3">लार्वा जो तने में छेद करके अंदर प्रवेश करते हैं और पौधे को नुकसान पहुंचाते हैं।</p>
                          <div>
                            <h5 className="text-xs font-semibold uppercase text-gray-500 mb-1">नियंत्रण उपाय</h5>
                            <ul className="space-y-1">
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>प्रभावित तनों को काटकर नष्ट करें</span>
                              </li>
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>उचित कीटनाशकों का प्रयोग करें</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Common Diseases */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    सामान्य रोग
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCrop.pestManagement && selectedCrop.pestManagement.commonDiseases ? (
                      selectedCrop.pestManagement.commonDiseases.map((disease, index) => (
                        <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <h4 className="font-medium text-red-800 mb-2">{disease.name}</h4>
                          <p className="text-sm text-gray-700 mb-3">{disease.description}</p>
                          <div>
                            <h5 className="text-xs font-semibold uppercase text-gray-500 mb-1">नियंत्रण उपाय</h5>
                            <ul className="space-y-1">
                              {disease.control.map((method, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span>{method}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <h4 className="font-medium text-red-800 mb-2">पाउडरी मिल्ड्यू</h4>
                          <p className="text-sm text-gray-700 mb-3">पत्तियों पर सफेद पाउडर जैसी परत दिखाई देती है, जिससे पौधे की वृद्धि प्रभावित होती है।</p>
                          <div>
                            <h5 className="text-xs font-semibold uppercase text-gray-500 mb-1">नियंत्रण उपाय</h5>
                            <ul className="space-y-1">
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>उचित फंगीसाइड का छिड़काव</span>
                              </li>
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>पौधों के बीच पर्याप्त हवा का संचार सुनिश्चित करें</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <h4 className="font-medium text-red-800 mb-2">ब्लास्ट</h4>
                          <p className="text-sm text-gray-700 mb-3">पत्तियों पर भूरे या काले धब्बे दिखाई देते हैं, जो बाद में बड़े हो जाते हैं।</p>
                          <div>
                            <h5 className="text-xs font-semibold uppercase text-gray-500 mb-1">नियंत्रण उपाय</h5>
                            <ul className="space-y-1">
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>रोग प्रतिरोधी किस्मों का उपयोग</span>
                              </li>
                              <li className="text-sm flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>संतुलित उर्वरक प्रबंधन</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Integrated Pest Management */}
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">एकीकृत कीट प्रबंधन (IPM)</h3>
                  <p className="text-blue-700 mb-4">
                    एकीकृत कीट प्रबंधन एक समग्र दृष्टिकोण है जो कीटों और रोगों को नियंत्रित करने के लिए विभिन्न तकनीकों का उपयोग करता है, 
                    जिससे रासायनिक कीटनाशकों पर निर्भरता कम होती है और पर्यावरण पर प्रभाव कम होता है।
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">फसल चक्र अपनाएं</p>
                        <p className="text-sm text-gray-600">एक ही स्थान पर लगातार एक ही फसल न उगाएं</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">प्राकृतिक शत्रुओं को प्रोत्साहित करें</p>
                        <p className="text-sm text-gray-600">लेडीबग, मकड़ियां और परभक्षी कीड़े कीटों को नियंत्रित करने में मदद करते हैं</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">नियमित निगरानी करें</p>
                        <p className="text-sm text-gray-600">कीटों और रोगों की शुरुआती पहचान के लिए फसल का नियमित निरीक्षण करें</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'harvest' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">कटाई और भंडारण</h2>
              
              <div className="space-y-8">
                {/* Harvesting Section */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-green-600" />
                    कटाई की विधि
                  </h3>
                  
                  <div className="bg-green-50 rounded-lg p-5 border border-green-200 mb-6">
                    {selectedCrop.harvest && selectedCrop.harvest.method ? (
                      <div className="space-y-4">
                        <p className="text-gray-700">{selectedCrop.harvest.method}</p>
                        
                        {selectedCrop.harvest.indicators && (
                          <div>
                            <h4 className="text-base font-medium text-gray-800 mb-2">कटाई के संकेत</h4>
                            <ul className="space-y-2">
                              {selectedCrop.harvest.indicators.map((indicator, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{indicator}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          फसल की कटाई सही समय पर करना महत्वपूर्ण है। अधिकतम उपज और गुणवत्ता के लिए निम्नलिखित संकेतों का ध्यान रखें।
                        </p>
                        
                        <div>
                          <h4 className="text-base font-medium text-gray-800 mb-2">कटाई के संकेत</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">पौधे का रंग पीला होना शुरू हो जाता है</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">बीज या फल पूरी तरह से विकसित हो गए हैं</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">पत्तियां सूखने लगती हैं</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Harvesting Timeline */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                    <h4 className="text-base font-medium text-gray-800 mb-3">कटाई का समय</h4>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm">
                        {selectedCrop.harvest && selectedCrop.harvest.time ? selectedCrop.harvest.time : "बुवाई के 90-120 दिन बाद"}
                      </div>
                      <div className="h-px flex-grow bg-gray-200"></div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      {selectedCrop.harvest && selectedCrop.harvest.timeDescription 
                        ? selectedCrop.harvest.timeDescription 
                        : "सही समय पर कटाई करने से उपज की गुणवत्ता और मात्रा सुनिश्चित होती है। मौसम की स्थिति और किस्म के अनुसार समय में थोड़ा बदलाव हो सकता है।"}
                    </p>
                  </div>
                </div>
                
                {/* Storage Section */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Archive className="w-5 h-5 text-amber-600" />
                    भंडारण की विधि
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Storage Methods */}
                    <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                      <h4 className="text-base font-medium text-amber-800 mb-3">भंडारण के तरीके</h4>
                      
                      {selectedCrop.storage && selectedCrop.storage.methods ? (
                        <ul className="space-y-2">
                          {selectedCrop.storage.methods.map((method, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{method}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">साफ और सूखे बोरों में भंडारित करें</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">भंडारण से पहले अच्छी तरह से सुखाएं</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">कीटों से बचाने के लिए नीम के पत्ते का उपयोग करें</span>
                          </li>
                        </ul>
                      )}
                    </div>
                    
                    {/* Storage Conditions */}
                    <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                      <h4 className="text-base font-medium text-amber-800 mb-3">आदर्श भंडारण स्थिति</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Thermometer className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">तापमान</p>
                            <p className="text-gray-600">
                              {selectedCrop.storage && selectedCrop.storage.temperature 
                                ? selectedCrop.storage.temperature 
                                : "10-15°C (शीतल और सूखा)"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Droplets className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">आर्द्रता</p>
                            <p className="text-gray-600">
                              {selectedCrop.storage && selectedCrop.storage.humidity 
                                ? selectedCrop.storage.humidity 
                                : "50-60% (कम आर्द्रता)"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">भंडारण अवधि</p>
                            <p className="text-gray-600">
                              {selectedCrop.storage && selectedCrop.storage.duration 
                                ? selectedCrop.storage.duration 
                                : "उचित स्थिति में 6-12 महीने तक"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Storage Tips */}
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">भंडारण के महत्वपूर्ण सुझाव</h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <LightbulbIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">नियमित जांच करें</p>
                        <p className="text-sm text-gray-600">भंडारित फसल की नियमित रूप से जांच करें और खराब हिस्सों को तुरंत हटा दें</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <LightbulbIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">कीट नियंत्रण</p>
                        <p className="text-sm text-gray-600">भंडारण क्षेत्र को कीट-मुक्त रखें और प्राकृतिक कीटनाशकों का उपयोग करें</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <LightbulbIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">बाजार की मांग</p>
                        <p className="text-sm text-gray-600">बाजार की मांग और कीमतों के अनुसार भंडारण अवधि को नियंत्रित करें</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">शैक्षिक वीडियो</h2>
              
              {selectedCrop.videos && selectedCrop.videos.length > 0 ? (
                <div className="space-y-6">
                  {/* Kheti Videos Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-green-600" />
                      खेती वीडियो
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedCrop.videos.map((video, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all group">
                          <div className="relative aspect-video bg-gray-200 overflow-hidden">
                            {/* Video thumbnail with play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-green-600 ml-1" />
                              </div>
                            </div>
                            {/* Video duration badge */}
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {video.duration || "10:00"}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {video.description}
                            </p>
                            <a 
                              href={video.url || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                            >
                              देखें <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Crop-Specific Techniques */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      विशेष तकनीक वीडियो
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">उन्नत खेती तकनीक</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          आधुनिक और उन्नत खेती तकनीकों के बारे में जानें जो उत्पादकता बढ़ाने में मदद करती हैं।
                        </p>
                        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                          वीडियो देखें <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-2">जैविक खेती विधियां</h4>
                        <p className="text-sm text-amber-700 mb-3">
                          जैविक खेती के तरीकों और प्राकृतिक कीट नियंत्रण के बारे में जानकारी प्राप्त करें।
                        </p>
                        <a href="#" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center">
                          वीडियो देखें <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">इस फसल के लिए अभी कोई वीडियो उपलब्ध नहीं है</p>
                  <p className="text-sm text-gray-500">हम जल्द ही नए वीडियो जोड़ेंगे</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDetailPage;

