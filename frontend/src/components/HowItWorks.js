import React from 'react';
import { FiType, FiUploadCloud, FiLock, FiDownload } from 'react-icons/fi';

const Step = ({ icon, title, description }) => (
  <div className="bg-gray-800/50 p-6 rounded-lg text-center">
    <div className="flex justify-center mb-4">
      <div className="bg-purple-500/10 p-4 rounded-full text-purple-400">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <Step 
          icon={<FiType size={28} />}
          title="1. Write & Secure"
          description="Type your secret message and set a strong password for military-grade encryption."
        />
        <Step 
          icon={<FiUploadCloud size={28} />}
          title="2. Choose an Image"
          description="Upload any cover image (PNG, JPG). Your message will be invisibly hidden within its pixels."
        />
        <Step 
          icon={<FiLock size={28} />}
          title="3. Encrypt & Share"
          description="Download the new image with the hidden message and share it with the recipient securely."
        />
      </div>
    </section>
  );
}