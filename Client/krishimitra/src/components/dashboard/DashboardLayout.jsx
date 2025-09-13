'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../middleware/clientAuth.js';
import NavBar from '../NavBar';

const DashboardLayout = ({ children, title, subtitle, icon }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState(pathname);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Dashboard Layout: User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  // Handle navigation
  const handleTabChange = (tabId) => {
    if (tabId.startsWith('/dashboard')) {
      router.push(tabId);
    } else {
      // Fallback for any legacy routes
      switch (tabId) {
        case 'home':
          router.push('/dashboard');
          break;
        case 'crops':
          router.push('/dashboard/mycrops');
          break;
        case 'scan':
          router.push('/dashboard/plantDisease');
          break;
        case 'market':
          router.push('/dashboard/market');
          break;
        case 'community':
          router.push('/dashboard/community');
          break;
        case 'profile':
          router.push('/dashboard/profile');
          break;
        default:
          router.push('/dashboard');
          break;
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <NavBar activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Main Content */}
      <div className="md:ml-80">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          {title && (
            <div className="flex items-center gap-3">
              {icon && <div className="text-green-600">{icon}</div>}
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white border-b border-gray-200 px-6 py-4">
          {title && (
            <div className="flex items-center gap-4">
              {icon && <div className="text-green-600">{icon}</div>}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="text-gray-600">{subtitle}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;