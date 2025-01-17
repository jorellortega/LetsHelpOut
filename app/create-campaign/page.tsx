"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from '../contexts/AuthContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DatePicker } from "@/components/DatePicker"
import { getDb } from '/utils/db'
import { campaigns } from '@/db/schema.js'

const categories = [
  "Cultural Preservation", "Research & Innovation", "Social Justice", "Family Support",
  "Disaster Relief", "Celebrations & Events", "Creative Projects", "Entrepreneurship",
  "Medical Support", "Travel & Experiences", "Scholarships & Tributes", "Youth Programs",
  "Infrastructure & Housing", "Other", "Arts", "Community", "Education", "Environment",
  "Health", "Technology", "Humanitarian", "Animals", "Sports", "Memorial & Funerals"
]

export default function CreateCampaign() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [deadline, setDeadline] = useState('')
  const { user, isLoggedIn, login, signup } = useAuth()
  const router = useRouter()

  const uploadImageToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!isLoggedIn || !user) {
      setIsLoginModalOpen(true)
      return
    }

    if (!title || !description || !goal || !category || !image || !deadline) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const imageUrl = await uploadImageToS3(image);
      const db = getDb();
      const result = await db.insert(campaigns).values({
        user_id: user.id,
        title,
        description,
        goal_amount: parseFloat(goal),
        current_amount: 0,
        category,
        image_url: imageUrl,
        campaign_deadline: new Date(deadline),
      });

      if (result.rowsAffected > 0) {
        setSuccess(true)
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        throw new Error('Failed to create campaign')
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
      setError('Failed to create campaign. Please try again.')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(loginEmail, loginPassword)
    if (success) {
      setAuthSuccess('Logged in successfully!')
      setIsLoginModalOpen(false)
    } else {
      setError('Invalid email or password.')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await signup(signupName, signupEmail, signupPassword)
    if (success) {
      setAuthSuccess('Account created successfully!')
      setIsLoginModalOpen(false)
    } else {
      setError('Failed to create account. Please try again.')
    }
  }

  useEffect(() => {
    if (authSuccess) {
      const timer = setTimeout(() => setAuthSuccess(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [authSuccess])

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#00ffbf]">Create a Campaign</h1>
      {authSuccess && (
        <Alert className="mb-4">
          <AlertDescription>{authSuccess}</AlertDescription>
        </Alert>
      )}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-[#00d4ff] focus:ring focus:ring-[#00d4ff] focus:ring-opacity-50"
                required
              ></textarea>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Funding Goal</Label>
              <Input
                id="goal"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-[#00d4ff] focus:ring focus:ring-[#00d4ff] focus:ring-opacity-50"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <DatePicker
              label="Campaign Deadline"
              selected={deadline}
              onChange={setDeadline}
              minDate={formatDate(new Date())}
            />
            <div className="space-y-2">
              <Label htmlFor="image">Campaign Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Campaign created successfully! Redirecting to dashboard...</p>}
            <Button type="submit" className="w-full">
              Create Campaign
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login or Sign Up</DialogTitle>
            <DialogDescription>
              Please log in or create an account to create a campaign.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

