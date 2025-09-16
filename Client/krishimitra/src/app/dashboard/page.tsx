'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../middleware/clientAuth.js';

// Import components
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DateTimeDisplay from '../../components/dashboard/DateTimeDisplay';
import WeatherWidget from '../../components/dashboard/WeatherWidget';
import CropStats from '../../components/dashboard/CropStats';
import SoilData from '../../components/dashboard/SoilData';
import QuickActions from '../../components/dashboard/QuickActions';
import VoiceAssistant from '../../components/dashboard/VoiceAssistant';

// Import services
import { fetchDashboardData } from '../../services/dashboardService';

// Main Dashboard Component
function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  // console.log(user)
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [dashboardData, setDashboardData] = useState({
    weather: null,
    cropStats: null,
    soilData: null,
    isLoading: true,
    error: null
  });

  // Check authentication
  useEffect(() => {
    // console.log('Dashboard: Auth state changed:', { isAuthenticated, isLoading, user: user?.id });
    if (!isLoading && !isAuthenticated) {
      // console.log('Dashboard: User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData({
          weather: data.weather,
          cropStats: data.cropStats,
          soilData: data.soilData,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load dashboard data'
        }));
      }
    };

    loadDashboardData();
  }, []);

  const handleVoiceAssistant = () => {
    alert('🎤 Voice Assistant Activated!\n\n"नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?"\n\nYou can ask me about:\n• Weather updates\n• Market prices\n• Crop care tips\n• Government schemes');
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'scan':
        router.push('/plantDisease');
        break;
      case 'crops':
        router.push('/crops');
        break;
      case 'schemes':
        router.push('/schemes');
        break;
      case 'community':
        router.push('/community');
        break;
      case 'finance':
        router.push('/finance');
        break;
      case 'assistant':
        handleVoiceAssistant();
        break;
      default:
        break;
    }
  };

  // Loading state UI
  if (dashboardData.isLoading) {
    return (
      <DashboardLayout 
        title="Dashboard" 
        subtitle="Loading your farming data..."
        icon={<span className="text-2xl">🌱</span>}
      >
        <div className="max-w-7xl mx-auto">
          <div className="h-16 bg-gray-200 rounded-md animate-pulse mb-6"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            
            <div className="space-y-6">
              <div className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Error state UI
  if (dashboardData.error) {
    return (
      <DashboardLayout 
        title="Dashboard" 
        subtitle="Error loading data"
        icon={<span className="text-2xl">⚠️</span>}
      >
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Dashboard</h2>
            <p className="text-gray-600 mb-6">We encountered an error while loading your dashboard data. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Main dashboard UI
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome to Smart Farming Dashboard"
      icon={<span className="text-2xl">🌱</span>}
    >
      {/* Top Section with Date/Time and Voice Assistant */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <DateTimeDisplay />
        <div className="mt-4 md:mt-0">
          {/* Voice Assistant - Moved to top */}
          <VoiceAssistant onActivate={handleVoiceAssistant} />
        </div>
      </div>
      
      {/* Weather Widget - Simplified and Full Width */}
      <div className="mb-6">
        <WeatherWidget location="Meerut, UP" />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Crop Statistics */}
        <div className="lg:col-span-2">
          <CropStats />
        </div>
        
        {/* Right Column - Quick Actions */}
        <div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-green-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions <span className="text-sm font-normal text-gray-500">(त्वरित कार्य)</span></h2>
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        </div>
      </div>
      
      {/* Soil Data Section - Moved to bottom */}
      <div className="mb-8">
        <SoilData />
      </div>
    </DashboardLayout>
  );
}

// Export dashboard component
export default Dashboard;
