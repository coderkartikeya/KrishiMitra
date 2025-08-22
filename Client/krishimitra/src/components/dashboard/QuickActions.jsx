'use client';

import React, { useState } from 'react';
import { Camera, FileText, Users, DollarSign, Bot, Sprout, ArrowRight, Leaf, TrendingUp, Tractor, Lightbulb, Droplets } from 'lucide-react';

const QuickActions = ({ onActionClick }) => {
  const [hoveredAction, setHoveredAction] = useState(null);

  const actions = [
    {
      id: 'scan_plant',
      title: 'Scan Plant',
      subtitle: 'Identify issues',
      icon: <Camera className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
      hoverColor: 'bg-green-600 text-white'
    },
    {
      id: 'my_crops',
      title: 'My Crops',
      subtitle: 'View status',
      icon: <Sprout className="w-6 h-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      hoverColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'govt_schemes',
      title: 'Govt Schemes',
      subtitle: 'Check eligibility',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'bg-blue-600 text-white'
    },
    {
      id: 'market_prices',
      title: 'Market Prices',
      subtitle: 'Latest rates',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-amber-100 text-amber-600',
      hoverColor: 'bg-amber-600 text-white'
    },
    {
      id: 'equipment',
      title: 'Equipment',
      subtitle: 'Rent & buy',
      icon: <Tractor className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600',
      hoverColor: 'bg-orange-600 text-white'
    },
    {
      id: 'community',
      title: 'Community',
      subtitle: 'Connect with farmers',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'bg-purple-600 text-white'
    },
    {
      id: 'ai_helper',
      title: 'AI Helper',
      subtitle: 'Get assistance',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-indigo-100 text-indigo-600',
      hoverColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'irrigation',
      title: 'Irrigation',
      subtitle: 'Water management',
      icon: <Droplets className="w-6 h-6" />,
      color: 'bg-cyan-100 text-cyan-600',
      hoverColor: 'bg-cyan-600 text-white'
    },
  ];

  const handleActionClick = (actionId) => {
    if (onActionClick) {
      onActionClick(actionId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">त्वरित कार्य <span className="text-sm text-gray-500">(Quick Actions)</span></h2>
          <button className="text-base text-green-600 hover:text-green-700 flex items-center gap-2 transition-colors bg-green-50 px-4 py-2 rounded-full font-bold">
            सभी देखें <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {actions.map((action) => (
            <div 
              key={action.id}
              className="p-5 rounded-xl border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleActionClick(action.id)}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              aria-label={action.englishTitle}
            >
              <div 
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200 ${hoveredAction === action.id ? action.hoverColor : action.color} shadow-md`}
              >
                {action.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-700 mt-1">{action.subtitle}</p>
              <div className="mt-2 text-xs text-gray-400">
                <span>{action.englishTitle}</span> • <span>{action.englishSubtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 border-t border-gray-100">
        <p className="text-base text-gray-700 text-center font-medium">
          किसी भी कार्य पर टैप करके सुविधा का उपयोग करें
        </p>
        <p className="text-sm text-gray-500 text-center mt-1">
          Tap on any action to quickly access the feature
        </p>
      </div>
    </div>
  );
};

export default QuickActions;