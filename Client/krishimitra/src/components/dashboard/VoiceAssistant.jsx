'use client';

import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';

const VoiceAssistant = ({ onActivate }) => {
  const [isListening, setIsListening] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Show tooltip briefly when component mounts
  useEffect(() => {
    setShowTooltip(true);
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleVoiceActivation = () => {
    setIsListening(!isListening);
    onActivate();
    
    if (!isListening) {
      setPulseAnimation(true);
      setTimeout(() => {
        setIsListening(false);
        setPulseAnimation(false);
      }, 3000);
    } else {
      setPulseAnimation(false);
    }
  };
  
  const handleMouseEnter = () => {
    if (!isListening) {
      setShowTooltip(true);
    }
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  return (
    <div className="relative flex items-center justify-center">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-base py-3 px-5 rounded-lg shadow-lg transition-opacity duration-300 whitespace-nowrap z-10">
          <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2 rotate-45 w-3 h-3 bg-gray-800"></div>
          {isListening ? 'Tap to stop listening' : 'Tap to speak with voice assistant'}
        </div>
      )}
      
      <div className="flex items-center bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-xl border-2 border-green-200 shadow-md">
        {/* Voice Button with Pulse Animation */}
        <div className="relative mr-4">
          {pulseAnimation && (
            <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
          )}
          
          <button
            onClick={handleVoiceActivation}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-br from-red-400 to-red-500 scale-110 animate-pulse' 
                : 'bg-gradient-to-br from-green-500 to-green-600 hover:scale-105'
            }`}
            aria-label={isListening ? 'Stop voice assistant' : 'Start voice assistant'}
          >
            {isListening ? (
              <X className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>
        
        {/* Text Content */}
        <div className="text-left">
          <p className="text-lg font-bold text-gray-800">
            {isListening ? 'Listening...' : 'Voice Assistant'}
          </p>
          <p className="text-base text-gray-600">
            {isListening ? 'बोलिए...' : 'बात करने के लिए टैप करें'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Ask about weather, crops, or market prices
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;