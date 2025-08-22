'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Set initial time
    setCurrentTime(new Date());
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Format date as Day, Month Date, Year
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get Hindi date format
  const getHindiDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const hindiMonths = [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
    ];
    
    const hindiDays = [
      'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार',
      'गुरुवार', 'शुक्रवार', 'शनिवार'
    ];
    
    return `${hindiDays[date.getDay()]}, ${day} ${hindiMonths[month]} ${year}`;
  };
  
  // Get greeting based on time of day
  const getGreeting = (date) => {
    const hours = date.getHours();
    
    if (hours < 12) {
      return 'शुभ प्रभात';
    } else if (hours < 18) {
      return 'शुभ दोपहर';
    } else {
      return 'शुभ संध्या';
    }
  };
  
  // Get English greeting based on time of day
  const getEnglishGreeting = (date) => {
    const hours = date.getHours();
    
    if (hours < 12) {
      return 'Good Morning';
    } else if (hours < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  
  // Get icon based on time of day
  const getTimeIcon = (date) => {
    const hours = date.getHours();
    
    if (hours >= 6 && hours < 10) {
      return <Sunrise className="w-8 h-8 text-amber-500" />;
    } else if (hours >= 10 && hours < 17) {
      return <Sun className="w-8 h-8 text-amber-500" />;
    } else if (hours >= 17 && hours < 20) {
      return <Sunset className="w-8 h-8 text-orange-500" />;
    } else {
      return <Moon className="w-8 h-8 text-indigo-400" />;
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md overflow-hidden border-2 border-blue-100">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Time and Date Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-500 bg-blue-50 p-1 rounded-lg" />
              <span className="text-4xl font-bold text-gray-800">{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center gap-3 ml-1">
              <Calendar className="w-6 h-6 text-gray-500" />
              <div className="flex flex-col">
                <span className="text-lg font-medium text-gray-700">{getHindiDate(currentTime)}</span>
                <span className="text-sm text-gray-500">{formatDate(currentTime)}</span>
              </div>
            </div>
          </div>
          
          {/* Greeting Section */}
          <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100 mt-4 md:mt-0">
            <div className="p-2 rounded-full bg-green-100 shadow-sm">
              {getTimeIcon(currentTime)}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-green-700">{getGreeting(currentTime)}, किसान!</span>
              <span className="text-sm text-green-600">{getEnglishGreeting(currentTime)}, Farmer!</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-600 px-6 py-4 text-white">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">आज का मौसम <span className="text-sm">(Today's Weather)</span></span>
          <span className="text-xl font-bold">धूप, 28°C</span>
        </div>
      </div>
    </div>
  );
};

export default DateTimeDisplay;