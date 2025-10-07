'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowRight, Calendar, MapPin, Droplets, Sun, Leaf, Shield, Play, CheckCircle } from 'lucide-react';
import Navbar from '../../../components/NavBar';
import cropGuidesData from '../../../data/cropGuides.json';

const CropGuidePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

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

  const availableCrops = Object.values(cropGuidesData.crops);
  const filteredCrops = availableCrops.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      <Navbar activeTab="/dashboard/crop-guide" onTabChange={handleTabChange} />
      
      <div className="md:ml-80 pt-16 md:pt-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">फसल उगाने की गाइड</h1>
                <p className="text-gray-600 mt-1">सफल फसल उत्पादन के लिए व्यापक गाइड</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="फसल खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <BookOpen className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Available Crops */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">उपलब्ध फसल गाइड</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map((crop) => (
                <div 
                  key={crop.id}
                  onClick={() => router.push(`/dashboard/crop-guide/${crop.id}`)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {crop.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {crop.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 italic">{crop.scientificName}</p>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">{crop.description}</p>
                    
                    {/* Quick Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>मौसम</span>
                        </div>
                        <span className="font-medium text-gray-900">{crop.growingSeason}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>जलवायु</span>
                        </div>
                        <span className="font-medium text-gray-900">{crop.climate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Leaf className="w-4 h-4" />
                          <span>उत्पादन</span>
                        </div>
                        <span className="font-medium text-gray-900">{crop.yield}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>अवधि</span>
                        </div>
                        <span className="font-medium text-gray-900">{crop.duration}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>भूमि तैयारी की तकनीक</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>बीजारोपण और उर्वरक</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>कीट और रोग प्रबंधन</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>कटाई और भंडारण</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-blue-500" />
                        <span>वीडियो ट्यूटोरियल शामिल</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium group-hover:text-green-700">
                      <span>गाइड देखें</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">जल्द ही आने वाली फसलें</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'चावल', icon: '🌾', color: 'bg-yellow-100 text-yellow-600' },
                { name: 'कपास', icon: '🌿', color: 'bg-green-100 text-green-600' },
                { name: 'टमाटर', icon: '🍅', color: 'bg-red-100 text-red-600' },
                { name: 'आलू', icon: '🥔', color: 'bg-yellow-100 text-yellow-600' },
                { name: 'प्याज', icon: '🧅', color: 'bg-purple-100 text-purple-600' },
                { name: 'मिर्च', icon: '🌶️', color: 'bg-red-100 text-red-600' }
              ].map((crop, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">{crop.icon}</div>
                  <p className="text-sm font-medium text-gray-500">{crop.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">व्यापक फसल गाइड</h3>
                <p className="text-blue-700 mb-4">
                  प्रत्येक फसल गाइड में भूमि तैयारी, बीजारोपण, उर्वरक, सिंचाई, कीट और रोग प्रबंधन, 
                  कटाई तकनीक और बेहतर समझ के लिए वीडियो ट्यूटोरियल के बारे में विस्तृत जानकारी शामिल है। 
                  हमारी गाइड कृषि विशेषज्ञों द्वारा डिज़ाइन की गई हैं ताकि आप अधिकतम उत्पादन और गुणवत्ता प्राप्त कर सकें।
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">विशेषज्ञ-अनुमोदित तकनीक</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">वीडियो ट्यूटोरियल शामिल</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">नियमित अपडेट</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropGuidePage;