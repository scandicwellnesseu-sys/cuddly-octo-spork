import { useState } from 'react';

interface LocalKeyword {
  keyword: string;
  search_volume: number;
  kd_se: number;
  cpc_sek: number;
  serp_features: string[];
}

export default function LocalSeoPage() {
  const [region, setRegion] = useState('stockholm');
  const [keywords, setKeywords] = useState<LocalKeyword[]>([]);

  async function fetchLocalKeywords(selectedRegion: string) {
    const response = await fetch(`http://localhost:8000/local/keywords?region=${selectedRegion}`);
    const data = await response.json();
    setKeywords(data);
  }

  return (
    <main>
      <h1>Lokal SEO</h1>
      <p>Upptäck kommun- och regionbaserade sökord samt NAP-insikter.</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="region" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Region
        </label>
        <select
          id="region"
          value={region}
          onChange={(event) => {
            const value = event.target.value;
            setRegion(value);
            fetchLocalKeywords(value);
          }}
          style={{ padding: '0.75rem', width: '100%', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}
        >
          <option value="stockholm">Stockholm</option>
          <option value="göteborg">Göteborg</option>
          <option value="malmö">Malmö</option>
        </select>
        <button className="button" style={{ marginTop: '1rem' }} onClick={() => fetchLocalKeywords(region)}>
          Hämta lokala sökord
        </button>
      </div>
      {keywords.length > 0 && (
        <section className="card">
          <h2>Sökord för {region}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Sökord</th>
                <th>Volym</th>
                <th>KD_SE</th>
                <th>CPC (SEK)</th>
                <th>SERP-features</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((item) => (
                <tr key={item.keyword}>
                  <td>{item.keyword}</td>
                  <td>{item.search_volume}</td>
                  <td>{item.kd_se}</td>
                  <td>{item.cpc_sek.toFixed(2)}</td>
                  <td>{item.serp_features.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
