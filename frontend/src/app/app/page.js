// src/app/page.js

import EncryptForm from "@/components/EncryptForm";
import DecryptForm from "@/components/DecryptForm";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            StegaCrypt
          </span>
        </h1>
        <p className="text-lg text-gray-400">Secure Message Hiding in Images</p>
      </div>

      {/* Main container for the two forms */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Encrypt Section */}
        <div className="w-full lg:w-1/2">
          <EncryptForm />
        </div>

        {/* Divider */}
        <div className="hidden lg:flex items-center">
            <div className="h-full w-px bg-gray-700"></div>
        </div>

        {/* Decrypt Section */}
        <div className="w-full lg:w-1/2">
          <DecryptForm />
        </div>
      </div>
    </main>
  );
}