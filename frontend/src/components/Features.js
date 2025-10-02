'use client';
import { motion } from 'framer-motion';
import { FiLock, FiImage, FiShield, FiZap, FiEye, FiCheck } from 'react-icons/fi';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="relative group p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-100">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

export default function Features() {
  const features = [
    {
      icon: FiLock,
      title: "Military-Grade Encryption",
      description: "Secure your messages with advanced encryption algorithms that ensure complete privacy.",
    },
    {
      icon: FiImage,
      title: "Image Steganography",
      description: "Hide your encrypted messages within images without any visible changes to the original file.",
    },
    {
      icon: FiShield,
      title: "End-to-End Security",
      description: "Your data remains encrypted throughout the entire process, visible only to intended recipients.",
    },
    {
      icon: FiZap,
      title: "Real-Time Processing",
      description: "Fast and efficient encoding and decoding of messages with instant results.",
    },
    {
      icon: FiEye,
      title: "Zero Trace",
      description: "Leave no visible evidence of hidden messages in your carrier files.",
    },
    {
      icon: FiCheck,
      title: "Format Preservation",
      description: "Maintain the original quality and format of your carrier images.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
            Powerful Features
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Advanced tools for secure message hiding and sharing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}