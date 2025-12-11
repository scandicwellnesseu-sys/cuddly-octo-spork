import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripeClient'
import { createClient } from '@/lib/supabaseClient' // This is client side, we need server side client for route handlers if we want to verify user from session.
// Actually, we can use createServerClient from @supabase/ssr in route handlers too.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { amount, currency = 'sek', gigId, projectId } = await req.json()

    // 1. Verify Auth
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
    )
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Create Payment Intent
    // For Connect: we should also know the connected account ID of the seller (destination).
    // For MVP: We act as the platform collecting money first (Standard/Express later).
    // We will just create a PI for the platform.

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects lowest currency unit
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: session.user.id,
        gigId: gigId || '',
        projectId: projectId || ''
      }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
