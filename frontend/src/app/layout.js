// src/app/layout.js

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar' // Import Navbar
import Footer from '@/components/Footer' // Import Footer

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StegaCrypt - Secure Steganography',
  description: 'Hide your secret messages within images securely.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth"> {/* Smooth scroll for nav links */}
      <body className={`${inter.className} bg-gray-900 text-gray-200`}>
        <Navbar />
        <main>{children}</main> {/* Main content goes here */}
        <Footer />
      </body>
    </html>
  )
}