import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface KeywordRow {
  keyword: string;
  search_volume: number;
  kd_se: number;
  cpc_sek: number;
  trend: number[];
  serp_features: string[];
}

interface KeywordTableProps {
  query: string;
}

export function KeywordTable({ query }: KeywordTableProps) {
  const { data } = useSWR<KeywordRow[]>(
    query ? `http://localhost:8000/keywords/search` : null,
    (url) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }).then((res) => res.json())
  );

  if (!query) {
    return <p>Ange ett sökord för att se resultat.</p>;
  }

  if (!data) {
    return <p>Laddar...</p>;
  }

  return (
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
        {data.map((row) => (
          <tr key={row.keyword}>
            <td>{row.keyword}</td>
            <td>{row.search_volume.toLocaleString('sv-SE')}</td>
            <td>{row.kd_se}</td>
            <td>{row.cpc_sek.toFixed(2)}</td>
            <td>{row.serp_features.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
