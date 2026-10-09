'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function EquityChart({ equityCurve = [] }) {
  if (!equityCurve || equityCurve.length === 0) return null;

  const formattedData = equityCurve.map((pt) => ({
    time: new Date(pt.time * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    equity: pt.equity,
  }));

  const minEquity = Math.min(...equityCurve.map((p) => p.equity));
  const maxEquity = Math.max(...equityCurve.map((p) => p.equity));

  return (
    <div className="w-full h-56 bg-bg-card rounded-xl border border-border-primary p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            domain={[Math.floor(minEquity * 0.99), Math.ceil(maxEquity * 1.01)]}
            tickFormatter={(v) => `$${v.toLocaleString()}`}
            tickLine={false}
            orientation="right"
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F1419',
              borderColor: '#1E293B',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#F1F5F9',
              fontFamily: 'monospace',
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Capital']}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#F59E0B"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#equityGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}