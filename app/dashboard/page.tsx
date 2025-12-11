import { createClient } from '@/lib/supabaseClient' // Client-side but used in server component? No, use createServerClient in lib or just ssr package here.
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Fetch KYC status
  const { data: kyc } = await supabase
    .from('kyc_verifications')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  const isSeller = user?.role === 'seller' || user?.role === 'both'
  const isBuyer = user?.role === 'buyer' || user?.role === 'both'

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Välkommen tillbaka, {user?.full_name || user?.email}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* KYC Status for Sellers */}
          {isSeller && (
            <Card>
              <CardHeader>
                <CardTitle>Verifiering</CardTitle>
                <CardDescription>Din status för BankID</CardDescription>
              </CardHeader>
              <CardContent>
                {kyc?.status === 'approved' ? (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <span>✅ Verifierad</span>
                  </div>
                ) : kyc?.status === 'pending' ? (
                  <div className="text-yellow-600 font-medium">
                    ⏳ Väntar på granskning
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Du måste verifiera dig med BankID för att kunna publicera gigs.
                    </p>
                    {/* Real implementation would call API */}
                    <Button variant="outline">Verifiera med BankID</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snabblänkar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {isSeller && (
                <Link href="/gigs/create">
                  <Button className="w-full" variant="secondary">Skapa nytt Gig</Button>
                </Link>
              )}
              {isBuyer && (
                <Link href="/projects/create">
                  <Button className="w-full" variant="secondary">Publicera Projekt</Button>
                </Link>
              )}
              <Link href="/messages">
                <Button className="w-full" variant="outline">Meddelanden</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 kr</div>
              <p className="text-xs text-muted-foreground">
                Intjänat denna månad
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mina Gigs</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">Inga gigs publicerade än.</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Mina Projekt</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">Inga projekt skapade än.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
