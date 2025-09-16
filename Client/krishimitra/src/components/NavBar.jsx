'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Home, Sprout, Camera, TrendingUp, Users, FileText, DollarSign, Bot, BookOpen, 
  Droplets, Microscope, MessageSquare, Menu, X, ChevronRight, Plus
} from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Primary navigation items (most important for bottom nav)
  const primaryNavItems = [
    { id: '/dashboard', label: 'मुख्य', englishLabel: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: '/dashboard/mycrops', label: 'फसलें', englishLabel: 'Crops', icon: <Sprout className="w-5 h-5" /> },
    { id: '/dashboard/plantDisease', label: 'स्कैन', englishLabel: 'Scan', icon: <Camera className="w-5 h-5" /> },
    { id: '/dashboard/market', label: 'बाज़ार', englishLabel: 'Market', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  // Categorized navigation items for full menu
  const navigationCategories = [
    {
      title: 'मुख्य सुविधाएं',
      englishTitle: 'Main Features',
      items: [
        { id: '/dashboard', label: 'मुख्य पृष्ठ', englishLabel: 'Home', icon: <Home className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { id: '/dashboard/mycrops', label: 'मेरी फसलें', englishLabel: 'My Crops', icon: <Sprout className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { id: '/dashboard/market', label: 'बाज़ार भाव', englishLabel: 'Market Prices', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' }
      ]
    },
    {
      title: 'स्मार्ट टूल्स',
      englishTitle: 'Smart Tools',
      items: [
        { id: '/dashboard/plantscan', label: 'पौधा स्कैन', englishLabel: 'Plant Scan', icon: <Camera className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { id: '/dashboard/soilAnalysis', label: 'मिट्टी विश्लेषण', englishLabel: 'Soil Analysis', icon: <Microscope className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' }
      ]
    },
    {
      title: 'सहायता व जानकारी',
      englishTitle: 'Support & Info',
      items: [
        { id: '/dashboard/schemes', label: 'सरकारी योजनाएँ', englishLabel: 'Government Schemes', icon: <FileText className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-600' },
        { id: '/dashboard/community', label: 'समुदाय', englishLabel: 'Community', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-teal-100 text-teal-600' },
        { id: '/dashboard/help', label: 'सहायता', englishLabel: 'Help & Support', icon: <Bot className="w-6 h-6" />, color: 'bg-pink-100 text-pink-600' }
      ]
    }
  ];

  const allItems = navigationCategories.flatMap(category => category.items);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
              🌱
            </div>
            <div>
              <h2 className="font-bold text-gray-800">स्मार्ट कृषि</h2>
              <p className="text-xs text-gray-600">Smart Farming</p>
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Simplified with 4 main items + More */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
        <div className="flex">
          {primaryNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 transition-all duration-200 ${
                activeTab === item.id
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                {item.icon}
                {activeTab === item.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <span className="text-xs font-medium leading-tight text-center">{item.label}</span>
            </button>
          ))}
          
          {/* More button */}
          <button
            onClick={toggleMobileMenu}
            className="flex-1 py-3 px-2 flex flex-col items-center gap-1 text-gray-500 hover:text-green-600 hover:bg-gray-50 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">और देखें</span>
          </button>
        </div>
      </nav>

      {/* Mobile Full Screen Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">सभी सुविधाएं</h2>
              <p className="text-sm text-gray-600">All Features</p>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-20 ">
            {navigationCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-10">
                {/* Category Header */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 text-xl mb-1">{category.title}</h3>
                  <p className="text-gray-600">{category.englishTitle}</p>
                </div>

                {/* Category Items in Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setShowMobileMenu(false);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        activeTab === item.id
                          ? 'border-green-300 bg-green-50 shadow-md'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        activeTab === item.id ? 'bg-green-100' : item.color
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.label}</h4>
                        <p className="text-xs text-gray-600">{item.englishLabel}</p>
                      </div>
                      {activeTab === item.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <h3 className="font-bold text-gray-800 mb-2">त्वरित सहायता</h3>
              <p className="text-sm text-gray-600 mb-4">Quick Help</p>
              <div className="flex gap-3">
                <button className="flex-1 bg-white py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                  <Bot className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs font-medium text-gray-800">AI सहायक</span>
                </button>
                <button className="flex-1 bg-white py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                  <MessageSquare className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <span className="text-xs font-medium text-gray-800">समुदाय</span>
                </button>
              </div>
              <button onClick={handleLogout} className="w-full mt-4 py-3 text-center bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg">
                लॉग आउट (Logout)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Enhanced */}
      <aside className="hidden md:flex w-80 bg-white shadow-xl flex-col fixed h-full z-40 border-r border-gray-100">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-3 shadow-lg">
              👨‍🌾
            </div>
            <h3 className="font-bold text-gray-800 text-xl">राम सिंह</h3>
            <p className="text-gray-600 font-medium">किसान, मेरठ, उत्तर प्रदेश</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">5 एकड़ खेत</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">गेहूं किसान</span>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 py-6 overflow-y-auto">
          {navigationCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6">
              <h4 className="px-6 text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                {category.title}
              </h4>
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'text-green-700 bg-green-50 font-bold border-r-4 border-green-500'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeTab === item.id ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <span className="block text-base font-medium">{item.label}</span>
                    <span className="text-xs text-gray-500">{item.englishLabel}</span>
                  </div>
                  {activeTab === item.id && (
                    <ChevronRight className="w-4 h-4 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
        
        {/* Help Section */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button className="w-full py-3 text-center bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg">
            💬 तुरंत मदद चाहिए?
          </button>
          <p className="text-center text-xs text-gray-600 mt-2">24/7 किसान सहायता उपलब्ध</p>
          <button onClick={handleLogout} className="w-full mt-3 py-3 text-center bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg">
            लॉग आउट (Logout)
          </button>
        </div>
      </aside>

      {/* Mobile Padding for Fixed Header */}
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default Navigation;