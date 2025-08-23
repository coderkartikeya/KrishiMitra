"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function PlantDiseasePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('detection');

  // Common plant diseases with information and prevention methods
  const diseaseLibrary = [
    {
      id: 1,
      name: "Late Blight",
      crops: ["Potato", "Tomato"],
      symptoms: "Dark, water-soaked spots on leaves that quickly enlarge and turn brown with a slight yellow border. White fungal growth may appear on the undersides of leaves in humid conditions.",
      causes: "Caused by the fungus-like oomycete pathogen Phytophthora infestans, favored by cool, wet weather.",
      prevention: [
        "Use resistant varieties when available",
        "Ensure good air circulation by proper plant spacing",
        "Avoid overhead irrigation and water early in the day",
        "Apply copper-based fungicides preventatively",
        "Practice crop rotation (3-4 years)"
      ],
      safeInsecticides: [
        "Copper-based fungicides (Bordeaux mixture)",
        "Chlorothalonil",
        "Mancozeb (when used according to label instructions)"
      ],
      image: "/diseases/late-blight.jpg"
    },
    {
      id: 2,
      name: "Powdery Mildew",
      crops: ["Cucumber", "Squash", "Pumpkin", "Zucchini", "Melon"],
      symptoms: "White powdery spots on leaves and stems that eventually cover the entire surface. Leaves may yellow, curl, and die prematurely.",
      causes: "Caused by several species of fungi, favored by warm, dry conditions with high humidity.",
      prevention: [
        "Plant resistant varieties",
        "Ensure adequate spacing for air circulation",
        "Avoid excessive nitrogen fertilization",
        "Remove and destroy infected plant parts",
        "Apply preventative fungicides at first sign of disease"
      ],
      safeInsecticides: [
        "Sulfur-based fungicides",
        "Neem oil",
        "Potassium bicarbonate",
        "Bacillus subtilis (biological control)"
      ],
      image: "/diseases/powdery-mildew.jpg"
    },
    {
      id: 3,
      name: "Bacterial Leaf Spot",
      crops: ["Pepper", "Tomato", "Lettuce"],
      symptoms: "Small, dark, water-soaked spots on leaves that enlarge and turn brown with yellow halos. Spots may merge, causing leaves to yellow and drop.",
      causes: "Caused by various species of bacteria, spread by water splash and favored by warm, wet conditions.",
      prevention: [
        "Use disease-free seeds and transplants",
        "Practice crop rotation (2-3 years)",
        "Avoid overhead irrigation",
        "Remove and destroy infected plant debris",
        "Apply copper-based bactericides preventatively"
      ],
      safeInsecticides: [
        "Copper-based bactericides",
        "Streptomycin (in some regions, for certain crops)",
        "Bacillus subtilis (biological control)"
      ],
      image: "/diseases/bacterial-leaf-spot.jpg"
    }
  ];

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectionResult(null); // Reset previous results
    }
  };

  // Handle disease detection (simulated)
  const detectDisease = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, randomly select a disease from the library
      const randomIndex = Math.floor(Math.random() * diseaseLibrary.length);
      setDetectionResult(diseaseLibrary[randomIndex]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header section */}
      <div className="relative h-40 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/farm-pattern.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white z-10">
            <h1 className="text-3xl font-bold mb-1">Plant Disease Detection</h1>
            <p className="text-lg">Identify diseases and get prevention recommendations</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'detection' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('detection')}
          >
            Disease Detection
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'library' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('library')}
          >
            Disease Library
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'prevention' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('prevention')}
          >
            Safe Practices
          </button>
        </div>

        {/* Disease Detection Tab */}
        {activeTab === 'detection' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column - Upload and preview */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Upload Plant Image</h2>
              <p className="text-gray-600 mb-4">
                Take a clear photo of the affected plant part (leaf, stem, fruit) and upload it for analysis.
              </p>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
              </div>
              
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview</p>
                  <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={previewUrl}
                      alt="Plant preview"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  
                  <button
                    onClick={detectDisease}
                    disabled={isAnalyzing}
                    className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm disabled:bg-gray-400"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Detect Disease'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Right column - Results */}
            <div>
              {detectionResult ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-red-600">{detectionResult.name}</h2>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Detected
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    Commonly affects: {detectionResult.crops.join(", ")}
                  </p>
                  
                  <h3 className="font-medium text-gray-900 mt-4 mb-2">Symptoms</h3>
                  <p className="text-gray-700 mb-4">{detectionResult.symptoms}</p>
                  
                  <h3 className="font-medium text-gray-900 mb-2">Causes</h3>
                  <p className="text-gray-700 mb-4">{detectionResult.causes}</p>
                  
                  <h3 className="font-medium text-gray-900 mb-2">Prevention Methods</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {detectionResult.prevention.map((method, index) => (
                      <li key={index} className="text-gray-700 mb-1">{method}</li>
                    ))}
                  </ul>
                  
                  <h3 className="font-medium text-gray-900 mb-2">Safe Treatment Options</h3>
                  <ul className="list-disc pl-5">
                    {detectionResult.safeInsecticides.map((option, index) => (
                      <li key={index} className="text-gray-700 mb-1">{option}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Disease Detected Yet</h3>
                  <p className="text-gray-600">
                    Upload a clear image of the affected plant part to get an analysis and treatment recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disease Library Tab */}
        {activeTab === 'library' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Common Plant Diseases</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diseaseLibrary.map((disease) => (
                <div key={disease.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 relative">
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Image placeholder</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{disease.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Affects: {disease.crops.join(", ")}
                    </p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {disease.symptoms}
                    </p>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prevention Tab */}
        {activeTab === 'prevention' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Safe Farming Practices</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrated Pest Management (IPM)</h3>
              <p className="text-gray-700 mb-4">
                IPM is an ecosystem-based strategy that focuses on long-term prevention of pests or their damage through a combination of techniques such as biological control, habitat manipulation, modification of cultural practices, and use of resistant varieties.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Benefits of IPM</h4>
                  <ul className="list-disc pl-5">
                    <li className="text-gray-700 mb-1">Reduces environmental impact</li>
                    <li className="text-gray-700 mb-1">Minimizes risks to human health</li>
                    <li className="text-gray-700 mb-1">Promotes sustainable agriculture</li>
                    <li className="text-gray-700 mb-1">Reduces the likelihood of pesticide resistance</li>
                    <li className="text-gray-700 mb-1">Cost-effective in the long term</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Key IPM Strategies</h4>
                  <ul className="list-disc pl-5">
                    <li className="text-gray-700 mb-1">Regular monitoring of crops</li>
                    <li className="text-gray-700 mb-1">Identifying pests accurately</li>
                    <li className="text-gray-700 mb-1">Setting action thresholds</li>
                    <li className="text-gray-700 mb-1">Using multiple control methods</li>
                    <li className="text-gray-700 mb-1">Evaluating results</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cultural Practices</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Crop rotation:</strong> Avoid planting the same crop in the same location for consecutive seasons to break disease cycles.</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Proper spacing:</strong> Ensure adequate spacing between plants to promote air circulation and reduce humidity.</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Sanitation:</strong> Remove and destroy infected plant debris to prevent disease spread.</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Timing:</strong> Plant at optimal times to avoid peak pest pressure periods.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Biological Controls</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Beneficial insects:</strong> Encourage ladybugs, lacewings, and predatory mites that feed on pest insects.</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Microbial products:</strong> Use Bacillus thuringiensis (Bt), Bacillus subtilis, and other beneficial microbes.</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Companion planting:</strong> Plant species that repel pests or attract beneficial insects.</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Trap crops:</strong> Plant species that attract pests away from main crops.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}