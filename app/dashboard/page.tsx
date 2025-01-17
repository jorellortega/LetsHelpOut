"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { campaigns } from '@/db/schema.js';
import { getDb, eq } from '/utils/db';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const PaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!stripe || !elements) {
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      console.log('PaymentMethod:', paymentMethod)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#ffffff',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <Button type="submit" disabled={!stripe} className="mt-4">
        Save Payment Method
      </Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">Payment method saved successfully!</div>}
    </form>
  )
}

export default function Dashboard() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      const fetchCampaigns = async () => {
        try {
          const db = getDb();
          const userCampaigns = await db.select().from(campaigns).where(eq(campaigns.user_id, user?.id));
          setCampaigns(userCampaigns);
        } catch (error) {
          console.error('Failed to fetch campaigns:', error);
        }
      };
      fetchCampaigns();
    }
  }, [isLoggedIn, router, user])

  if (!isLoggedIn) {
    return null
  }

  const totalDonations = campaigns.reduce((sum, campaign) => sum + Number(campaign.current_amount), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#00ffbf]">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>My Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <p>You have no active campaigns</p>
              ) : (
                <ul>
                  {campaigns.map(campaign => (
                    <li key={campaign.id} className="mb-4 p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-semibold text-xl">{campaign.title}</h3>
                      <p className="text-gray-400">{campaign.description.substring(0, 100)}...</p>
                      <p>Goal: ${campaign.goal_amount.toFixed(2)}</p>
                      <p>Current: ${campaign.current_amount.toFixed(2)}</p>
                      <p>Category: {campaign.category}</p>
                      <p>Created: {new Date(campaign.created_at).toLocaleDateString()}</p>
                      <p>Deadline: {new Date(campaign.campaign_deadline).toLocaleDateString()}</p>
                      <img src={campaign.image_url || "/placeholder.svg"} alt={campaign.title} className="mt-2 w-full h-32 object-cover rounded" />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p>${totalDonations.toFixed(2)} raised so far</p>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No recent activity</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage your payment methods for receiving funds from your campaigns.</p>
              <h3 className="text-lg font-semibold mb-2">Payment Distribution</h3>
              <p className="mb-4">For each donation your campaign receives:</p>
              <ul className="list-disc list-inside mb-4">
                <li>95% is automatically transferred to your linked payment method</li>
                <li>5% goes to platform fees</li>
              </ul>
              <p className="mb-4">This distribution happens immediately for each donation, ensuring you receive funds as they come in.</p>
              <Elements stripe={stripePromise}>
                <PaymentForm />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

