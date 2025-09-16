'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Users, Heart, Share2, Send, Search, Filter, Sparkles, Plus, Clock, Tag, X, ChevronUp, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useUserStore } from '../../../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../middleware/clientAuth.js';

const CommunityPage = () => {
  const router = useRouter();
  const {user} = useAuth();
  // console.log(user)
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [summaries, setSummaries] = useState({});
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const url = searchQuery ? `/api/community/posts?q=${encodeURIComponent(searchQuery)}` : '/api/community/posts';
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load posts');
        const data = await res.json();
        if (isMounted) setPosts(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        if (isMounted) setError('Unable to load community posts.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [searchQuery]);

  const categories = [
    { id: 'all', name: 'सभी (All)' },
    { id: 'crop-care', name: 'फसल देखभाल (Crop Care)' },
    { id: 'soil-management', name: 'मिट्टी प्रबंधन (Soil Management)' },
    { id: 'government-schemes', name: 'सरकारी योजनाएं (Government Schemes)' },
    { id: 'market-prices', name: 'बाज़ार भाव (Market Prices)' }
  ];

  const filteredPosts = useMemo(() => {
    if (activeTab === 'all') return posts;
    return posts.filter(p => (p.tags || []).some(t => t.toLowerCase().includes(activeTab.replace('-', ' '))));
  }, [posts, activeTab]);

  async function handleCreatePost() {
    if (!newTitle.trim() || !newContent.trim()) return;
    setCreating(true);
    try {
      const payload = {
        authorId: user?.id || '000000000000000000000000',
        authorName: user?.name || 'Anonymous Farmer',
        title: newTitle.trim(),
        content: newContent.trim(),
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const res = await fetch('/api/community/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to create post');
      const created = await res.json();
      setPosts(prev => [created, ...prev]);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      setShowNewPost(false);
    } catch (e) {
      alert('Could not create post.');
    } finally {
      setCreating(false);
    }
  }

  async function toggleLike(postId, isLiked) {
    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      const res = await fetch(`/api/community/posts/${postId}/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user?.id || '000000000000000000000000' }) });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: isLiked ? (p.likes || []).filter(id => id !== user?.id) : [ ...(p.likes||[]), user?.id ] } : p));
    } catch (e) {
      // ignore
    }
  }

  async function loadComments(postId) {
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCommentsByPost(prev => ({ ...prev, [postId]: data.items || [] }));
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
    } catch (e) {
      // ignore
    }
  }

  async function addComment(postId) {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    try {
      const payload = { authorId: user?.id || '000000000000000000000000', authorName: user?.name || 'Anonymous Farmer', content: text };
      const res = await fetch(`/api/community/posts/${postId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed');
      const created = await res.json();
      setCommentsByPost(prev => ({ ...prev, [postId]: [created, ...(prev[postId] || [])] }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
    } catch (e) {
      // ignore
    }
  }

  async function summarizePost(post) {
    try {
      const res = await fetch('/api/community/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: post.content }) });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSummaries(prev => ({ ...prev, [post._id]: data.summary }));
    } catch (e) {
      setSummaries(prev => ({ ...prev, [post._id]: 'Summary unavailable.' }));
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Crop Care': return 'bg-green-100 text-green-800';
      case 'Soil Management': return 'bg-blue-100 text-blue-800';
      case 'Government Schemes': return 'bg-purple-100 text-purple-800';
      case 'Market Prices': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'अभी-अभी';
    if (diffInHours < 24) return `${diffInHours} घंटे पहले`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} दिन पहले`;
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll position tracking for scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <DashboardLayout 
      title="किसान समुदाय (Farmer Community)" 
      subtitle="Connect, share, and learn with fellow farmers"
      icon={<Users className="w-6 h-6 text-green-600" />}
    >
      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-500 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search discussions, topics, or ask questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 text-gray-900 bg-white shadow-sm hover:shadow-md transition-all duration-300 outline-none"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 text-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
            Filter
          </motion.button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                activeTab === category.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Custom CSS for hiding scrollbar but allowing scroll */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* New Discussion Button */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 relative">
          Recent Discussions
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full"></span>
        </h2>
        <motion.button
          onClick={() => setShowNewPost(!showNewPost)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Discussion</span>
        </motion.button>
      </motion.div>

      {/* New Post Form */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                  Start a New Discussion
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewPost(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Discussion title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 text-gray-900 transition-all duration-300 outline-none shadow-sm"
                />
                <textarea
                  placeholder="Share your question or experience..."
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 resize-none text-gray-900 transition-all duration-300 outline-none shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated, e.g. wheat, soil)"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 text-gray-900 transition-all duration-300 outline-none shadow-sm"
                />
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: creating ? 1 : 1.05 }}
                    whileTap={{ scale: creating ? 1 : 0.95 }}
                    onClick={handleCreatePost} 
                    disabled={creating}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {creating ? 'Posting...' : 'Post Discussion'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col justify-center items-center py-12 space-y-4"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-white"></div>
            </div>
          </div>
          <p className="text-gray-500 animate-pulse">Loading discussions...</p>
        </motion.div>
      )}

      {/* No Posts Message */}
      {(!loading && !error && filteredPosts.length === 0) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-2 border-gray-100 rounded-xl p-10 text-center mb-8 shadow-md"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200 
            }}
          >
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No discussions yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Be the first to start a discussion in this community and connect with fellow farmers!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewPost(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start a Discussion
          </motion.button>
        </motion.div>
      )}

      {/* Posts List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {filteredPosts.map((post, index) => {
          const isLiked = (post.likes || []).includes(user?.id);
          return (
            <motion.div 
              key={post._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {post.authorName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-700">{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => summarizePost(post)} 
                    className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1 transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4" /> 
                    Summarize
                  </motion.button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                
                <AnimatePresence>
                  {summaries[post._id] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg"
                    >
                      <strong className="text-indigo-800 mr-2">Summary:</strong>
                      <span className="text-indigo-700">{summaries[post._id]}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tags */}
                {(post.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <motion.span 
                        key={index} 
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-all duration-300"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLike(post._id, isLiked)} 
                      className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{(post.likes || []).length}</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => expandedComments[post._id] ? setExpandedComments(prev => ({ ...prev, [post._id]: false })) : loadComments(post._id)} 
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">{post.commentsCount || 0}</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </motion.button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md" 
                    onClick={() => {
                      setExpandedComments(prev => ({ ...prev, [post._id]: true }));
                      if (!commentsByPost[post._id]) loadComments(post._id);
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </motion.button>
                </div>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {expandedComments[post._id] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100 bg-gray-50 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        {(commentsByPost[post._id] || []).map((c, commentIndex) => (
                          <motion.div 
                            key={c._id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: commentIndex * 0.05 }}
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {c.authorName.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{c.authorName}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{getTimeAgo(c.createdAt)}</span>
                            </div>
                            <div className="text-gray-800 whitespace-pre-wrap">{c.content}</div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {(user?.name || 'A').charAt(0)}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="relative group">
                            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-green-500 transition-colors duration-300" />
                            <input
                              value={commentInputs[post._id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                              placeholder="Write a comment..."
                              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 transition-all duration-300"
                            />
                          </div>
                          <div className="flex justify-end">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addComment(post._id)} 
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                            >
                              <Send className="w-4 h-4" /> 
                              Post
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-green-500 text-white rounded-full p-3 shadow-lg z-50"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default CommunityPage;