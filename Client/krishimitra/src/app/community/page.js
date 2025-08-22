'use client';

import { useState, useEffect } from 'react';

export default function FarmCommunity() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [posts, setPosts] = useState([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Basic translations
  const translations = {
    en: {
      newPost: "New Post",
      sharePost: "Share Post",
      askAI: "Ask AI",
      translate: "Translate",
      reply: "Reply",
      replies: "replies",
      farmCommunity: "Farm Community",
      connectShareGrow: "Connect • Share • Grow Together"
    },
    hi: {
      newPost: "नई पोस्ट",
      sharePost: "पोस्ट साझा करें",
      askAI: "AI से पूछें",
      translate: "अनुवाद",
      reply: "जवाब दें",
      replies: "जवाब",
      farmCommunity: "खेती समुदाय",
      connectShareGrow: "जुड़ें • साझा करें • एक साथ बढ़ें"
    }
  };

  // Fallback data
  const fallbackPosts = [
    {
      id: 1,
      author: "Rajesh Kumar",
      avatar: "👨‍🌾",
      time: "2 hours ago",
      content: "My tomato plants are showing yellow leaves. Has anyone faced this issue?",
      upvotes: 12,
      downvotes: 1,
      comments: [
        {
          author: "Priya Sharma",
          content: "This could be nitrogen deficiency. Try adding organic fertilizer.",
          time: "1 hour ago"
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(fallbackPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{translations[currentLanguage].farmCommunity}</h1>
                <p className="text-gray-500 text-sm">{translations[currentLanguage].connectShareGrow}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
              </select>
              
              <button 
                onClick={() => setShowNewPostModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>{translations[currentLanguage].newPost}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">{post.avatar}</span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">{post.author}</div>
                    <div className="text-gray-500 text-sm">{post.time}</div>
                  </div>
                </div>
                
                <p className="text-gray-900 text-base leading-relaxed mb-4">{post.content}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                      </svg>
                      <span>{post.upvotes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"/>
                      </svg>
                      <span>{post.downvotes}</span>
                    </button>
                  </div>
                  
                  <div className="text-gray-500 text-sm">
                    {post.comments.length} {translations[currentLanguage].replies}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-2xl w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Share with Community</h2>
              <button 
                onClick={() => setShowNewPostModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">What's on your mind?</label>
                <textarea 
                  placeholder="Share your farming experience, ask questions, or give advice..."
                  className="w-full h-32 border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors duration-200">
                  Share Post
                </button>
                <button 
                  onClick={() => setShowNewPostModal(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
