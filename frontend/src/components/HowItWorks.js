'use client';
import { motion } from 'framer-motion';
import { FiShield, FiImage, FiShare2 } from 'react-icons/fi';

const Step = ({ icon, title, description, index, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-teal-600/10 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
    
    <div className="relative p-8 rounded-2xl bg-gray-800/40 backdrop-blur border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-teal-500/20 text-white">
          {icon}
        </div>
        <span className="ml-4 text-sm font-medium text-gray-400">Step {index}</span>
      </div>

      <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-teal-400">
        {title}
      </h3>

      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

export default function HowItWorks() {
  const steps = [
    {
      icon: <FiShield size={24} />,
      title: "Encrypt Your Message",
      description: "Enter your secret message and secure it with a strong password of your choice."
    },
    {
      icon: <FiImage size={24} />,
      title: "Choose Cover Image",
      description: "Select any image that will carry your hidden message without visible changes."
    },
    {
      icon: <FiShare2 size={24} />,
      title: "Share Securely",
      description: "Download the encoded image and share it through any platform with confidence."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-teal-400 to-purple-400">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Three simple steps to secure your messages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Step
              key={index}
              {...step}
              index={index + 1}
              delay={index * 0.2}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}