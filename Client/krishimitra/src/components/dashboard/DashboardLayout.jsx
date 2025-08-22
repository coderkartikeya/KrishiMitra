'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../NavBar';

const DashboardLayout = ({ children, activeTab }) => {
  const router = useRouter();

  const handleTabChange = (tabId) => {
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
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation (Sidebar for Desktop, Bottom Nav for Mobile) */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Main Content */}
      <div className="md:ml-64 p-4 sm:p-6 pt-6 sm:pt-8 pb-24 md:pb-8 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
      
      {/* Floating Action Button for Mobile - Only visible on mobile */}
      <div className="fixed right-6 bottom-20 md:hidden z-50">
        <button 
          onClick={() => router.push('/plantDisease')} 
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg flex items-center justify-center text-2xl hover:scale-105 transition-transform duration-200"
          aria-label="Scan Plant"
        >
          📷
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;