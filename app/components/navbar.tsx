"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const { isLoggedIn, logout } = useAuth()
  const pathname = usePathname()

  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-sky-300 to-green-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Let's Help Out
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="text-white hover:text-white hover:shadow-glow">
            Home
          </Link>
          <Link href="/create-campaign">
            <Button variant="default" className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold">
              Create Campaign
            </Button>
          </Link>
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard" 
                className={`text-white hover:text-white hover:shadow-glow ${
                  pathname === '/dashboard' ? 'active-nav-link' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/settings" 
                className={`text-white hover:text-white hover:shadow-glow ${
                  pathname === '/settings' ? 'active-nav-link' : ''
                }`}
              >
                Settings
              </Link>
              <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-transparent text-white border border-white rounded px-2 py-1"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

