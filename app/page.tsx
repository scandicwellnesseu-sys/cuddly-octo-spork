import Link from "next/link"
import { siteConfig } from "@/config/siteConfig"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 bg-slate-50 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Hitta verifierade frilansare i <span className="text-primary">Sverige & Norden</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Säker betalning, BankID-verifierade experter och smidig projektledning.
            Allt på en plats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/gigs">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Hitta frilansare
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                Bli frilansare
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 container">
        <h2 className="text-2xl font-bold mb-8 text-center">Populära Kategorier</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {siteConfig.categories.map((cat) => (
            <Link href={`/gigs?category=${cat}`} key={cat}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{cat}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">BankID Verifiering</h3>
              <p className="text-muted-foreground">Alla säljare verifieras med BankID för din trygghet.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Säkra Betalningar</h3>
              <p className="text-muted-foreground">Vi håller pengarna tills du är nöjd med leveransen.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Nordisk Support</h3>
              <p className="text-muted-foreground">Vi finns här för att hjälpa dig på ditt språk.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
