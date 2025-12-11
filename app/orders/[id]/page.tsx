import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

async function getOrder(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data, error } = await supabase
    .from('orders')
    .select('*, gig:gigs(title), project:projects(title), buyer:users(full_name), seller:users(full_name)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)
  if (!order) notFound()

  return (
    <div className="container py-10 max-w-4xl">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">Order #{order.id.substring(0, 8)}</h1>
         <div className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium">
            {order.status}
         </div>
       </div>

       <div className="grid md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orderdetaljer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <div className="text-sm text-muted-foreground">Tjänst / Projekt</div>
                    <div className="font-semibold text-lg">{order.gig?.title || order.project?.title}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-muted-foreground">Köpare</div>
                        <div>{order.buyer?.full_name}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Säljare</div>
                        <div>{order.seller?.full_name}</div>
                    </div>
                 </div>
              </CardContent>
            </Card>

            <Card>
               <CardHeader>
                 <CardTitle>Aktivitet</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-muted-foreground text-sm">Ingen aktivitet än.</p>
               </CardContent>
            </Card>
         </div>

         <div className="md:col-span-1 space-y-6">
            <Card>
               <CardHeader>
                 <CardTitle>Betalning</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex justify-between font-bold text-lg">
                     <span>Belopp</span>
                     <span>{formatCurrency(order.amount)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Status: {order.stripe_payment_status || 'Pending'}
                  </div>

                  {order.status === 'pending_payment' && (
                     <Button className="w-full">Betala nu</Button>
                  )}
                  {order.status === 'delivered' && (
                     <Button className="w-full bg-green-600 hover:bg-green-700">Godkänn leverans</Button>
                  )}
               </CardContent>
            </Card>
         </div>
       </div>
    </div>
  )
}
