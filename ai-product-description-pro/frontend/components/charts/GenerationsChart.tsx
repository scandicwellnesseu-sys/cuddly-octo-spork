'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data for the chart
const data = [
  { date: '1 Jan', generations: 12 },
  { date: '5 Jan', generations: 19 },
  { date: '10 Jan', generations: 15 },
  { date: '15 Jan', generations: 25 },
  { date: '20 Jan', generations: 32 },
  { date: '25 Jan', generations: 28 },
  { date: '30 Jan', generations: 35 },
];

export function GenerationsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E3A8A',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="generations"
            stroke="#1E3A8A"
            strokeWidth={2}
            fill="url(#colorGenerations)"
            name="Genereringar"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
