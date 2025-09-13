'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Users, Heart, Share2, Send, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const CommunityPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const discussions = [
    {
      id: 1,
      title: 'गेहूं की फसल में कीट नियंत्रण (Wheat Pest Control)',
      author: 'राम सिंह (Ram Singh)',
      authorLocation: 'मेरठ, उत्तर प्रदेश',
      time: '2 hours ago',
      likes: 24,
      comments: 8,
      category: 'Crop Care',
      content: 'मेरे गेहूं के खेत में कुछ कीट दिख रहे हैं। कृपया सुझाव दें कि कैसे नियंत्रण करूं?',
      tags: ['wheat', 'pest-control', 'organic-farming']
    },
    {
      id: 2,
      title: 'मिट्टी की जांच के लिए सर्वोत्तम समय (Best Time for Soil Testing)',
      author: 'प्रिया शर्मा (Priya Sharma)',
      authorLocation: 'आगरा, उत्तर प्रदेश',
      time: '5 hours ago',
      likes: 18,
      comments: 12,
      category: 'Soil Management',
      content: 'मिट्टी की जांच कब करवाना चाहिए? कौन सी जगह से करवाएं?',
      tags: ['soil-testing', 'fertilizer', 'agriculture']
    },
    {
      id: 3,
      title: 'सरकारी योजनाओं की जानकारी (Government Schemes Info)',
      author: 'अमित कुमार (Amit Kumar)',
      authorLocation: 'लखनऊ, उत्तर प्रदेश',
      time: '1 day ago',
      likes: 32,
      comments: 15,
      category: 'Government Schemes',
      content: 'PM Kisan योजना के लिए कैसे आवेदन करें? क्या दस्तावेज चाहिए?',
      tags: ['pm-kisan', 'government-schemes', 'subsidy']
    }
  ];

  const categories = [
    { id: 'all', name: 'सभी (All)', count: 45 },
    { id: 'crop-care', name: 'फसल देखभाल (Crop Care)', count: 18 },
    { id: 'soil-management', name: 'मिट्टी प्रबंधन (Soil Management)', count: 12 },
    { id: 'government-schemes', name: 'सरकारी योजनाएं (Government Schemes)', count: 8 },
    { id: 'market-prices', name: 'बाज़ार भाव (Market Prices)', count: 7 }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Crop Care': return 'bg-green-100 text-green-800';
      case 'Soil Management': return 'bg-blue-100 text-blue-800';
      case 'Government Schemes': return 'bg-purple-100 text-purple-800';
      case 'Market Prices': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout 
      title="किसान समुदाय (Farmer Community)" 
      subtitle="Connect, share, and learn with fellow farmers"
      icon={<Users className="w-6 h-6 text-green-600" />}
    >
      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Discussions */}
      <div className="space-y-6">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Discussion Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{discussion.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{discussion.author}</span>
                  <span>•</span>
                  <span>{discussion.authorLocation}</span>
                  <span>•</span>
                  <span>{discussion.time}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(discussion.category)}`}>
                {discussion.category}
              </span>
            </div>

            {/* Discussion Content */}
            <p className="text-gray-700 mb-4">{discussion.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {discussion.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Discussion Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{discussion.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span>{discussion.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Start New Discussion */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Start a New Discussion</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Discussion title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <textarea
            placeholder="Share your question or experience..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Send className="w-5 h-5" />
              Post Discussion
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;
