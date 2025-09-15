"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../../components/NavBar';

export default function GovernmentSchemes() {
  const router = useRouter();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportLocation, setSupportLocation] = useState('');
  const [supportQuery, setSupportQuery] = useState('');
  const [schemesData, setSchemesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailData, setDetailData] = useState(null);

  // List of Indian states for the dropdown
  const states = [
    'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Categories removed from UI

  // Fetch scraped schemes list
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const resp = await fetch('/api/schemes', { cache: 'no-store' });
        
        if (!resp.ok) throw new Error('Failed to load schemes');
        const data = await resp.json();
        console.log(data)
        if (isMounted) setSchemesData(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        if (isMounted) setError('Could not load schemes. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Scheme modal handlers
  const openScheme = async (item) => {
    setSelectedScheme(item);
    setDetailLoading(true);
    setDetailError('');
    setDetailData(null);
    try {
      const url=`https://schemes.vikaspedia.in/viewcontent/schemesall/schemes-for-farmers/`+item.title.toLowerCase().split(' ').join('-');

      const resp = await fetch(`/api/schemes/detail?url=${url}`, { cache: 'no-store' });
      if (!resp.ok) throw new Error('Failed to load details');
      const data = await resp.json();
      // console.log(data)
      setDetailData(data);
    } catch (e) {
      setDetailError('Could not load details. Please open the official page.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeScheme = () => {
    setSelectedScheme(null);
    setDetailData(null);
    setDetailError('');
  };

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

  // Search removed; show all scraped items

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
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 md:ml-80 mt-16 md:mt-0">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Government Schemes for Farmers</h1>
          <p className="text-lg mb-2">Discover official schemes and details in one place.</p>
          <p className="opacity-90">Click any card to view a quick summary and open the official page.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:ml-80">
        {/* Support Assistant Button */}
        <div className="mb-8 text-center">
          <button 
            onClick={() => setShowSupportModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Connect with Agricultural Support Assistant
          </button>
        </div>

        {/* Schemes Grid (scraped) */}
        {error && (
          <div className="text-center text-red-600 mb-6">{error}</div>
        )}
        {loading ? (
          <div className="text-center text-gray-600">Loading schemes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemesData.length > 0 ? (
              schemesData.map((item, idx) => (
                <div
                  key={item.url + idx}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300 cursor-pointer group"
                  onClick={() => openScheme(item)}
                >
                  <div className="p-5">
                    <div className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Scheme
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-green-700">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Tap to view details and open the official page.</p>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-sm">View summary</span>
                      <span className="text-gray-300">|</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open official page →
                      </a>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-600">No schemes found. Try a different search.</p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Agricultural Committees Section */}
      <div className="bg-gray-50 py-10 md:ml-80">
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

      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-xl font-bold text-gray-800">{selectedScheme.title}</h3>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {detailLoading && (
                <p className="text-gray-600">Fetching details...</p>
              )}
              {detailError && (
                <p className="text-red-600 mb-3">{detailError}</p>
              )}
              {detailData && (
                <div>
                  {detailData.sections?.eligibility && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-1">Eligibility</h4>
                      <p className="text-gray-700 whitespace-pre-line">{detailData.sections.eligibility}</p>
                    </div>
                  )}
                  {detailData.sections?.benefits && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-1">Benefits</h4>
                      <p className="text-gray-700 whitespace-pre-line">{detailData.sections.benefits}</p>
                    </div>
                  )}
                  {detailData.sections?.how_to_apply && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-1">How to apply</h4>
                      <p className="text-gray-700 whitespace-pre-line">{detailData.sections.how_to_apply}</p>
                    </div>
                  )}
                  {!detailData.sections || Object.keys(detailData.sections).length === 0 ? (
                    <p className="text-gray-700 whitespace-pre-line">{detailData.content || 'Details not available.'}</p>
                  ) : null}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <a
                href={selectedScheme.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Open official page
              </a>
              <button
                onClick={closeScheme}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}