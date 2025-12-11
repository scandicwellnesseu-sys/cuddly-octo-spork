import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

async function getGig(slug: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data, error } = await supabase
    .from('gigs')
    .select('*, seller:users(*)')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

export default async function GigDetailPage({ params }: { params: { slug: string } }) {
  const gig = await getGig(params.slug)

  if (!gig) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>Kategori: {gig.category}</span>
                <span>•</span>
                <span>Leveranstid: {gig.delivery_days} dagar</span>
            </div>

            <div className="aspect-video bg-slate-100 rounded-lg mb-8 flex items-center justify-center text-slate-400">
               Omslagsbild
            </div>

            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-2">Om tjänsten</h3>
              <p className="whitespace-pre-wrap text-slate-700">{gig.description}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Om säljaren</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                    <div>
                        <div className="font-semibold text-lg">{gig.seller?.full_name}</div>
                        <div className="text-sm text-muted-foreground">{gig.seller?.country || 'Sverige'}</div>
                    </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                    {gig.seller?.bio || "Ingen beskrivning tillgänglig."}
                </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
           <Card className="sticky top-24">
             <CardHeader>
               <CardTitle>Beställning</CardTitle>
               <CardDescription>Säker betalning via Stripe Escrow</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-lg font-bold">
                 <span>Totalt pris</span>
                 <span>{formatCurrency(gig.base_price)}</span>
               </div>
               <div className="text-sm text-muted-foreground">
                 Inkluderar plattformsavgift och moms.
               </div>
               {/* This requires creating an order then redirecting to checkout */}
               <form action="/api/orders/create" method="POST">
                  {/* For MVP we might use a Client Component button that calls an API route */}
                  <Link href={`/orders/create?gig_id=${gig.id}`}>
                    <Button className="w-full" size="lg">Beställ nu</Button>
                  </Link>
               </form>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
