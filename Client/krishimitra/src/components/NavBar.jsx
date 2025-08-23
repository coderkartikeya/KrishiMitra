'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ✅ to detect current path
import { 
  Home, Sprout, Camera, TrendingUp, Users, FileText, DollarSign, Bot, BookOpen
} from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
   const pathname = usePathname(); // current active route
  // Simplified navigation with fewer, more essential options for farmers
  const navItems = [
    { id: '/dashboard', label: 'मुख्य पृष्ठ', englishLabel: 'Home', icon: <Home className="w-6 h-6" /> },
    { id: '/dashboard/mycrops', label: 'मेरी फसलें', englishLabel: 'My Crops', icon: <Sprout className="w-6 h-6" /> },
    { id: '/dashboard/scan', label: 'पौधा स्कैन', englishLabel: 'Plant Scan', icon: <Camera className="w-6 h-6" /> },
    { id: '/dashboard/market', label: 'बाज़ार भाव', englishLabel: 'Market', icon: <TrendingUp className="w-6 h-6" /> },
    { id: '/dashboard/schemes', label: 'सरकारी योजनाएँ', englishLabel: 'Schemes', icon: <FileText className="w-6 h-6" /> },
    { id: '/dashboard/assistant', label: 'सहायता', englishLabel: 'Help', icon: <Bot className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation - Simplified with larger icons and text */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 transition-colors duration-200 ${
                activeTab === item.id
                  ? 'text-green-600 bg-green-50 border-t-2 border-green-500'
                  : 'text-gray-500 hover:text-green-600'
              }`}
              aria-label={item.englishLabel}
            >
              <div className="relative">
                {item.icon}
                {activeTab === item.id && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                )}
              </div>
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar - Enhanced with better visual hierarchy */}
      <aside className="hidden md:flex w-72 bg-white shadow-xl flex-col fixed h-full z-40 border-r border-gray-100">
        
        {/* Profile Section - Enhanced with more farmer-friendly design */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-3 shadow-lg">
              👨‍🌾
            </div>
            <h3 className="font-bold text-gray-800 text-xl">राम सिंह</h3>
            <p className="text-gray-600 font-medium">किसान, मेरठ, उत्तर प्रदेश</p>
          </div>
        </div>

        {/* Navigation - Enhanced with larger text and better spacing */}
        <div className="flex-1 py-6 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg mb-2 text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'text-green-700 bg-green-50 font-bold shadow-sm border-l-4 border-green-500'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
              aria-label={item.englishLabel}
            >
              <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-green-100' : 'bg-gray-100'}`}>
                {item.icon}
              </div>
              <span className="text-base">{item.label}</span>
              <span className="text-xs text-gray-500 ml-1">({item.englishLabel})</span>
            </button>
          ))}
        </div>
        
        {/* Help Section */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full py-3 text-center bg-green-100 rounded-lg text-green-700 font-bold hover:bg-green-200 transition-colors">
            मदद चाहिए? (Need Help?)
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
