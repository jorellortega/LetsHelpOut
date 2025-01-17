"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getDb, eq } from '@/utils/db';
import { users } from '@/db/schema.js';
import bcrypt from 'bcryptjs';

type User = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting to log in user:', email);
      const db = getDb();
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      console.log('Login query result:', result);
      if (result.length > 0) {
        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          const { password: _, ...userWithoutPassword } = user;
          setUser({
            ...userWithoutPassword,
            created_at: new Date(user.created_at),
          });
          localStorage.setItem('user', JSON.stringify({...userWithoutPassword, created_at: user.created_at.toISOString()}));
          console.log('User logged in successfully:', userWithoutPassword);
          return true;
        }
      }
      console.error('Login failed: Invalid email or password');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      }
      return false;
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log('Attempting to sign up user:', email);
      const db = getDb();
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.insert(users).values({ name, email, password: hashedPassword }).returning();
      console.log('Signup result:', result);
      if (result.length > 0) {
        const { password: _, ...newUser } = result[0];
        setUser({
          ...newUser,
          created_at: new Date(newUser.created_at),
        });
        localStorage.setItem('user', JSON.stringify({...newUser, created_at: newUser.created_at.toISOString()}));
        console.log('User signed up successfully:', newUser);
        return true;
      }
      console.error('Signup failed: Unable to insert new user');
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return false;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

