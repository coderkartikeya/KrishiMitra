"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../../components/NavBar';

export default function GovernmentSchemes() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportLocation, setSupportLocation] = useState('');
  const [supportQuery, setSupportQuery] = useState('');

  // List of Indian states for the dropdown
  const states = [
    'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Categories of schemes
  const categories = [
    'All Categories', 'Financial Support', 'Crop Insurance', 'Irrigation', 
    'Marketing Support', 'Pension', 'Credit & Loans', 'Infrastructure'
  ];

  // Government schemes data
  const schemes = [
    {
      id: 1,
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      category: 'Financial Support',
      description: 'Income support of ₹6,000 per year in three equal installments to all land holding farmer families.',
      eligibility: 'All landholding farmers with cultivable land, subject to certain exclusions.',
      benefits: '₹6,000 per year transferred directly to farmers\' bank accounts in three installments of ₹2,000 each.',
      applicationProcess: 'Apply through the local revenue officer (Patwari/Lekhpal) or Common Service Centers or PM-KISAN portal.',
      website: 'https://pmkisan.gov.in/',
      states: 'All States',
      image: '/images/pm-kisan.jpg'
    },
    {
      id: 2,
      name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      category: 'Crop Insurance',
      description: 'Comprehensive crop insurance scheme to protect farmers from crop losses due to natural calamities.',
      eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.',
      benefits: 'Insurance coverage and financial support to farmers in case of crop failure due to natural calamities, pests & diseases.',
      applicationProcess: 'Apply through nearest agriculture office, banks, insurance companies or Common Service Centers.',
      website: 'https://pmfby.gov.in/',
      states: 'All States',
      image: '/images/pmfby.jpg'
    },
    {
      id: 3,
      name: 'PM-KMY (Pradhan Mantri Kisan Maandhan Yojana)',
      category: 'Pension',
      description: 'Pension scheme for small and marginal farmers providing financial security in their old age.',
      eligibility: 'Small and marginal farmers between 18-40 years of age with cultivable land up to 2 hectares.',
      benefits: 'Monthly pension of ₹3,000 after attaining the age of 60 years.',
      applicationProcess: 'Apply through Common Service Centers or PM-KMY portal.',
      website: 'https://pmkmy.gov.in/',
      states: 'All States',
      image: '/images/pm-kmy.jpg'
    },
    {
      id: 4,
      name: 'Agriculture Infrastructure Fund (AIF)',
      category: 'Infrastructure',
      description: 'Financing facility for investment in agriculture infrastructure projects.',
      eligibility: 'Farmers, FPOs, PACS, Marketing Cooperative Societies, SHGs, Joint Liability Groups, Multipurpose Cooperative Societies, Agri-entrepreneurs, Start-ups, and Central/State agency or Local Body sponsored Public-Private Partnership Projects.',
      benefits: 'Interest subvention and credit guarantee support for loans up to ₹2 crore.',
      applicationProcess: 'Apply through participating lending institutions or AIF portal.',
      website: 'https://agriinfra.dac.gov.in/',
      states: 'All States',
      image: '/images/aif.jpg'
    },
    {
      id: 5,
      name: 'Modified Interest Subvention Scheme (MISS)',
      category: 'Credit & Loans',
      description: 'Provides short-term crop loans to farmers at subsidized interest rates.',
      eligibility: 'All farmers availing short-term crop loans up to ₹3 lakh.',
      benefits: 'Interest subvention of 2% per annum and additional 3% for prompt repayment, effectively reducing interest rate to 4% per annum.',
      applicationProcess: 'Apply through scheduled commercial banks, RRBs, small finance banks, and cooperative banks.',
      website: 'https://agricoop.gov.in/',
      states: 'All States',
      image: '/images/miss.jpg'
    },
    {
      id: 6,
      name: 'National Mission for Sustainable Agriculture (NMSA)',
      category: 'Irrigation',
      description: 'Promotes sustainable agriculture through climate change adaptation measures.',
      eligibility: 'All farmers, with special focus on rainfed areas.',
      benefits: 'Support for soil health management, water use efficiency, pest management, and climate change adaptation.',
      applicationProcess: 'Apply through state agriculture department or district agriculture office.',
      website: 'https://nmsa.dac.gov.in/',
      states: 'All States',
      image: '/images/nmsa.jpg'
    },
    {
      id: 7,
      name: 'e-NAM (National Agriculture Market)',
      category: 'Marketing Support',
      description: 'Online trading platform for agricultural commodities to ensure better price discovery.',
      eligibility: 'All farmers can sell their produce through e-NAM enabled APMC mandis.',
      benefits: 'Better price discovery, reduced transaction costs, and access to a nationwide market.',
      applicationProcess: 'Register at nearest e-NAM enabled APMC mandi with required documents.',
      website: 'https://enam.gov.in/',
      states: 'All States',
      image: '/images/enam.jpg'
    },
    {
      id: 8,
      name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      category: 'Financial Support',
      description: 'Promotes organic farming through cluster approach and Participatory Guarantee System (PGS) certification.',
      eligibility: 'All farmers willing to adopt organic farming practices.',
      benefits: 'Financial assistance of ₹50,000 per hectare for a three-year period for cluster formation, training, certification, and marketing.',
      applicationProcess: 'Apply through state agriculture department or district agriculture office.',
      website: 'https://pgsindia-ncof.gov.in/',
      states: 'All States',
      image: '/images/pkvy.jpg'
    }
  ];

  // Agricultural committees data
  const agriculturalCommittees = [
    {
      name: 'Agricultural Produce Market Committee (APMC)',
      description: 'Regulates agricultural markets to ensure fair trade between buyers and sellers.',
      stateWiseContacts: {
        'Karnataka': 'Karnataka State Agricultural Marketing Board, Tel: 080-2341-0222',
        'Maharashtra': 'Maharashtra State Agricultural Marketing Board, Tel: 020-2553-7686',
        'Gujarat': 'Gujarat State Agricultural Marketing Board, Tel: 079-2321-0201',
        'Punjab': 'Punjab Mandi Board, Tel: 0172-2704-180',
        'Haryana': 'Haryana State Agricultural Marketing Board, Tel: 0172-2561-305',
        'All States': 'Contact your nearest APMC market yard or district agriculture office'
      }
    },
    {
      name: 'Farmer Producer Organizations (FPOs)',
      description: 'Collectives of farmers for improved access to investments, technology, inputs, and markets.',
      stateWiseContacts: {
        'All States': 'National Bank for Agriculture and Rural Development (NABARD), Tel: 022-2653-9895'
      }
    },
    {
      name: 'Krishi Vigyan Kendras (KVKs)',
      description: 'Agricultural extension centers to provide technical support to farmers.',
      stateWiseContacts: {
        'All States': 'Agricultural Technology Application Research Institute (ATARI) in your zone or visit https://kvk.icar.gov.in/'
      }
    }
  ];

  // Filter schemes based on search term, state, and category
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All States' || scheme.states === selectedState || scheme.states === 'All States';
    const matchesCategory = selectedCategory === 'All Categories' || scheme.category === selectedCategory;
    
    return matchesSearch && matchesState && matchesCategory;
  });

  // Handle support form submission
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the query to a backend service
    alert(`Support request for ${supportLocation} has been submitted. Our team will contact you soon.`);
    setShowSupportModal(false);
    setSupportLocation('');
    setSupportQuery('');
  };

  // Handle navigation
  const handleTabChange = (tabId) => {
    if (tabId.startsWith('/dashboard')) {
      router.push(tabId);
    } else {
      // Fallback for any legacy routes
      switch (tabId) {
        case 'home':
          router.push('/dashboard');
          break;
        case 'crops':
          router.push('/dashboard/mycrops');
          break;
        case 'scan':
          router.push('/dashboard/plantDisease');
          break;
        case 'market':
          router.push('/dashboard/market');
          break;
        case 'community':
          router.push('/dashboard/community');
          break;
        case 'profile':
          router.push('/dashboard/profile');
          break;
        default:
          router.push('/dashboard');
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar activeTab="/dashboard/schemes" onTabChange={handleTabChange} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Government Schemes for Farmers</h1>
          <p className="text-lg mb-6">Discover various government initiatives to support Indian farmers</p>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search schemes..."
                className="w-full p-2 border border-gray-300 rounded text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-1/4">
              <select 
                className="w-full p-2 border border-gray-300 rounded text-gray-800"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="md:w-1/4">
              <select 
                className="w-full p-2 border border-gray-300 rounded text-gray-800"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Support Assistant Button */}
        <div className="mb-8 text-center">
          <button 
            onClick={() => setShowSupportModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Connect with Agricultural Support Assistant
          </button>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map(scheme => (
              <div key={scheme.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
                <div className="h-48 bg-gray-200 relative">
                  {/* In a real application, replace with actual images */}
                  <div className="absolute inset-0 flex items-center justify-center bg-green-100">
                    <div className="text-4xl text-green-600">
                      {scheme.category === 'Financial Support' && '₹'}
                      {scheme.category === 'Crop Insurance' && '🛡️'}
                      {scheme.category === 'Irrigation' && '💧'}
                      {scheme.category === 'Marketing Support' && '🏪'}
                      {scheme.category === 'Pension' && '👴'}
                      {scheme.category === 'Credit & Loans' && '💳'}
                      {scheme.category === 'Infrastructure' && '🏗️'}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    {scheme.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{scheme.name}</h3>
                  <p className="text-gray-600 mb-4">{scheme.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800">Eligibility:</h4>
                    <p className="text-gray-600">{scheme.eligibility}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800">Benefits:</h4>
                    <p className="text-gray-600">{scheme.benefits}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800">How to Apply:</h4>
                    <p className="text-gray-600">{scheme.applicationProcess}</p>
                  </div>
                  
                  <a 
                    href={scheme.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-green-600 hover:text-green-800 font-medium"
                  >
                    Visit Official Website →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-xl text-gray-600">No schemes found matching your criteria. Please try a different search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Agricultural Committees Section */}
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Agricultural Committees & Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agriculturalCommittees.map((committee, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{committee.name}</h3>
                <p className="text-gray-600 mb-4">{committee.description}</p>
                
                <h4 className="font-semibold text-gray-800 mb-2">Contact Information:</h4>
                <ul className="text-gray-600">
                  {Object.entries(committee.stateWiseContacts).map(([state, contact], idx) => (
                    <li key={idx} className="mb-1">
                      <span className="font-medium">{state}:</span> {contact}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Agricultural Support Assistant</h2>
            <p className="mb-4 text-gray-600">Please provide your location and query to connect with the relevant agricultural committee in your area.</p>
            
            <form onSubmit={handleSupportSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="location">
                  Your Location (State/District)
                </label>
                <select
                  id="location"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={supportLocation}
                  onChange={(e) => setSupportLocation(e.target.value)}
                  required
                >
                  <option value="">Select your state</option>
                  {states.filter(state => state !== 'All States').map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="query">
                  Your Query
                </label>
                <textarea
                  id="query"
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="4"
                  value={supportQuery}
                  onChange={(e) => setSupportQuery(e.target.value)}
                  placeholder="Describe your farming issue or query..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}