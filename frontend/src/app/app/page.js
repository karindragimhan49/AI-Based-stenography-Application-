// src/app/app/page.js
'use client';
import { useState } from 'react';
import EncryptForm from "@/components/EncryptForm";
import DecryptForm from "@/components/DecryptForm";
import { FiImage, FiMusic } from 'react-icons/fi';

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <main className="min-h-screen bg-gray-900 pt-24">
      {/* Added pt-24 above to prevent navbar overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Method Selection Section */}
        <div className="relative z-10 flex flex-col items-center mb-12">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 mb-8">
            Choose Steganography Method
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 p-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'image'
                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FiImage className={`w-5 h-5 ${activeTab === 'image' ? 'animate-pulse' : ''}`} />
              <span>Image Steganography</span>
            </button>
            
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'audio'
                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FiMusic className={`w-5 h-5 ${activeTab === 'audio' ? 'animate-pulse' : ''}`} />
              <span>Audio Steganography</span>
            </button>
          </div>
        </div>

        {/* Forms Container */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-1/2">
            <EncryptForm activeTab={activeTab} />
          </div>
          
          <div className="hidden lg:flex items-center justify-center">
            <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-50"></div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <DecryptForm activeTab={activeTab} />
          </div>
        </div>
      </div>
    </main>
  );
}