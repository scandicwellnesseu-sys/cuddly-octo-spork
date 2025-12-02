import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <header className="grid" style={{ gap: '1rem' }}>
        <h1>Svensk SEO-plattform</h1>
        <p>
          Ett Semrush-inspirerat arbetsflöde optimerat för Google.se. Hantera projekt, analysera sökord,
          konkurrenter och skapa AI-briefar direkt på svenska.
        </p>
        <nav className="nav" aria-label="Huvudnavigering">
          <Link href="/keywords">Sökordsforskning</Link>
          <Link href="/audit">Site Audit</Link>
          <Link href="/content">Innehållsplanering</Link>
          <Link href="/local">Lokal SEO</Link>
        </nav>
      </header>
      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <article className="card">
          <h2>Projektöversikt</h2>
          <p>Skapa och hantera kundprojekt, koppla domäner och se synlighetsindex över tid.</p>
        </article>
        <article className="card">
          <h2>Konkurrenter &amp; SERP</h2>
          <p>Jämför domäner, upptäck nya sökord och följ SERP-diff varje vecka.</p>
        </article>
        <article className="card">
          <h2>Backlink-översikt</h2>
          <p>Visualisera länkprofil, tox-score och generera outreach-listor.</p>
        </article>
      </section>
    </main>
  );
}
