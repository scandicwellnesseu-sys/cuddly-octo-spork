import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

async function getProjects() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data, error } = await supabase
    .from('projects')
    .select('*, buyer:users(full_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }
  return data
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Öppna Projekt</h1>
          <p className="text-muted-foreground">Hitta uppdrag som matchar din kompetens.</p>
        </div>
        <Link href="/projects/create">
            <Button>Skapa Projekt</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">Inga öppna projekt just nu.</p>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="mb-2">
                        <Link href={`/projects/${project.id}`} className="hover:underline">
                            {project.title}
                        </Link>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                        Publicerat av {project.buyer?.full_name || 'Anonym'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                        {project.budget_min && project.budget_max
                            ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                            : formatCurrency(project.budget_min || 0) + '+'}
                    </div>
                    <div className="text-xs text-muted-foreground">Budget</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 line-clamp-2">{project.description}</p>
              </CardContent>
              <CardFooter>
                 <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">Visa detaljer & lägg bud</Button>
                 </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
