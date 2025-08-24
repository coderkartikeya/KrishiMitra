"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function HelpSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('general');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedState, setSelectedState] = useState('');

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Farmer Support Center (किसान सहायता केंद्र)</h1>
          <p className="text-lg">Get help from your regional agricultural committee for any farming-related queries (अपने क्षेत्रीय कृषि समिति से किसी भी खेती संबंधी प्रश्नों के लिए सहायता प्राप्त करें)</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">Farmer Support Center (किसान सहायता केंद्र)</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get assistance from your regional agricultural committee for any farming-related queries or issues.
            Our experts are here to help you with crop management, pest control, government schemes, and more.
            (किसी भी कृषि संबंधित प्रश्न या समस्या के लिए अपनी क्षेत्रीय कृषि समिति से सहायता प्राप्त करें।
            हमारे विशेषज्ञ फसल प्रबंधन, कीट नियंत्रण, सरकारी योजनाओं और अन्य मामलों में आपकी मदद के लिए यहां हैं।)
          </p>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Submit Your Query (अपना प्रश्न भेजें)</h2>
              
              {showSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p>Your query has been submitted successfully! Our team will contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="name">
                        Full Name (पूरा नाम) *
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email Address (ईमेल पता) *
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="phone">
                        Phone Number (फोन नंबर) *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="state">
                        State (राज्य) *
                      </label>
                      <select
                        id="state"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        required
                      >
                        <option value="">Select your state (अपना राज्य चुनें)</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="location">
                      Village/District (गांव/जिला) *
                    </label>
                    <input
                      id="location"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="queryType">
                      Query Type (प्रश्न का प्रकार) *
                    </label>
                    <select
                      id="queryType"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={queryType}
                      onChange={(e) => setQueryType(e.target.value)}
                      required
                    >
                      {queryTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="query">
                      Your Query (आपका प्रश्न) *
                    </label>
                    <textarea
                      id="query"
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="5"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Please describe your farming issue or query in detail... (कृपया अपनी खेती की समस्या या प्रश्न का विस्तार से वर्णन करें...)"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    Submit Query (प्रश्न भेजें)
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Regional Committee Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Your Regional Agricultural Committee</h2>
              
              {selectedState ? (
                <div>
                  <h3 className="font-bold text-green-700 text-lg mb-2">{getCommitteeInfo(selectedState).name}</h3>
                  <div className="space-y-3 text-gray-700">
                    <p><span className="font-semibold">Address:</span> {getCommitteeInfo(selectedState).address}</p>
                    <p><span className="font-semibold">Phone:</span> {getCommitteeInfo(selectedState).phone}</p>
                    <p><span className="font-semibold">Email:</span> {getCommitteeInfo(selectedState).email}</p>
                    <p><span className="font-semibold">Website:</span> {getCommitteeInfo(selectedState).website}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Please select your state to see your regional agricultural committee's contact information.</p>
              )}
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-3">Direct Helplines</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="bg-green-100 rounded-full p-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Kisan Call Center: <strong>1800-180-1551</strong></span>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-100 rounded-full p-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Weather Helpline: <strong>1800-220-161</strong></span>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-100 rounded-full p-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Crop Insurance: <strong>1800-116-515</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न)</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-2 text-gray-800">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}