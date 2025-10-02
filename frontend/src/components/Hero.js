'use client';
// src/components/Hero.js
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden px-4 py-12 sm:py-16 md:py-20">
      {/* Dynamic Background - Optimized for mobile */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0f172a_0%,_#020617_100%)]" />
        
        {/* Responsive Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: 'clamp(2rem, 4vw, 4rem) clamp(2rem, 4vw, 4rem)',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 70%)',
          }}
        />

        {/* Responsive Gradient Orbs */}
        <motion.div 
          className="absolute top-1/4 -left-1/4 w-48 md:w-96 h-48 md:h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * (isMobile ? 5 : 20),
            y: mousePosition.y * (isMobile ? 5 : 20),
          }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>

      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Responsive Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 md:mb-8 relative">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-teal-500 to-purple-500">
              StegaCrypt
            </span>
            <div className="absolute -inset-2 bg-violet-500/20 blur-xl opacity-50 rounded-full" />
          </h1>
          
          {/* Responsive Description */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4">
            Transform your messages into invisible secrets within images, 
            powered by advanced steganography.
          </p>

          {/* Responsive CTA Button */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link 
              href="/app" 
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-violet-600 to-teal-600 text-white font-medium text-base sm:text-lg hover:shadow-lg hover:shadow-violet-500/20 transition-all"
            >
              Start Encrypting
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Feature Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-20">
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
                className="p-4 sm:p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}