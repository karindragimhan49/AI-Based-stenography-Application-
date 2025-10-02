// src/app/page.js (New Home Page)
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
// You can add more sections like Features, Pricing etc.

export default function HomePage() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Reviews />
      {/* Add other sections here */}
    </div>
  );
}