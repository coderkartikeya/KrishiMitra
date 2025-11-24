'use client';

import React from 'react';
import { Microscope } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const SoilAnalysisComingSoon = () => {
  return (
    <DashboardLayout>
      <div className="md:ml-80 pt-16 md:pt-0 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Microscope className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2">Soil Analysis Coming Soon</h1>
            <p className="text-gray-600 mb-6">
              We are building detailed soil testing, actionable recommendations, and upload support.
              Please check back soon.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-5 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
              Go to Dashboard
            </a>
          </div>

          <div className="mt-8 text-center text-gray-500">
            <p>Need help in the meantime?</p>
            <a href="/dashboard/help" className="text-green-700 font-medium hover:underline">Visit Help &amp; Support</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SoilAnalysisComingSoon;