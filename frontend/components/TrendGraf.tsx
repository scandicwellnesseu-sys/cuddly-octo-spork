import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendGrafProps {
  data: { manad: string; volym: number }[];
}

export function TrendGraf({ data }: TrendGrafProps) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>12 månaders trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="manad" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString('sv-SE')} sökningar`} />
          <Line type="monotone" dataKey="volym" stroke="#2563eb" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
