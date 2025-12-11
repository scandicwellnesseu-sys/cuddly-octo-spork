'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabaseClient'

// Make sure to replace with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy')

function CheckoutForm({ clientSecret, orderId }: { clientSecret: string, orderId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!stripe) return

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Betalningen lyckades!")
          break
        case "processing":
          setMessage("Din betalning behandlas.")
          break
        case "requires_payment_method":
          setMessage("Din betalning lyckades inte, försök igen.")
          break
        default:
          setMessage("Något gick fel.")
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}`,
      },
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.")
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full">
        {isLoading ? <div className="spinner" /> : "Betala nu"}
      </Button>
      {message && <div id="payment-message" className="text-sm text-red-500">{message}</div>}
    </form>
  )
}

export default function CreateOrderPage() {
  const searchParams = useSearchParams()
  const gigId = searchParams.get('gig_id')
  const [clientSecret, setClientSecret] = useState("")
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function initOrder() {
        if (!gigId) return

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            // Store redirect URL?
            router.push('/auth/login')
            return
        }

        // 1. Fetch Gig details
        const { data: gig } = await supabase.from('gigs').select('*').eq('id', gigId).single()
        if (!gig) {
            alert("Gig hittades inte")
            return
        }

        // 2. Create Pending Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                buyer_id: session.user.id,
                seller_id: gig.seller_id,
                gig_id: gig.id,
                amount: gig.base_price,
                status: 'pending_payment'
            })
            .select()
            .single()

        if (orderError) {
            console.error(orderError)
            return
        }

        setOrderId(order.id)

        // 3. Create Payment Intent
        const res = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: gig.base_price,
                gigId: gig.id,
                orderId: order.id
            }),
        })
        const data = await res.json()
        setClientSecret(data.clientSecret)
        setLoading(false)
    }

    initOrder()
  }, [gigId, supabase, router])

  if (!gigId) return <div className="p-10">Ingen gig vald.</div>
  if (loading) return <div className="p-10">Förbereder order...</div>

  return (
    <div className="container py-10 max-w-md">
       <Card>
          <CardHeader>
             <CardTitle>Betala Order</CardTitle>
          </CardHeader>
          <CardContent>
            {clientSecret && (
                <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
                </Elements>
            )}
          </CardContent>
       </Card>
    </div>
  )
}
