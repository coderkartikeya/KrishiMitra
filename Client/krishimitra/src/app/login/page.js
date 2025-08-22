'use client';

import { useEffect, useState } from 'react';

export default function SmartFarmingAuth() {
  const [showSignup, setShowSignup] = useState(false);
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pin, setPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [language, setLanguage] = useState('English');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  // Basic handlers
  const handleMobileChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(cleaned);
  };

  const handleAadhaarChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaar(cleaned);
  };

  const handlePinChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(cleaned);
  };

  useEffect(() => {
    if (showSignup && aadhaar.length >= 4) {
      setPin(aadhaar.slice(-4));
    }
  }, [aadhaar, showSignup]);

  const showMessage = (message) => {
    setSuccessMsg(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const closeModal = () => setShowSuccess(false);

  const verifyMobile = async () => {
    if (mobile.length !== 10) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsMobileVerified(true);
    showMessage('📱 Mobile number verified successfully!');
    setIsLoading(false);
  };

  const captureLocation = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLocationCaptured(true);
    showMessage('📍 Location captured successfully!');
    setIsLoading(false);
  };

  const completeSignup = async () => {
    if (!mobile || !aadhaar || !pin || !isMobileVerified || !locationCaptured) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    showMessage('🎉 Welcome to Smart Farming! Your account has been created successfully! 🌱🚜');
    setIsLoading(false);
  };

  const login = async () => {
    if (!mobile || !pin) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showMessage('🎉 Login successful! Welcome to Smart Farming! 🌱');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <option>English</option>
          <option>हिंदी</option>
          <option>ಕನ್ನಡ</option>
          <option>தமிழ்</option>
        </select>
      </div>

      {/* Login Page */}
      {!showSignup && (
        <div className="min-h-screen max-h-screen flex flex-col justify-center items-center px-6 py-4 overflow-hidden">
          {/* Header Navigation */}
          <div className="absolute top-6 left-6 z-20">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 shadow-md">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22V16H21A7,7 0 0,1 14,23H13V21H14A5,5 0 0,0 19,16H14V14A5,5 0 0,0 9,9V8H10A2,2 0 0,1 12,10V12H10A4,4 0 0,1 6,8V7H7V5.73C6.4,5.39 6,4.74 6,4A2,2 0 0,1 8,2A2,2 0 0,1 10,4C10,4.74 9.6,5.39 9,5.73V7H10A2,2 0 0,1 12,9V7H13V5.73C12.4,5.39 12,4.74 12,4A2,2 0 0,1 12,2Z"/>
              </svg>
              <span>KrishiMitra</span>
            </div>
          </div>

          {/* Header Illustration */}
          <div className="mb-6 text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22V16H21A7,7 0 0,1 14,23H13V21H14A5,5 0 0,0 19,16H14V14A5,5 0 0,0 9,9V8H10A2,2 0 0,1 12,10V12H10A4,4 0 0,1 6,8V7H7V5.73C6.4,5.39 6,4.74 6,4A2,2 0 0,1 8,2A2,2 0 0,1 10,4C10,4.74 9.6,5.39 9,5.73V7H10A2,2 0 0,1 12,9V7H13V5.73C12.4,5.39 12,4.74 12,4A2,2 0 0,1 12,2Z"/>
                </svg>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Smart Farming
            </h1>
            <p className="text-gray-600 text-base sm:text-lg font-medium">🌱 Grow Smarter, Harvest Better 🚜</p>
          </div>

          {/* Login Form */}
          <form onSubmit={(e) => { e.preventDefault(); login(); }} className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Sign in to your farming dashboard</p>
            </div>

            {/* Mobile Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1 ml-1">
                📱 Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                  required
                />
              </div>
            </div>

            {/* PIN Input */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-1 ml-1">
                🔒 PIN (Last 4 digits of Aadhaar) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={handlePinChange}
                  maxLength={4}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!mobile || !pin || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-2xl transition-all duration-300 text-base shadow-sm hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] mb-4"
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : (
                '🚜 Login to Farm Dashboard'
              )}
              <span className={`relative z-10 ${isLoading ? 'opacity-0' : ''}`}>
                {isLoading ? 'Logging in...' : '🚜 Login to Farm Dashboard'}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 mb-2 text-sm">New to Smart Farming?</p>
              <button
                type="button"
                onClick={() => setShowSignup(true)}
                className="w-full bg-white text-green-600 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 font-bold py-3 rounded-2xl transition-all duration-300 text-base shadow-sm hover:shadow-lg"
              >
                🌱 Create New Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Signup Page */}
      {showSignup && (
        <div className="min-h-screen max-h-screen flex flex-col justify-center items-center px-6 py-4 overflow-hidden">
          {/* Header Navigation */}
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => setShowSignup(false)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-md"
            >
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span>Back to Login</span>
            </button>
          </div>

          {/* Icons header */}
          <div className="mb-6 text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white text-xl">🚜</span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white text-xl">🌾</span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white text-xl">💧</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Join Smart Farming
            </h1>
            <p className="text-gray-600 text-base sm:text-lg font-medium">🌾 Start Your Digital Agriculture Journey 🚜</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={(e) => { e.preventDefault(); completeSignup(); }} className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600 text-sm">Join the farming revolution</p>
            </div>

            {/* Mobile Input with Verification */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1 ml-1">
                📱 Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  className="w-full pl-12 pr-20 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                  required
                />
                <button
                  type="button"
                  onClick={verifyMobile}
                  disabled={mobile.length !== 10 || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : isMobileVerified ? '✓ Verified' : 'Verify'}
                </button>
              </div>
            </div>

            {/* Aadhaar Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1 ml-1">
                🆔 Aadhaar Card Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar number"
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  maxLength={12}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                  required
                />
              </div>
            </div>

            {/* Auto PIN Display */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-1 ml-1">
                🔒 Auto-Generated PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Last 4 digits will appear here"
                  value={pin}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 bg-green-50/80 border-2 border-green-300/50 rounded-2xl text-green-800 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Location Capture */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1 ml-1">
                📍 Farm Location <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={captureLocation}
                disabled={locationCaptured || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Capturing...
                  </div>
                ) : locationCaptured ? (
                  '✅ Location Captured'
                ) : (
                  '📍 Capture Farm Location'
                )}
              </button>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={!mobile || !aadhaar || !pin || !isMobileVerified || !locationCaptured || isLoading}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-bold py-3 rounded-2xl transition-all duration-300 text-base shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] mb-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                '🌾 Join Smart Farming Community'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-gray-600 mb-3 text-sm font-medium">Already have an account?</p>
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 hover:from-gray-200 hover:to-gray-300 font-semibold py-3 rounded-2xl transition-all duration-300 text-base shadow-sm hover:shadow-lg"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 mx-6 text-center max-w-md w-full shadow-2xl border border-gray-100">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">✅</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Welcome to Smart Farming!
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">{successMsg}</p>
            </div>
            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🌿 Start Your Farming Journey!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
