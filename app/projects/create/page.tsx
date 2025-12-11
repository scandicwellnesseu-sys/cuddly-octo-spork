'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'

export default function CreateProjectPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_min: 1000,
    budget_max: 5000,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }

    const { error: insertError } = await supabase
      .from('projects')
      .insert({
        buyer_id: session.user.id,
        title: formData.title,
        description: formData.description,
        budget_min: Number(formData.budget_min),
        budget_max: Number(formData.budget_max),
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push('/projects')
      router.refresh()
    }
  }

  return (
    <div className="container py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Skapa nytt Projekt</CardTitle>
          <CardDescription>Beskriv vad du behöver hjälp med.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Projekttitel</Label>
              <Input
                id="title"
                name="title"
                placeholder="Jag behöver en logotyp..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beskrivning</Label>
              <textarea
                id="description"
                name="description"
                rows={6}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Detaljerad beskrivning av uppdraget..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Budget Min (SEK)</Label>
                <Input
                  id="budget_min"
                  name="budget_min"
                  type="number"
                  min="0"
                  value={formData.budget_min}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_max">Budget Max (SEK)</Label>
                <Input
                  id="budget_max"
                  name="budget_max"
                  type="number"
                  min="0"
                  value={formData.budget_max}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Publicerar...' : 'Publicera Projekt'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
