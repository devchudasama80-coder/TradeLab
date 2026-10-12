'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function EquityChart({ data = [], height = 280, isPositive = true }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="flex items-center justify-center text-xs font-mono text-[#8B949E]"
      >
        No equity curve data available
      </div>
    );
  }

  const formattedData = data.map((item) => {
    const dateObj = new Date(item.time * 1000);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      timeStr: formattedDate,
      equity: parseFloat(Number(item.equity).toFixed(2))
    };
  });

  const equities = formattedData.map((d) => d.equity);
  const minEquity = Math.min(...equities);
  const maxEquity = Math.max(...equities);

  const range = maxEquity - minEquity;
  const padding = range > 0 ? range * 0.15 : 20;

  const yMin = Math.floor(minEquity - padding);
  const yMax = Math.ceil(maxEquity + padding);

  const finalReturn = equities[equities.length - 1] - equities[0];
  const chartIsPositive = finalReturn >= 0;

  const strokeColor = chartIsPositive ? '#10B981' : '#EF4444';
  const gradientId = chartIsPositive ? 'equityGradientGreen' : 'equityGradientRed';

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="equityGradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" opacity={0.5} />

          <XAxis
            dataKey="timeStr"
            stroke="#484F58"
            tick={{ fill: '#8B949E', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#1E2638' }}
            minTickGap={35}
          />

          <YAxis
            domain={[yMin, yMax]}
            stroke="#484F58"
            tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E2638' }}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
            width={65}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const point = payload[0].payload;
                return (
                  <div className="bg-[#0D111A] border border-[#1E2638] rounded-lg p-3 shadow-xl text-xs font-mono space-y-1">
                    <div className="text-[#8B949E] text-[10px]">{point.timeStr}</div>
                    <div className="text-[#F0F6FC] font-bold flex items-center space-x-2">
                      <span>Portfolio Equity:</span>
                      <span className={chartIsPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                        ${point.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <Area
            type="monotone"
            dataKey="equity"
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}