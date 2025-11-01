# UX/UI-Skiss & Komponenter

## Navigationsstruktur
1. Projektöversikt
2. Sökordsforskning
3. Konkurrenter & SERP
4. Site Audit
5. Backlinks
6. Innehållsplanering
7. Lokal SEO

## Designprinciper
- UI på svenska, typsnitt Inter, färgpalett inspirerad av nordiskt ljus (blå, vit, accent orange).
- Alla monetära värden visas i SEK med två decimaler.
- Tillgänglighet: WCAG AA, tydliga kontraster, ARIA-etiketter.

## Layoutskiss (textuell)
```
-------------------------------------------------
| Logo | Projektväljare | + Lägg till projekt  ⚙ |
-------------------------------------------------
| Sidomeny              | Innehållsområde        |
| 1. Projektöversikt    | Huvudkort: KPI         |
| 2. Sökordsforskning   | Diagram: Trend         |
| ...                   | Tabell: Sökord         |
-------------------------------------------------
```

## Komponentexempel – Trendgraf (React + Recharts)
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendGrafProps {
  data: { manad: string; volym: number }[];
}

export const TrendGraf: React.FC<TrendGrafProps> = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="text-lg font-semibold mb-2">12 månaders trend</h3>
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="manad" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `${value.toLocaleString('sv-SE')}`}/>
        <Tooltip formatter={(value: number) => `${value.toLocaleString('sv-SE')} sökningar`} />
        <Line type="monotone" dataKey="volym" stroke="#2563eb" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
```

## Interaktionsflöden
- **Sökordsforskning:** Ange sökord → visa huvudkort med volym, KD_SE, CPC, trenddiagram och tabell med relaterade sökord.
- **Audit:** Klicka “Starta audit” → modal med bekräftelse → statuskort i realtid → färdig rapport i tabell.
- **Innehållsbrief:** Välj konkurrenter + CTA-typ → genererar brief i panel med exportknappar.
- **Lokal SEO:** Sök stad → filtrerad lista med lokala sökord och NAP-status.

## Exportkomponenter
- `ExportKnapp` erbjuder CSV eller PDF (via serverrenderad markdown till PDF).
- Download feedback via toast på svenska: “Export klar – filen laddades ned.”

