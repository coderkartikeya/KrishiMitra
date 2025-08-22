'use client'
import React, { useState, useEffect } from 'react';
import { 
  Leaf, Brain, Camera, TrendingUp, BookOpen, Users, MessageCircle, 
  Mic, Eye, ChevronRight, Star, Globe, Menu, X, Play, ArrowRight,
  Sprout, Bug, BarChart3, FileText, UserCheck, Bot, Phone, Mail,
  Facebook, Twitter, Instagram, ChevronDown, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { userStoreHelpers } from '../store/userStore.js'


// Language translations
const translations = {
  en: {
    hero: {
      title: "Smart Farming Made Simple with AI",
      subtitle: "Get crop advice, market insights, and community support in your language.",
      tryNow: "Try Now",
      learnMore: "Learn More"
    },
    features: {
      title: "Powerful AI Tools for Modern Farmers",
      subtitle: "Everything you need to grow smarter, not harder",
      items: [
        {
          title: "Crop & Soil Analysis",
          desc: "AI-powered recommendations based on your soil and weather conditions"
        },
        {
          title: "Disease & Pest Detection",
          desc: "Upload photos to instantly identify plant diseases and pests"
        },
        {
          title: "Market Prices & Predictions",
          desc: "Real-time market data and price forecasts for better decisions"
        },
        {
          title: "Farming Guides & Schemes",
          desc: "Access government schemes and step-by-step farming guides"
        },
        {
          title: "Community Forum",
          desc: "Connect with fellow farmers and get expert assistance"
        },
        {
          title: "AI Voice Assistant",
          desc: "Ask questions using voice commands in your local language"
        }
      ]
    },
    demo: {
      title: "Try Our AI Assistant",
      subtitle: "Experience the power of AI farming assistance",
      placeholder: "Ask me anything about farming...",
      voiceHint: "Tap to speak",
      cameraHint: "Upload crop photo"
    },
    community: {
      title: "Join Our Farming Community",
      subtitle: "Learn from thousands of successful farmers",
      joinButton: "Join the Conversation"
    },
    testimonials: {
      title: "Success Stories from Farmers Like You"
    },
    footer: {
      quickLinks: "Quick Links",
      contact: "Contact Us",
      followUs: "Follow Us",
      selectLanguage: "Select Language"
    }
  },
  hi: {
    hero: {
      title: "एआई के साथ स्मार्ट खेती बनाई आसान",
      subtitle: "अपनी भाषा में फसल की सलाह, बाजार की जानकारी और समुदाय का समर्थन प्राप्त करें।",
      tryNow: "अभी आज़माएं",
      learnMore: "और जानें"
    },
    features: {
      title: "आधुनिक किसानों के लिए शक्तिशाली एआई उपकरण",
      subtitle: "बेहतर खेती के लिए सब कुछ जो आपको चाहिए",
      items: [
        {
          title: "फसल और मिट्टी विश्लेषण",
          desc: "आपकी मिट्टी और मौसम की स्थिति के आधार पर एआई-संचालित सिफारिशें"
        },
        {
          title: "रोग और कीट पहचान",
          desc: "पौधों की बीमारियों और कीटों की तुरंत पहचान के लिए फोटो अपलोड करें"
        },
        {
          title: "बाजार मूल्य और पूर्वानुमान",
          desc: "बेहतर निर्णयों के लिए वास्तविक समय बाजार डेटा और मूल्य पूर्वानुमान"
        },
        {
          title: "खेती गाइड और योजनाएं",
          desc: "सरकारी योजनाओं और चरण-दर-चरण खेती गाइड तक पहुंच"
        },
        {
          title: "समुदायिक मंच",
          desc: "साथी किसानों से जुड़ें और विशेषज्ञ सहायता प्राप्त करें"
        },
        {
          title: "एआई वॉयस असिस्टेंट",
          desc: "अपनी स्थानीय भाषा में आवाज कमांड का उपयोग करके प्रश्न पूछें"
        }
      ]
    },
    demo: {
      title: "हमारे एआई असिस्टेंट को आज़माएं",
      subtitle: "एआई खेती सहायता की शक्ति का अनुभव करें",
      placeholder: "खेती के बारे में कुछ भी पूछें...",
      voiceHint: "बोलने के लिए टैप करें",
      cameraHint: "फसल की फोटो अपलोड करें"
    },
    community: {
      title: "हमारे खेती समुदाय में शामिल हों",
      subtitle: "हजारों सफल किसानों से सीखें",
      joinButton: "बातचीत में शामिल हों"
    },
    testimonials: {
      title: "आपके जैसे किसानों की सफलता की कहानियां"
    },
    footer: {
      quickLinks: "त्वरित लिंक",
      contact: "संपर्क करें",
      followUs: "हमें फॉलो करें",
      selectLanguage: "भाषा चुनें"
    }
  },
  pa: {
    hero: {
      title: "AI ਨਾਲ ਸਮਾਰਟ ਖੇਤੀ ਬਣਾਈ ਆਸਾਨ",
      subtitle: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਫਸਲ ਦੀ ਸਲਾਹ, ਮਾਰਕੀਟ ਦੀ ਜਾਣਕਾਰੀ ਅਤੇ ਕਮਿਉਨਿਟੀ ਸਪੋਰਟ ਪ੍ਰਾਪਤ ਕਰੋ।",
      tryNow: "ਹੁਣ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
      learnMore: "ਹੋਰ ਜਾਣੋ"
    },
    features: {
      title: "ਆਧੁਨਿਕ ਕਿਸਾਨਾਂ ਲਈ ਸ਼ਕਤੀਸ਼ਾਲੀ AI ਟੂਲਜ਼",
      subtitle: "ਬਿਹਤਰ ਖੇਤੀ ਲਈ ਸਭ ਕੁਝ ਜਿਸਦੀ ਤੁਹਾਨੂੰ ਲੋੜ ਹੈ",
      items: [
        {
          title: "ਫਸਲ ਅਤੇ ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ",
          desc: "ਤੁਹਾਡੀ ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਦੀ ਸਥਿਤੀ ਦੇ ਆਧਾਰ 'ਤੇ AI-ਸੰਚਾਲਿਤ ਸਿਫਾਰਿਸ਼ਾਂ"
        },
        {
          title: "ਬਿਮਾਰੀ ਅਤੇ ਕੀੜੇ ਦੀ ਪਛਾਣ",
          desc: "ਪੌਦਿਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਅਤੇ ਕੀੜਿਆਂ ਦੀ ਤੁਰੰਤ ਪਛਾਣ ਲਈ ਫੋਟੋਆਂ ਅਪਲੋਡ ਕਰੋ"
        },
        {
          title: "ਮਾਰਕੀਟ ਕੀਮਤਾਂ ਅਤੇ ਪੂਰਵ ਅਨੁਮਾਨ",
          desc: "ਬਿਹਤਰ ਫੈਸਲਿਆਂ ਲਈ ਰੀਅਲ-ਟਾਈਮ ਮਾਰਕੀਟ ਡੇਟਾ ਅਤੇ ਕੀਮਤ ਪੂਰਵ ਅਨੁਮਾਨ"
        },
        {
          title: "ਖੇਤੀ ਗਾਈਡ ਅਤੇ ਸਕੀਮਾਂ",
          desc: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਕਦਮ-ਦਰ-ਕਦਮ ਖੇਤੀ ਗਾਈਡਾਂ ਤੱਕ ਪਹੁੰਚ"
        },
        {
          title: "ਕਮਿਉਨਿਟੀ ਫੋਰਮ",
          desc: "ਸਾਥੀ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ ਅਤੇ ਮਾਹਿਰ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ"
        },
        {
          title: "AI ਵੌਇਸ ਸਹਾਇਕ",
          desc: "ਆਪਣੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਆਵਾਜ਼ ਕਮਾਂਡਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਵਾਲ ਪੁੱਛੋ"
        }
      ]
    },
    demo: {
      title: "ਸਾਡੇ AI ਸਹਾਇਕ ਨੂੰ ਅਜ਼ਮਾਓ",
      subtitle: "AI ਖੇਤੀ ਸਹਾਇਤਾ ਦੀ ਸ਼ਕਤੀ ਦਾ ਅਨੁਭਵ ਕਰੋ",
      placeholder: "ਖੇਤੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
      voiceHint: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
      cameraHint: "ਫਸਲ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ"
    },
    community: {
      title: "ਸਾਡੀ ਖੇਤੀ ਕਮਿਉਨਿਟੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
      subtitle: "ਹਜ਼ਾਰਾਂ ਸਫਲ ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਖੋ",
      joinButton: "ਗੱਲਬਾਤ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ"
    },
    testimonials: {
      title: "ਤੁਹਾਡੇ ਵਰਗੇ ਕਿਸਾਨਾਂ ਦੀਆਂ ਸਫਲਤਾ ਦੀਆਂ ਕਹਾਣੀਆਂ"
    },
    footer: {
      quickLinks: "ਤਤਕਾਲ ਲਿੰਕ",
      contact: "ਸੰਪਰਕ ਕਰੋ",
      followUs: "ਸਾਡੇ ਨਾਲ ਜੁੜੋ",
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ"
    }
  }
};

const FarmerPlatform = () => {
  const [currentLanguage, setCurrentLanguage] = useState(userStoreHelpers.getUserLanguage() || 'en');
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const router=useRouter();
  // const {setL}
  

  const t = translations[currentLanguage];
  

  // Persist language preference to user store whenever it changes
  useEffect(() => {
    try {
      userStoreHelpers.setUserLanguage(currentLanguage);
      // console.log(userStoreHelpers.getUserLanguage());
    } catch (e) {}
  }, [currentLanguage]);

  // Typing animation for demo
  const demoText = "How can I improve my wheat yield this season?";
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typingText.length < demoText.length) {
      const timeout = setTimeout(() => {
        setTypingText(demoText.slice(0, typingText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typingText]);

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const features = [
    { icon: <Sprout className="w-8 h-8" />, color: "from-green-400 to-green-600" },
    { icon: <Bug className="w-8 h-8" />, color: "from-red-400 to-red-600" },
    { icon: <BarChart3 className="w-8 h-8" />, color: "from-blue-400 to-blue-600" },
    { icon: <FileText className="w-8 h-8" />, color: "from-yellow-400 to-yellow-600" },
    { icon: <Users className="w-8 h-8" />, color: "from-purple-400 to-purple-600" },
    { icon: <Bot className="w-8 h-8" />, color: "from-indigo-400 to-indigo-600" }
  ];

  const communityPosts = {
    en: [
      {
        avatar: "👨‍🌾",
        name: "Raj Kumar",
        title: "Best fertilizer for wheat in Punjab?",
        preview: "Looking for organic fertilizer recommendations for better yield...",
        replies: 12,
        likes: 24
      },
      {
        avatar: "👩‍🌾",
        name: "Priya Sharma",
        title: "Cotton pest problem solution",
        preview: "Found white flies on my cotton plants. Any immediate solutions?",
        replies: 8,
        likes: 16
      },
      {
        avatar: "👨‍🌾",
        name: "Singh Ji",
        title: "Market price prediction accuracy",
        preview: "This app predicted tomato price rise correctly! Saved me ₹50k",
        replies: 15,
        likes: 45
      }
    ],
    hi: [
      {
        avatar: "👨‍🌾",
        name: "राज कुमार",
        title: "पंजाब में गेहूं के लिए सबसे अच्छा खाद कौन सा है?",
        preview: "बेहतर उत्पादन के लिए जैविक उर्वरक की सिफारिशों की तलाश कर रहे हैं...",
        replies: 12,
        likes: 24
      },
      {
        avatar: "👩‍🌾",
        name: "प्रिया शर्मा",
        title: "कपास की कीट समस्या का समाधान",
        preview: "मेरे कपास के पौधों पर सफेद मक्खियां मिलीं। कोई तत्काल समाधान?",
        replies: 8,
        likes: 16
      },
      {
        avatar: "👨‍🌾",
        name: "सिंह जी",
        title: "बाजार मूल्य पूर्वानुमान की सटीकता",
        preview: "इस ऐप ने टमाटर की कीमत बढ़ने का सही पूर्वानुमान लगाया! मुझे ₹50हजार बचाए",
        replies: 15,
        likes: 45
      }
    ],
    pa: [
      {
        avatar: "👨‍🌾",
        name: "ਰਾਜ ਕੁਮਾਰ",
        title: "ਪੰਜਾਬ ਵਿੱਚ ਕਣਕ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ ਕਿਹੜੀ ਹੈ?",
        preview: "ਬਿਹਤਰ ਉਤਪਾਦਨ ਲਈ ਜੈਵਿਕ ਖਾਦ ਦੀਆਂ ਸਿਫਾਰਿਸ਼ਾਂ ਦੀ ਭਾਲ ਕਰ ਰਿਹਾ ਹਾਂ...",
        replies: 12,
        likes: 24
      },
      {
        avatar: "👩‍🌾",
        name: "ਪ੍ਰਿਯਾ ਸ਼ਰਮਾ",
        title: "ਕਪਾਹ ਦੇ ਕੀੜੇ ਦੀ ਸਮੱਸਿਆ ਦਾ ਹੱਲ",
        preview: "ਮੇਰੇ ਕਪਾਹ ਦੇ ਪੌਦਿਆਂ 'ਤੇ ਚਿੱਟੀਆਂ ਮੱਖੀਆਂ ਮਿਲੀਆਂ ਹਨ। ਕੋਈ ਤਤਕਾਲ ਹੱਲ?",
        replies: 8,
        likes: 16
      },
      {
        avatar: "👨‍🌾",
        name: "ਸਿੰਘ ਜੀ",
        title: "ਮਾਰਕੀਟ ਕੀਮਤ ਪੂਰਵ ਅਨੁਮਾਨ ਦੀ ਸਟੀਕਤਾ",
        preview: "ਇਸ ਐਪ ਨੇ ਟਮਾਟਰ ਦੀ ਕੀਮਤ ਵਧਣ ਦਾ ਸਹੀ ਪੂਰਵ ਅਨੁਮਾਨ ਲਗਾਇਆ! ਮੇਰੇ ₹50ਹਜ਼ਾਰ ਬਚਾਏ",
        replies: 15,
        likes: 45
      }
    ]
  };

  const testimonials = {
    en: [
      {
        name: "Ramesh Patel",
        location: "Gujarat",
        image: "👨‍🌾",
        quote: "Increased my cotton yield by 30% using AI recommendations!",
        rating: 5
      },
      {
        name: "Sunita Devi",
        location: "Punjab",
        image: "👩‍🌾",
        quote: "Disease detection saved my entire wheat crop this year.",
        rating: 5
      },
      {
        name: "Ahmed Khan",
        location: "Maharashtra",
        image: "👨‍🌾",
        quote: "Market predictions helped me sell at the right time.",
        rating: 5
      }
    ],
    hi: [
      {
        name: "रमेश पटेल",
        location: "गुजरात",
        image: "👨‍🌾",
        quote: "एआई सिफारिशों का उपयोग करके मेरी कपास की उत्पादन में 30% की वृद्धि हुई!",
        rating: 5
      },
      {
        name: "सुनीता देवी",
        location: "पंजाब",
        image: "👩‍🌾",
        quote: "रोग पहचान ने इस साल मेरी पूरी गेहूं की फसल बचाई।",
        rating: 5
      },
      {
        name: "अहमद खान",
        location: "महाराष्ट्र",
        image: "👨‍🌾",
        quote: "बाजार पूर्वानुमान ने मुझे सही समय पर बेचने में मदद की।",
        rating: 5
      }
    ],
    pa: [
      {
        name: "ਰਮੇਸ਼ ਪਟੇਲ",
        location: "ਗੁਜਰਾਤ",
        image: "👨‍🌾",
        quote: "AI ਸਿਫਾਰਿਸ਼ਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਮੇਰੇ ਕਪਾਹ ਦੀ ਪੈਦਾਵਾਰ ਵਿੱਚ 30% ਵਾਧਾ ਹੋਇਆ!",
        rating: 5
      },
      {
        name: "ਸੁਨੀਤਾ ਦੇਵੀ",
        location: "ਪੰਜਾਬ",
        image: "👩‍🌾",
        quote: "ਬਿਮਾਰੀ ਪਛਾਣ ਨੇ ਇਸ ਸਾਲ ਮੇਰੀ ਪੂਰੀ ਕਣਕ ਦੀ ਫਸਲ ਬਚਾਈ।",
        rating: 5
      },
      {
        name: "ਅਹਿਮਦ ਖਾਨ",
        location: "ਮਹਾਰਾਸ਼ਟਰ",
        image: "👨‍🌾",
        quote: "ਮਾਰਕੀਟ ਪੂਰਵ ਅਨੁਮਾਨ ਨੇ ਮੈਨੂੰ ਸਹੀ ਸਮੇਂ 'ਤੇ ਵੇਚਣ ਵਿੱਚ ਮਦਦ ਕੀਤੀ।",
        rating: 5
      }
    ]
  };

  const handleLanguageSelect = (langCode) => {
    userStoreHelpers.setUserLanguage(langCode);
    setCurrentLanguage(langCode);
    setShowLanguageModal(false);
  };

  const handleAuthAction = (action) => {
    setAuthMode(action);
    setShowAuthModal(true);
  };

  if (showLanguageModal && currentLanguage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Language</h2>
            <p className="text-gray-600">अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ</p>
          </div>
          <div className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium text-gray-900">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed w-full z-40 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`}>
                KrishiMitra
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => router.push('/login')}
                className={`font-medium transition-colors hover:text-green-600 ${
                  scrollY > 50 ? 'text-gray-700' : 'text-white'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => router.push('/signup')}
                className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105"
              >
                Sign Up
              </button>
              
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowLanguageModal(true)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    scrollY > 50 ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`} /> : 
                <Menu className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`} />
              }
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => router.push('/login')}
                className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
              >
                Login
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="block w-full text-left py-2 bg-green-600 text-white rounded-lg px-4 hover:bg-green-700"
              >
                Sign Up
              </button>
              <button 
                onClick={() => setShowLanguageModal('true')}
                className="flex items-center gap-2 py-2 text-gray-700"
              >
                <Globe className="w-4 h-4" />
                {t.footer.selectLanguage}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-green-500"></div>
        <div 
          className="absolute inset-0 bg-black/30"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}
        ></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              <Leaf className="w-6 h-6 text-white" />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button 
                onClick={()=>router.push('/login')}
                className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                {t.hero.tryNow}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-green-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all backdrop-blur-sm">
                {t.hero.learnMore}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${features[index].color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <div className="text-white">
                    {features[index].icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.demo.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.demo.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl">
              {/* Chat Interface */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 mb-4">
                      <p className="text-gray-800">Hello! I'm your AI farming assistant. How can I help you today?</p>
                    </div>
                  </div>
                </div>

                {/* User Message with Typing Effect */}
                <div className="flex items-start gap-4 justify-end mb-4">
                  <div className="flex-1 text-right">
                    <div className="bg-green-600 text-white rounded-2xl rounded-tr-none p-4 inline-block max-w-md">
                      <p>{typingText}<span className="animate-pulse">|</span></p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    👨‍🌾
                  </div>
                </div>

                {/* AI Response */}
                {typingText.length === demoText.length && (
                  <div className="flex items-start gap-4 animate-fadeInUp">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                        <p className="text-gray-800">Based on your soil analysis, I recommend using NPK fertilizer with a 20-10-10 ratio. Also, consider these tips: 1) Plant after soil temperature reaches 60°F, 2) Maintain proper irrigation, 3) Monitor for common pests like aphids.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Controls */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={t.demo.placeholder}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                      readOnly
                    />
                  </div>
                  <button className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg group">
                    <Mic className="w-6 h-6 text-white group-hover:animate-pulse" />
                  </button>
                  <button className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg group">
                    <Camera className="w-6 h-6 text-white group-hover:animate-pulse" />
                  </button>
                </div>
                <div className="flex justify-center gap-8 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    {t.demo.voiceHint}
                  </span>
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    {t.demo.cameraHint}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.community.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.community.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {communityPosts[currentLanguage].map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-green-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{post.avatar}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{post.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        ❤️ {post.likes}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.preview}</p>
                
                {/* Language indicator for authentic feel */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Globe className="w-3 h-3" />
                    {currentLanguage === 'hi' ? 'हिंदी में' : currentLanguage === 'pa' ? 'ਪੰਜਾਬੀ ਵਿੱਚ' : 'In English'}
                  </div>
                  <button className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
                    {currentLanguage === 'hi' ? 'पढ़ें' : currentLanguage === 'pa' ? 'ਪੜ੍ਹੋ' : 'Read more'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => router.push('/signup')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
            >
              {t.community.joinButton}
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.testimonials.title}
            </h2>
          </div>

          <div className="relative">
            <div className="flex transition-transform duration-500 ease-in-out"
                 style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials[currentLanguage].map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl border border-green-100">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{testimonial.image}</div>
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="text-lg text-gray-600">
                        <div className="font-semibold">{testimonial.name}</div>
                        <div>{testimonial.location}</div>
                      </div>
                      
                      {/* Authenticity badge */}
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        <Check className="w-4 h-4" />
                        {currentLanguage === 'hi' ? 'सत्यापित किसान' : 
                         currentLanguage === 'pa' ? 'ਸਤਿਆਪਿਤ ਕਿਸਾਨ' : 'Verified Farmer'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials[currentLanguage].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-green-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">KrishiMitra</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering farmers with advanced AI technology for better productivity and profitability.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">{t.footer.quickLinks}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Schemes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">{t.footer.contact}</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 98765-43210
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@farmai.com
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">{t.footer.followUs}</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>

              {/* Language Selector */}
              <div className="mt-6">
                <button 
                  onClick={() => setShowLanguageModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                  {languages.find(lang => lang.code === currentLanguage)?.name}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FarmAI Platform. All rights reserved. Made with ❤️ for farmers.</p>
          </div>
        </div>
      </footer>

      

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #16a34a;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #15803d;
        }
      `}</style>
    </div>
  );
};

export default FarmerPlatform;