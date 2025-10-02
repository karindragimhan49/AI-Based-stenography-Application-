'use client';
import { useEffect } from 'react';
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Hero />
      <HowItWorks />
      <Features />
      <Reviews />
    </main>
  );
}