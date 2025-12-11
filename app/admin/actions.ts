'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function approveKyc(userId: string) {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value }
            }
        }
    )

    // Verify admin (skipped for MVP/Mock)

    await supabase.from('kyc_verifications')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('user_id', userId)

    revalidatePath('/admin')
}

export async function rejectKyc(userId: string) {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value }
            }
        }
    )

    await supabase.from('kyc_verifications')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('user_id', userId)

    revalidatePath('/admin')
}
