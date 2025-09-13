'use client';

import React from 'react';

/**
 * A consistent page container component for all pages
 * Provides consistent padding, max-width, and responsive design
 */
const PageContainer = ({ children, title, subtitle, icon }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        {title && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {icon && (
                <div className="p-3 bg-white rounded-full shadow-sm">
                  {icon}
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
            </div>
            {subtitle && <p className="text-gray-600 mt-1 max-w-3xl">{subtitle}</p>}
          </div>
        )}
        
        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;