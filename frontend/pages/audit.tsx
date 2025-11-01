import { useState } from 'react';

interface AuditIssue {
  title: string;
  priority: number;
}

export default function AuditPage() {
  const [domain, setDomain] = useState('scandicwellness.se');
  const [report, setReport] = useState<any>(null);

  async function handleAudit() {
    const start = await fetch('http://localhost:8000/audit/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    }).then((res) => res.json());

    const response = await fetch(`http://localhost:8000/audit/report/${start.audit_id}`);
    setReport(await response.json());
  }

  return (
    <main>
      <h1>Site Audit</h1>
      <p>Crawla din svenska domän och få en prioriterad åtgärdslista.</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="domain" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Domän
        </label>
        <input
          id="domain"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          style={{ padding: '0.75rem', width: '100%', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}
          placeholder="Ex. scandicwellness.se"
        />
        <button className="button" style={{ marginTop: '1rem' }} onClick={handleAudit}>
          Starta audit
        </button>
      </div>
      {report && (
        <section className="card">
          <h2>Prioriterad lista</h2>
          <ol>
            {report.issues?.map((issue: AuditIssue) => (
              <li key={issue.title}>
                {issue.title} – Prioritet {issue.priority}
              </li>
            ))}
          </ol>
          <p>{report.summary}</p>
        </section>
      )}
    </main>
  );
}
