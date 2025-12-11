import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

async function getProject(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data, error } = await supabase
    .from('projects')
    .select('*, buyer:users(*), bids:project_bids(*, seller:users(*))')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) notFound()

  // In a real app, we check if current user is the owner to show bids
  // Here we show bids to everyone for simplicity or hide sensitive info.
  // For MVP: let's show bid count and list only if owner (mocked logic visually).

  return (
    <div className="container py-10">
       <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <div className="text-sm text-muted-foreground mb-6">
                Publicerat {new Date(project.created_at).toLocaleDateString()} av {project.buyer?.full_name}
              </div>

              <div className="prose max-w-none bg-slate-50 p-6 rounded-lg">
                <p className="whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Offerer ({project.bids?.length || 0})</h3>
              <div className="space-y-4">
                 {project.bids && project.bids.length > 0 ? (
                    project.bids.map((bid: any) => (
                      <Card key={bid.id}>
                        <CardHeader className="p-4">
                          <div className="flex justify-between">
                             <div className="font-semibold">{bid.seller?.full_name}</div>
                             <div className="font-bold">{formatCurrency(bid.amount)}</div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                           <p className="text-sm text-slate-600 mb-2">{bid.message}</p>
                           <div className="text-xs text-muted-foreground">Leveranstid: {bid.delivery_days} dagar</div>
                           {/* Owner actions would go here: Accept Bid */}
                        </CardContent>
                      </Card>
                    ))
                 ) : (
                    <p className="text-muted-foreground">Inga offerter än.</p>
                 )}
              </div>
            </div>
         </div>

         <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Budget</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold text-center mb-4">
                    {project.budget_min && project.budget_max
                        ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                        : formatCurrency(project.budget_min || 0)}
                 </div>

                 {/* This would be a form or modal to place a bid */}
                 <Button className="w-full">Lämna offert</Button>
                 <p className="text-xs text-center mt-2 text-muted-foreground">
                   Endast verifierade frilansare kan lämna offert.
                 </p>
              </CardContent>
            </Card>
         </div>
       </div>
    </div>
  )
}
