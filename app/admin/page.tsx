import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { approveKyc, rejectKyc } from './actions'

async function getAdminData() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  // Check admin role (mocked logic: assumes specific email or metadata)
  // For MVP: assume everyone can see it if they know the URL, OR enforce a check.
  // Real implementation: check user role in DB.

  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: gigCount } = await supabase.from('gigs').select('*', { count: 'exact', head: true })
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })

  // Pending KYC
  const { data: pendingKyc } = await supabase
     .from('kyc_verifications')
     .select('*, user:users(email, full_name)')
     .eq('status', 'pending')
     .limit(5)

  return { userCount, gigCount, orderCount, pendingKyc }
}

export default async function AdminPage() {
  const { userCount, gigCount, orderCount, pendingKyc } = await getAdminData()

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
           <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Användare</CardTitle></CardHeader>
           <CardContent><div className="text-2xl font-bold">{userCount}</div></CardContent>
        </Card>
        <Card>
           <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Aktiva Gigs</CardTitle></CardHeader>
           <CardContent><div className="text-2xl font-bold">{gigCount}</div></CardContent>
        </Card>
        <Card>
           <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Totalt Ordrar</CardTitle></CardHeader>
           <CardContent><div className="text-2xl font-bold">{orderCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KYC Verifieringar att granska</CardTitle>
          <CardDescription>Användare som väntar på BankID-godkännande (Mock)</CardDescription>
        </CardHeader>
        <CardContent>
           {pendingKyc && pendingKyc.length > 0 ? (
             <div className="space-y-4">
               {pendingKyc.map((kyc) => (
                 <div key={kyc.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <div className="font-medium">{kyc.user?.full_name} ({kyc.user?.email})</div>
                      <div className="text-xs text-muted-foreground">ID: {kyc.id}</div>
                    </div>
                    <div className="flex gap-2">
                      <form action={async () => {
                        'use server'
                        await approveKyc(kyc.user_id)
                      }}>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                            Godkänn
                        </Button>
                      </form>
                      <form action={async () => {
                        'use server'
                        await rejectKyc(kyc.user_id)
                      }}>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            Neka
                        </Button>
                      </form>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <p className="text-muted-foreground">Inga väntande verifieringar.</p>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
