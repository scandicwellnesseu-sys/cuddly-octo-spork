import { createClient } from '@/lib/supabaseClient'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Input } from '@/components/ui/input'

// We need to fetch data on server
async function getGigs(category?: string) {
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

  let query = supabase
    .from('gigs')
    .select('*, seller:users(full_name, avatar_url, country)')
    .eq('is_active', true)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching gigs', error)
    return []
  }
  return data
}

export default async function GigsPage({ searchParams }: { searchParams: { category?: string } }) {
  const gigs = await getGigs(searchParams.category)

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Hitta tjänster</h1>
           <p className="text-muted-foreground">Utforska talangfulla frilansare.</p>
        </div>
        {/* Placeholder for filters */}
        <div className="flex gap-2">
            <Button variant="outline">Filtrera</Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gigs.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-10">Inga tjänster hittades just nu.</p>
        ) : (
          gigs.map((gig) => (
            <Link href={`/gigs/${gig.slug}`} key={gig.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-100 relative">
                   {/* Image placeholder */}
                   <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                     Bild
                   </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                     <h3 className="font-semibold line-clamp-2">{gig.title}</h3>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {gig.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                    {/* @ts-ignore */}
                    <span>{gig.seller?.full_name || 'Säljare'}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 border-t flex justify-between items-center bg-slate-50/50">
                   <span className="text-xs text-muted-foreground">Från</span>
                   <span className="font-bold">{formatCurrency(gig.base_price)}</span>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
