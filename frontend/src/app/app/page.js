// src/app/app/page.js
'use client';
import { useState } from 'react';
import EncryptForm from "@/components/EncryptForm";
import DecryptForm from "@/components/DecryptForm";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'audio'

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8">
      {/* Tab Buttons */}
      <div className="mb-8 flex space-x-2 md:space-x-4 p-2 bg-gray-800 rounded-lg">
        <button
          onClick={() => setActiveTab('image')}
          className={`px-4 md:px-6 py-2 rounded-md font-semibold text-sm md:text-base transition ${activeTab === 'image' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          Image Stego
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 md:px-6 py-2 rounded-md font-semibold text-sm md:text-base transition ${activeTab === 'audio' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          Audio Stego
        </button>
      </div>

      {/* Main container for the two forms */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="w-full lg:w-1/2">
          <EncryptForm activeTab={activeTab} />
        </div>
        <div className="hidden lg:flex items-center">
          <div className="h-full w-px bg-gray-700"></div>
        </div>
        <div className="w-full lg:w-1/2">
          <DecryptForm activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}