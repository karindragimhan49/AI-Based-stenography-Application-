// src/components/Hero.js
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="text-center py-20 sm:py-32">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
          Hide Your Secrets in Plain Sight
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400">
          StegaCrypt uses advanced steganography and cryptography to embed your private messages within images, making them visually undetectable.
        </p>
        <Link href="/app" className="mt-10 inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-transform transform hover:scale-105">
          Get Started Now
        </Link>
      </div>
    </section>
  );
}