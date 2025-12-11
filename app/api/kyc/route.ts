import { NextResponse } from 'next/server'
import { bankidClient } from '@/lib/bankidClient'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
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

    const { action } = await req.json()

    if (action === 'start') {
        const result = await bankidClient.startVerification(session.user.id)

        // Save pending status to DB
        await supabase.from('kyc_verifications').upsert({
            user_id: session.user.id,
            status: 'pending',
            provider: 'bankid',
            session_id: result.sessionId
        })

        return NextResponse.json(result)
    } else if (action === 'poll') {
        // In real BankID, we poll the RP API. Here we simulate.
        // We'd fetch the session_id from DB for this user.
        const { data: kyc } = await supabase
            .from('kyc_verifications')
            .select('session_id')
            .eq('user_id', session.user.id)
            .single()

        if (!kyc?.session_id) {
            return NextResponse.json({ error: 'No active verification' }, { status: 400 })
        }

        const result = await bankidClient.pollVerification(kyc.session_id)

        if (result.status !== 'pending') {
            await supabase.from('kyc_verifications').update({
                status: result.status,
                updated_at: new Date().toISOString()
            }).eq('user_id', session.user.id)
        }

        return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
