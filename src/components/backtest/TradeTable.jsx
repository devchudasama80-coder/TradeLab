'use client';

export default function TradeTable({ trades = [] }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-bg-card border border-border-primary rounded-xl p-8 text-center text-xs text-text-muted">
        No executed trades for this backtest run.
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border-primary rounded-xl overflow-hidden w-full">
      <div className="overflow-x-auto max-h-95 overflow-y-auto">
        <table className="w-full text-left text-xs font-mono min-w-175">
          <thead className="bg-bg-tertiary sticky top-0 z-10 text-text-muted uppercase tracking-wider text-[10px]">
            <tr className="border-b border-border-primary">
              <th className="py-2.5 px-4 font-semibold">ID</th>
              <th className="py-2.5 px-4 font-semibold">Side</th>
              <th className="py-2.5 px-4 font-semibold">Entry Time</th>
              <th className="py-2.5 px-4 font-semibold">Entry Price</th>
              <th className="py-2.5 px-4 font-semibold">Exit Time</th>
              <th className="py-2.5 px-4 font-semibold">Exit Price</th>
              <th className="py-2.5 px-4 font-semibold">Qty</th>
              <th className="py-2.5 px-4 font-semibold">Fees</th>
              <th className="py-2.5 px-4 font-semibold text-right">Net P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/40">
            {trades.map((t) => {
              const isWin = t.pnl >= 0;
              return (
                <tr
                  key={t.id}
                  className="hover:bg-bg-tertiary/50 transition-colors"
                >
                  <td className="py-2 px-4 text-text-muted">{t.id}</td>
                  <td className="py-2 px-4">
                    <span className="text-profit font-bold text-[11px]">
                      {t.direction}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-text-secondary whitespace-nowrap">
                    {new Date(t.entryTime * 1000).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2 px-4 text-text-primary">
                    ${Number(t.entryPrice).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-text-secondary whitespace-nowrap">
                    {new Date(t.exitTime * 1000).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2 px-4 text-text-primary">
                    ${Number(t.exitPrice).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-text-secondary">
                    {Number(t.quantity).toFixed(4)}
                  </td>
                  <td className="py-2 px-4 text-text-muted">
                    ${Number(t.feePaid).toFixed(2)}
                  </td>
                  <td
                    className={`py-2 px-4 text-right font-bold whitespace-nowrap ${
                      isWin ? 'text-profit' : 'text-loss'
                    }`}
                  >
                    {isWin ? '+' : ''}${Number(t.pnl).toFixed(2)}
                    <span className="text-[10px] ml-1.5 opacity-80">
                      ({isWin ? '+' : ''}
                      {t.returnPct}%)
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}