import Link from "next/link"
import { siteConfig } from "@/config/siteConfig"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">{siteConfig.name}</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link
              href="/gigs"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Hitta frilansare
            </Link>
            <Link
              href="/projects"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Hitta uppdrag
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Logga in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Registrera dig
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  )
}
