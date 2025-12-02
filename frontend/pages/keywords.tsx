import { useState } from 'react';
import { KeywordTable } from '../components/KeywordTable';
import { TrendGraf } from '../components/TrendGraf';

const trendData = [
  { manad: 'maj', volym: 1500 },
  { manad: 'jun', volym: 1600 },
  { manad: 'jul', volym: 1700 },
  { manad: 'aug', volym: 1750 },
  { manad: 'sep', volym: 1800 },
  { manad: 'okt', volym: 1850 },
  { manad: 'nov', volym: 1900 },
  { manad: 'dec', volym: 2000 },
  { manad: 'jan', volym: 2050 },
  { manad: 'feb', volym: 2100 },
  { manad: 'mar', volym: 2150 },
  { manad: 'apr', volym: 2200 }
];

export default function KeywordsPage() {
  const [query, setQuery] = useState('ashwagandha');

  return (
    <main>
      <h1>Sökordsforskning</h1>
      <p>Analysera svenska sökord, long-tail-varianter och SERP-features i realtid.</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="keyword" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Sökord
        </label>
        <input
          id="keyword"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ padding: '0.75rem', width: '100%', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}
          placeholder="Ex. ashwagandha gummies"
        />
      </div>
      <section className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <h2>Resultat</h2>
          <KeywordTable query={query} />
        </div>
        <TrendGraf data={trendData} />
      </section>
    </main>
  );
}
