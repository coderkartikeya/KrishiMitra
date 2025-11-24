"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/NavBar';
import {
  MessageCircle, X, Send, Phone, Cloud, Shield, MapPin,
  ChevronDown, ChevronUp, User, Bot, Search, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpSupport() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('general');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  // Ollama chatbot states
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'नमस्ते! मैं आपका कृषि सहायक हूँ। आप मुझसे खेती से जुड़े किसी भी प्रश्न के बारे में पूछ सकते हैं। (Hello! I am your agricultural assistant. You can ask me any farming-related questions.)' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // List of Indian states
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Query types
  const queryTypes = [
    { id: 'general', label: 'General Query' },
    { id: 'technical', label: 'Technical Assistance' },
    { id: 'schemes', label: 'Government Schemes' },
    { id: 'market', label: 'Market Information' },
    { id: 'pest', label: 'Pest & Disease Control' },
    { id: 'irrigation', label: 'Irrigation Issues' },
    { id: 'seeds', label: 'Seeds & Fertilizers' },
    { id: 'equipment', label: 'Farm Equipment' }
  ];

  const supportHighlights = [
    {
      title: 'Kisan Call Center',
      subtitle: '1800-180-1551',
      description: 'Speak directly with agricultural experts for immediate guidance.',
      icon: <Phone className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'AI Farming Assistant',
      subtitle: 'Instant Answers',
      description: 'Chat in Hindi or English for quick solutions and best practices.',
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Regional Committees',
      subtitle: 'State Specific Help',
      description: 'Connect with your local agricultural board for on-ground support.',
      icon: <MapPin className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      title: 'Government Schemes',
      subtitle: 'Application Support',
      description: 'Get personalised help with PM-KISAN, PMFBY and other schemes.',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ];

  const helplines = [
    {
      title: 'Kisan Call Center',
      number: '1800-180-1551',
      description: 'General farming guidance & seasonal advisories',
      icon: <Phone className="w-5 h-5" />
    },
    {
      title: 'Weather Helpline',
      number: '1800-220-161',
      description: 'District-wise weather alerts & irrigation planning',
      icon: <Cloud className="w-5 h-5" />
    },
    {
      title: 'Crop Insurance Support',
      number: '1800-116-515',
      description: 'Claims, enrolment and PMFBY grievance assistance',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  // Regional agricultural committees data
  const regionalCommittees = {
    'Andhra Pradesh': {
      name: 'Andhra Pradesh State Agricultural Board',
      address: 'Agricultural Complex, Labbipet, Vijayawada, Andhra Pradesh - 520010',
      phone: '0866-2474368',
      email: 'apagriboard@gmail.com',
      website: 'www.apagrisnet.gov.in'
    },
    'Karnataka': {
      name: 'Karnataka State Agricultural Marketing Board',
      address: '16, Raja Ram Mohan Roy Road, Bengaluru, Karnataka - 560027',
      phone: '080-22213976',
      email: 'ksamb@karnataka.gov.in',
      website: 'www.ksamb.karnataka.gov.in'
    },
    'Maharashtra': {
      name: 'Maharashtra State Agricultural Marketing Board',
      address: 'Plot No. R-7, Chhatrapati Shivaji Market Yard, Gultekdi, Pune, Maharashtra - 411037',
      phone: '020-24528100',
      email: 'msamb@maharashtra.gov.in',
      website: 'www.msamb.com'
    },
    'Punjab': {
      name: 'Punjab Mandi Board',
      address: 'Punjab Mandi Bhawan, Sector 65A, SAS Nagar, Mohali, Punjab - 160062',
      phone: '0172-2970183',
      email: 'info@mandiboard.nic.in',
      website: 'www.mandiboard.punjab.gov.in'
    },
    'Gujarat': {
      name: 'Gujarat State Agricultural Marketing Board',
      address: 'Gujarat State Agricultural Marketing Board Building, Nr. CH Road, Sector 10-A, Gandhinagar, Gujarat - 382010',
      phone: '079-23257702',
      email: 'gsamb@gujarat.gov.in',
      website: 'www.agri.gujarat.gov.in'
    },
    'Haryana': {
      name: 'Haryana State Agricultural Marketing Board',
      address: 'Mandi Bhawan, C-6, Sector-6, Panchkula, Haryana - 134109',
      phone: '0172-2561305',
      email: 'hsamb@hry.nic.in',
      website: 'www.hsamb.gov.in'
    },
    'Tamil Nadu': {
      name: 'Tamil Nadu Agricultural Marketing Board',
      address: 'Agri Marketing Board Building, Nandanam, Chennai, Tamil Nadu - 600035',
      phone: '044-24338764',
      email: 'tnsamb@tn.gov.in',
      website: 'www.tnagmark.tn.nic.in'
    },
    'Uttar Pradesh': {
      name: 'Uttar Pradesh State Agricultural Marketing Board',
      address: 'Mandi Bhawan, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh - 226010',
      phone: '0522-2720125',
      email: 'upsamb@up.gov.in',
      website: 'www.upsamb.org'
    }
  };

  // Default committee info for states not in the list
  const defaultCommittee = {
    name: 'Department of Agriculture',
    address: 'Please contact your local District Agriculture Office',
    phone: 'Contact your district agriculture helpline',
    email: 'agri.helpdesk@gov.in',
    website: 'www.agricoop.nic.in'
  };

  // Get committee info based on selected state
  const getCommitteeInfo = (state) => {
    return regionalCommittees[state] || defaultCommittee;
  };

  // Scroll to bottom of chat messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle chatbot message submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call Ollama API endpoint
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: 'llama3'
        }),
      });

      const data = await response.json();

      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later. (क्षमा करें, मुझे एक त्रुटि मिली। कृपया बाद में पुनः प्रयास करें।)'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the data to a backend service
    console.log({ name, email, phone, location, query, queryType });

    // Show success message
    setShowSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setLocation('');
      setQuery('');
      setQueryType('general');
      setShowSuccess(false);
    }, 3000);
  };

  const handleTabChange = (tabId) => {
    router.push(tabId);
  };

  // FAQ data
  const faqs = [
    {
      question: "How can I find information about government schemes for farmers?",
      answer: "You can visit our Government Schemes page to find detailed information about various schemes like PM-KISAN, PMFBY, and more. You can also contact your local agricultural committee for personalized guidance."
    },
    {
      question: "Where can I get help for pest and disease control?",
      answer: "For pest and disease control, you can contact your nearest Krishi Vigyan Kendra (KVK) or submit a query through this help page. Our experts will guide you on appropriate measures based on your crop and region."
    },
    {
      question: "How do I get soil testing done for my farm?",
      answer: "Soil testing services are available at your district Soil Testing Laboratory. You can collect soil samples as per guidelines and submit them to the lab. Many states also offer mobile soil testing facilities that visit villages periodically."
    },
    {
      question: "Where can I get information about market prices for my crops?",
      answer: "You can check current market prices on our Market page. Additionally, you can register for SMS alerts from your state agricultural marketing board or use the e-NAM mobile app for real-time price information."
    },
    {
      question: "How can I join a Farmer Producer Organization (FPO)?",
      answer: "To join an existing FPO, contact your local agricultural extension officer or district agriculture department. If there's no FPO in your area, you can gather 15-20 farmers and approach NABARD or Small Farmers' Agribusiness Consortium (SFAC) for guidance on forming a new FPO."
    }
  ];

  const committeeInfo = getCommitteeInfo(selectedState);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab="/dashboard/help" onTabChange={handleTabChange} />

      {/* Floating Chatbot Button */}
      <AnimatePresence>
        {!showChatbot && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChatbot}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:shadow-green-500/30 transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="font-bold pr-1">Ask AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modern Chatbot Window */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[90vw] max-w-md h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Krishi AI</h3>
                  <p className="text-xs text-green-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChatbot}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything about farming..."
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="md:ml-80 pt-20 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-6">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium tracking-wider uppercase">24/7 Support Center</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                How can we help you grow today?
                <span className="block text-2xl md:text-3xl font-normal mt-2 opacity-90">(हम आपकी कैसे सहायता कर सकते हैं?)</span>
              </h1>
              <p className="text-lg text-green-50 max-w-2xl leading-relaxed">
                Get expert advice, technical support, and instant answers to all your farming queries. Our team and AI assistant are here to help you succeed.
              </p>
            </div>
          </section>

          {/* Quick Support Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {supportHighlights.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm font-semibold text-green-600 mb-3">{item.subtitle}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Contact Form Section */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <Send className="w-6 h-6" />
                    </div>
                    Submit a Query
                  </h2>
                  <p className="text-gray-500 mt-2">Fill out the form below and our experts will get back to you within 24 hours.</p>
                </div>

                <div className="p-8">
                  {showSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                    >
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Query Submitted!</h3>
                      <p className="text-green-600">Thank you for reaching out. We will contact you shortly.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                              placeholder="Enter phone number"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">State</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <select
                              value={selectedState}
                              onChange={(e) => setSelectedState(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none appearance-none"
                              required
                            >
                              <option value="">Select State</option>
                              {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Query Type</label>
                          <div className="relative">
                            <HelpCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <select
                              value={queryType}
                              onChange={(e) => setQueryType(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none appearance-none"
                              required
                            >
                              {queryTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Your Message</label>
                        <textarea
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          rows="4"
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                          placeholder="Describe your issue in detail..."
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1"
                      >
                        Submit Query
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              {/* Regional Committee Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Regional Committee
                </h3>

                {selectedState ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">State Board</p>
                      <p className="font-bold text-gray-800">{committeeInfo.name}</p>
                    </div>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                        {committeeInfo.address}
                      </p>
                      <p className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        {committeeInfo.phone}
                      </p>
                      <p className="flex items-center gap-3">
                        <Cloud className="w-4 h-4 text-gray-400 shrink-0" />
                        {committeeInfo.website}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>Select your state to view local committee details</p>
                  </div>
                )}
              </div>

              {/* Helplines Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl shadow-xl p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-400" />
                  Emergency Helplines
                </h3>
                <div className="space-y-4">
                  {helplines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        {line.icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{line.title}</p>
                        <p className="font-bold text-lg tracking-wide">{line.number}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-500">Find quick answers to common questions about our services and farming support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}