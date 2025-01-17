'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch('/api/test-db-connection');
        const data = await response.json();
        if (data.success) {
          setDbStatus('connected');
        } else {
          setDbStatus('error');
          setErrorMessage(data.error || 'Unknown database error');
        }
      } catch (error) {
        console.error('Error checking database connection:', error);
        setDbStatus('error');
        setErrorMessage('Failed to check database connection');
      }
    }
    checkConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 bg-[#000000] min-h-screen">
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 text-[#00ffbf]">Let's Help Out</h1>
        <p className="text-xl mb-4 text-gray-300">Join our community and make a difference today.</p>
        {dbStatus === 'checking' && (
          <p className="text-yellow-500 mb-4">Checking database connection...</p>
        )}
        {dbStatus === 'connected' && (
          <p className="text-green-500 mb-4">Database connected successfully!</p>
        )}
        {dbStatus === 'error' && (
          <div className="text-red-500 mb-4">
            <p>Error: Unable to connect to the database.</p>
            <p>{errorMessage}</p>
            <p>Please check the server logs for more details.</p>
          </div>
        )}
      </section>

      <section className="py-8">
        <div className="max-w-md mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4 text-[#facc15]">Support Our Platform</h2>
          <p className="text-gray-300 mb-6">Your donation helps us maintain and improve our services for all users.</p>
          <Link href="https://donate.stripe.com/aEU5kS0RT0ESbL2cMM" passHref target="_blank" rel="noopener noreferrer">
            <Button className="btn-primary flex items-center justify-center" style={{background: 'linear-gradient(to right, #facc15, #86efac)'}}>
              Donate Now
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="py-16">
        <div className="max-w-4xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#00ffbf]">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-white">1. Create</h3>
              <p className="text-gray-300">Start your campaign and share your story with the world. Easy setup, no technical skills needed.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-white">2. Fund</h3>
              <p className="text-gray-300">Reach out to your network and beyond to raise funds. Lower fees mean more money for your cause.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-white">3. Achieve</h3>
              <p className="text-gray-300">Bring your project to life and make a difference. Fast payouts and dedicated support.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

