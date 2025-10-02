// src/components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
              StegaCrypt
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-300">
            <Link href="/#how-it-works" className="hover:text-purple-400 transition">How It Works</Link>
            <Link href="/#features" className="hover:text-purple-400 transition">Features</Link>
            <Link href="/#reviews" className="hover:text-purple-400 transition">Reviews</Link>
          </div>
          <div>
            <Link href="/app" className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}