'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../middleware/clientAuth.js';

export default function SmartFarmingAuth() {
  const router = useRouter();
  const { login: loginUser, isAuthenticated } = useAuth();
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
  const [locationData, setLocationData] = useState(null);
  const [hasRedirected, setHasRedirected] = useState(false);

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

  // Redirect if already authenticated
  useEffect(() => {
    // console.log('Login page: Auth state changed:', { isAuthenticated, hasRedirected });
    if (isAuthenticated && !hasRedirected) {
      console.log('Login page: User is authenticated, redirecting to dashboard');
      setHasRedirected(true);
      
      // Use a more robust redirect that works with Next.js
      const redirectToDashboard = () => {
        router.push('/dashboard');
      };
      redirectToDashboard();
      
      // Add a small delay to ensure state is settled
      // setTimeout(redirectToDashboard, 200);
    }
  }, [isAuthenticated, hasRedirected, router]);

  const showMessage = (message) => {
    setSuccessMsg(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const closeModal = () => setShowSuccess(false);

  const verifyMobile = async () => {
    if (mobile.length !== 10) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/verify-mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsMobileVerified(true);
        showMessage('📱 Mobile number verified successfully!');
      } else {
        setErrors({ mobile: data.message || 'Mobile verification failed' });
      }
    } catch (error) {
      console.error('Mobile verification error:', error);
      setErrors({ mobile: 'Network error. Please try again.' });
    } finally {
    setIsLoading(false);
    }
  };

  const captureLocation = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
        setLocationData({ latitude, longitude });
        setLocationCaptured(true);
        showMessage('📍 Location captured successfully!');
    } catch (error) {
      console.error('Location capture error:', error);
      setErrors({ location: 'Failed to capture location. Please enable location access.' });
    } finally {
    setIsLoading(false);
    }
  };

  const completeSignup = async () => {
    if (!mobile || !aadhaar || !pin  || !locationCaptured) {
      setErrors({ general: 'Please complete all required fields' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          aadhaar,
          pin,
          location: locationData,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update auth store with user data
        await loginUser(data.user, {
          accessToken: 'stored-in-cookies',
          refreshToken: 'stored-in-cookies'
        });
        
        showMessage('🎉 Welcome to Smart Farming! Your account has been created successfully! 🌱🚜');
        
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          router.replace('/dashboard');
        }, 2000);
      } else {
        setErrors({ general: data.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
    setIsLoading(false);
    }
  };

  const login = async () => {
    if (!mobile || !pin) {
      setErrors({ general: 'Please enter both mobile number and PIN' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, pin }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update auth store with user data
        await loginUser(data.user, {
          accessToken: 'stored-in-cookies',
          refreshToken: 'stored-in-cookies'
        });
        
        showMessage('🎉 Login successful! Welcome to Smart Farming! 🌱');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.replace('/dashboard');
        }, 1500);
      } else {
        setErrors({ general: data.message || 'Invalid credentials. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
    setIsLoading(false);
    }
  };

  // Debug info (remove in production)
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-20 w-28 h-28 bg-emerald-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-yellow-200/30 rounded-full blur-lg animate-float-delayed"></div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 cursor-pointer hover:bg-white transition-all duration-300 shadow-lg"
        >
          <option>English</option>
          <option>हिंदी</option>
          <option>ಕನ್ನಡ</option>
          <option>தமிழ்</option>
        </select>
      </div>

      {/* Login Page */}
      {!showSignup && (
        <div className="min-h-screen flex">
          {/* Left Side - Branding & Info (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center items-center px-8 xl:px-16 relative">
          {/* Header Navigation */}
          <div className="absolute top-6 left-6 z-20">
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold text-gray-700 border border-white/50 shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🌱</span>
                </div>
              <span>KrishiMitra</span>
              </div>
            </div>

            {/* Main Branding Content */}
            <div className="text-center max-w-lg">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse-3d">
                  <span className="text-white text-5xl">🚜</span>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce-3d">
                  <span className="text-white text-lg">🌾</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center animate-float">
                  <span className="text-white text-sm">💧</span>
                </div>
              </div>

              <h1 className="text-5xl xl:text-6xl font-bold text-gray-800 mb-6">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Smart Farming
                </span>
              </h1>
              <p className="text-gray-600 text-xl xl:text-2xl font-medium mb-8">Grow Smarter, Harvest Better</p>
              
              {/* Features */}
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🌱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Smart Crop Management</h3>
                    <p className="text-sm text-gray-600">AI-powered insights for better yields</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Real-time Analytics</h3>
                    <p className="text-sm text-gray-600">Monitor your farm 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Community Support</h3>
                    <p className="text-sm text-gray-600">Connect with fellow farmers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
            {/* Mobile Header Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-2 text-sm font-semibold text-gray-700 border border-white/50 shadow-lg">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🌱</span>
                  </div>
                  <span>KrishiMitra</span>
                </div>
              </div>
            </div>

            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse-3d">
                  <span className="text-white text-2xl">🚜</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce-3d">
                  <span className="text-white text-xs">🌾</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Smart Farming
                </span>
            </h1>
              <p className="text-gray-600 text-sm">Grow Smarter, Harvest Better</p>
          </div>

          {/* Login Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 max-w-md mx-auto lg:mx-0">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome Back</h2>
                <p className="text-gray-600 text-sm sm:text-base">Sign in to your farming dashboard</p>
              </div>

              {/* Error Display */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                  </div>
            </div>
              )}

              <div className="space-y-4 sm:space-y-6">
            {/* Mobile Input */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                📱 Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/80 border-2 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base font-medium shadow-sm hover:shadow-md hover:bg-white ${
                        errors.mobile ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                      }`}
                  required
                />
              </div>
                  {errors.mobile && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.mobile}
                    </p>
                  )}
            </div>

            {/* PIN Input */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                🔒 PIN (Last 4 digits of Aadhaar) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={handlePinChange}
                  maxLength={4}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/80 border-2 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base font-medium shadow-sm hover:shadow-md hover:bg-white ${
                        errors.pin ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                      }`}
                  required
                />
              </div>
                  {errors.pin && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.pin}
                    </p>
                  )}
            </div>

            {/* Login Button */}
            <button
                  onClick={(e) => { e.preventDefault(); login(); }}
              disabled={!mobile || !pin || isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            >
                  {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
                  <span className={isLoading ? 'opacity-0' : ''}>
                    🚜 Login to Farm Dashboard
              </span>
            </button>

            {/* Divider */}
                <div className="flex items-center my-4 sm:my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm font-medium">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Sign Up Link */}
                <div className="text-center space-y-2 sm:space-y-3">
                  <p className="text-gray-600 text-xs sm:text-sm">New to Smart Farming?</p>
              <button
                type="button"
                onClick={() => setShowSignup(true)}
                    className="w-full bg-white/90 text-green-600 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                🌱 Create New Account
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Page */}
      {showSignup && (
        <div className="min-h-screen flex">
          {/* Left Side - Branding & Info (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center items-center px-8 xl:px-16 relative">
          {/* Header Navigation */}
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => setShowSignup(false)}
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold text-gray-700 border border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-lg"
            >
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span>Back to Login</span>
            </button>
          </div>

            {/* Main Branding Content */}
            <div className="text-center max-w-lg">
              <div className="flex justify-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-float">
                  <span className="text-white text-3xl">🚜</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-float-delayed">
                  <span className="text-white text-3xl">🌾</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-float">
                  <span className="text-white text-3xl">💧</span>
                </div>
              </div>

              <h1 className="text-5xl xl:text-6xl font-bold text-gray-800 mb-6">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Join Smart Farming
                </span>
              </h1>
              <p className="text-gray-600 text-xl xl:text-2xl font-medium mb-8">Start Your Digital Agriculture Journey</p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Easy Registration</h3>
                    <p className="text-sm text-gray-600">Quick signup with mobile & Aadhaar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Location Tracking</h3>
                    <p className="text-sm text-gray-600">Precise farm location mapping</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Secure Access</h3>
                    <p className="text-sm text-gray-600">PIN-based authentication</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
            {/* Mobile Header Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowSignup(false)}
                  className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-2 text-sm font-semibold text-gray-700 border border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-lg"
                >
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  <span>Back</span>
                </button>
              </div>
            </div>

            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-float">
                  <span className="text-white text-lg">🚜</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl animate-float-delayed">
                  <span className="text-white text-lg">🌾</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-xl animate-float">
                  <span className="text-white text-lg">💧</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Join Smart Farming
                </span>
            </h1>
              <p className="text-gray-600 text-sm">Start Your Digital Agriculture Journey</p>
          </div>

          {/* Signup Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 max-w-md mx-auto lg:mx-0">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white text-lg sm:text-2xl">👤</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Create Account</h2>
                <p className="text-gray-600 text-sm sm:text-base">Join the farming revolution</p>
              </div>

              {/* Error Display */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                  </div>
            </div>
              )}

              <div className="space-y-4 sm:space-y-6">
            {/* Mobile Input with Verification */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                📱 Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                      className={`w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-4 bg-white/80 border-2 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 font-medium shadow-sm hover:shadow-md hover:bg-white ${
                        errors.mobile ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                      }`}
                  required
                />
                    
              </div>
                  {errors.mobile && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.mobile}
                    </p>
                  )}
            </div>

            {/* Aadhaar Input */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                🆔 Aadhaar Card Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar number"
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  maxLength={12}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/80 border-2 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 font-medium shadow-sm hover:shadow-md hover:bg-white ${
                        errors.aadhaar ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                      }`}
                  required
                />
              </div>
                  {errors.aadhaar && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.aadhaar}
                    </p>
                  )}
            </div>

            {/* Auto PIN Display */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                🔒 Auto-Generated PIN
              </label>
              <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Last 4 digits will appear here"
                  value={pin}
                  readOnly
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-green-50/80 border-2 border-green-300/50 rounded-xl sm:rounded-2xl text-green-800 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Location Capture */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                📍 Farm Location <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={captureLocation}
                disabled={locationCaptured || isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        <span className="text-sm sm:text-base">Capturing...</span>
                  </div>
                ) : locationCaptured ? (
                      <span className="text-sm sm:text-base">✅ Location Captured</span>
                ) : (
                      <span className="text-sm sm:text-base">📍 Capture Farm Location</span>
                )}
              </button>
                  {errors.location && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.location}
                    </p>
                  )}
            </div>

            {/* Signup Button */}
            <button
                  onClick={(e) => { e.preventDefault(); completeSignup(); }}
                  disabled={!mobile || !aadhaar || !pin  || !locationCaptured || isLoading}
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                >
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
                  <span className={isLoading ? 'opacity-0' : ''}>
                    🌾 Join Smart Farming Community
                  </span>
            </button>

            {/* Divider */}
                <div className="flex items-center my-4 sm:my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm font-medium">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Back to Login */}
                <div className="text-center space-y-2 sm:space-y-3">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Already have an account?</p>
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                    className="w-full bg-white/90 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                ← Back to Login
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-white/50 transform animate-pulse-3d">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-2xl sm:text-3xl">✅</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Success!
                </span>
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">{successMsg}</p>
            <button
              onClick={closeModal}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
                🌿 Continue
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
