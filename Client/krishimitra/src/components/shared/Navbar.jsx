'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Sprout, Camera, TrendingUp, Users, FileText, 
  Bot, Microscope, MessageSquare, Menu, X, LogOut, User
} from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('hi'); // Default to Hindi
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    // In a real app, you would check for auth token in cookies or localStorage
    const authToken = localStorage.getItem('auth_token');
    setIsAuthenticated(!!authToken);
  }, []);

  // Navigation items based on folder structure
  const navItems = [
    { id: '/dashboard', label: 'मुख्य पृष्ठ', englishLabel: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: '/mycrops', label: 'मेरी फसलें', englishLabel: 'My Crops', icon: <Sprout className="w-5 h-5" /> },
    { id: '/plantDisease', label: 'रोग पहचान', englishLabel: 'Plant Disease', icon: <Camera className="w-5 h-5" /> },
    { id: '/plantscan', label: 'पौधा स्कैन', englishLabel: 'Plant Scan', icon: <Camera className="w-5 h-5" /> },
    { id: '/market', label: 'बाज़ार भाव', englishLabel: 'Market', icon: <TrendingUp className="w-5 h-5" /> },
    { id: '/schemes', label: 'सरकारी योजनाएँ', englishLabel: 'Schemes', icon: <FileText className="w-5 h-5" /> },
    { id: '/soilAnalysis', label: 'मिट्टी विश्लेषण', englishLabel: 'Soil Analysis', icon: <Microscope className="w-5 h-5" /> },
    { id: '/community', label: 'समुदाय', englishLabel: 'Community', icon: <MessageSquare className="w-5 h-5" /> },
    { id: '/help', label: 'सहायता', englishLabel: 'Help', icon: <Bot className="w-5 h-5" /> },
  ];

  // Language options
  const languages = [
    { name: 'हिंदी', code: 'hi', flag: '🇮🇳' },
    { name: 'English', code: 'en', flag: '🇬🇧' },
    { name: 'ಕನ್ನಡ', code: 'kn', flag: '🇮🇳' },
    { name: 'தமிழ்', code: 'ta', flag: '🇮🇳' },
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageModal(false);
    // In a real app, you would store this preference and update translations
    localStorage.setItem('preferred_language', langCode);
  };

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Determine if we should show the full navbar or just the landing page header
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Don't show navbar on auth pages
  if (isAuthPage) return null;

  return (
    <>
      {/* Main Header for all pages */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLandingPage ? 'bg-transparent' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              🌱
            </div>
            <span className={`font-bold text-xl ${isLandingPage ? 'text-white' : 'text-gray-800'}`}>KrishiMitra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              // Show nav items when authenticated
              <>
                {navItems.map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${pathname === item.id ? 'bg-green-50 text-green-600 font-medium' : isLandingPage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    <span className="hidden lg:inline">{item.englishLabel}</span>
                  </Link>
                ))}
                
                {/* Profile & Logout */}
                <div className="flex items-center gap-2 ml-4">
                  <Link 
                    href="/profile"
                    className={`p-2 rounded-full ${isLandingPage ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-green-100 hover:text-green-600 transition-colors`}
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className={`p-2 rounded-full ${isLandingPage ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-red-100 hover:text-red-600 transition-colors`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              // Show login/signup when not authenticated
              <>
                <button
                  onClick={() => router.push('/login')}
                  className={`font-medium transition-colors hover:text-green-600 ${isLandingPage ? 'text-white' : 'text-gray-700'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguageModal(!showLanguageModal)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isLandingPage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {languages.find(lang => lang.code === currentLanguage)?.flag}
              </button>
              
              {/* Language Modal */}
              {showLanguageModal && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 
              <X className={`w-6 h-6 ${isLandingPage ? 'text-white' : 'text-gray-900'}`} /> : 
              <Menu className={`w-6 h-6 ${isLandingPage ? 'text-white' : 'text-gray-900'}`} />
            }
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="py-4 px-4 space-y-3">
              {isAuthenticated ? (
                // Show nav items when authenticated
                <>
                  {navItems.map((item) => (
                    <Link 
                      key={item.id} 
                      href={item.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${pathname === item.id ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <span className="text-xs text-gray-500">({item.englishLabel})</span>
                    </Link>
                  ))}
                  
                  {/* Profile & Logout */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Link 
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                // Show login/signup when not authenticated
                <>
                  <button
                    onClick={() => {
                      router.push('/login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      router.push('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 bg-green-600 text-white rounded-lg px-4 hover:bg-green-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
              
              {/* Language Selector */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Select Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${currentLanguage === lang.code ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation - Only show when authenticated */}
      {isAuthenticated && !isLandingPage && !isAuthPage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
          <div className="flex justify-around">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                href={item.id}
                className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 transition-colors duration-200 ${pathname === item.id ? 'text-green-600 bg-green-50 border-t-2 border-green-500' : 'text-gray-500 hover:text-green-600'}`}
                aria-label={item.englishLabel}
              >
                <div className="relative">
                  {item.icon}
                  {pathname === item.id && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.englishLabel}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Content Padding - Add padding to the top of the page content to account for the fixed header */}
      <div className={`${isLandingPage || isAuthPage ? '' : 'pt-16 pb-20 md:pb-0'}`}></div>
    </>
  );
};

export default Navbar;