import { useState } from 'react';

interface ContentBrief {
  outline: { heading: string; text: string }[];
  meta_description: string;
  recommended_entities: string[];
  tone: string;
  cta: string;
}

export default function ContentPage() {
  const [keyword, setKeyword] = useState('ashwagandha gummies');
  const [brief, setBrief] = useState<ContentBrief | null>(null);

  async function generateBrief() {
    const response = await fetch('http://localhost:8000/content/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, competitors: ['apoteket.se'], tone: 'Varm och rådgivande', cta_type: 'Köp nu' })
    });
    setBrief(await response.json());
  }

  return (
    <main>
      <h1>Innehållsplanering</h1>
      <p>Skapa AI-genererade briefar med svensk tonalitet, entiteter och CTA-förslag.</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="keyword" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Fokus-sökord
        </label>
        <input
          id="keyword"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          style={{ padding: '0.75rem', width: '100%', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}
        />
        <button className="button" style={{ marginTop: '1rem' }} onClick={generateBrief}>
          Generera brief
        </button>
      </div>
      {brief && (
        <section className="card">
          <h2>AI-brief för {keyword}</h2>
          <p><strong>Tonalitet:</strong> {brief.tone}</p>
          <p><strong>CTA:</strong> {brief.cta}</p>
          <p><strong>Meta-beskrivning:</strong> {brief.meta_description}</p>
          <h3>Rubriker</h3>
          <ul>
            {brief.outline.map((row) => (
              <li key={`${row.heading}-${row.text}`}>{row.heading}: {row.text}</li>
            ))}
          </ul>
          <h3>Rekommenderade entiteter</h3>
          <p>{brief.recommended_entities.join(', ')}</p>
        </section>
      )}
    </main>
  );
}
