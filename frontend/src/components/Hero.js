'use client';
// src/components/Hero.js
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 opacity-20">
          <svg className="blur-3xl filter" width="100%" height="100%">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#7c3aed', stopOpacity: 0.2 }} />
                <stop offset="50%" style={{ stopColor: '#2dd4bf', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>
            <circle cx="60%" cy="40%" r="50%" fill="url(#grad)" />
            <circle cx="40%" cy="60%" r="40%" fill="url(#grad)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-teal-500 to-purple-500">
              StegaCrypt
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform your messages into invisible secrets within images, 
            powered by advanced steganography.
          </p>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/app" 
              className="relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-teal-600 text-white font-medium group"
            >
              <span className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="relative">
                Start Encrypting
                <span className="ml-2 opacity-60">→</span>
              </span>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              { title: 'Secure', desc: 'Military-grade encryption' },
              { title: 'Fast', desc: 'Instant processing' },
              { title: 'Private', desc: 'End-to-end privacy' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (i + 1) }}
                className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-lg border border-gray-700/50"
              >
                <h3 className="text-xl font-bold text-gray-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}