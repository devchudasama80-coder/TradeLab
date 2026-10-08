import Card from '@/components/ui/Card';
import { ArrowLeftRight } from 'lucide-react';

export default function TradesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Trade History & Logs
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Detailed breakdown of historical trade executions, entry/exit fills, fees, and P&L.
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center text-center py-20 border-dashed">
        <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-4">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">
          Trade Logs
        </h2>
        <p className="text-sm text-text-muted max-w-md mt-1">
          Detailed entry prices, stop-loss triggers, exit reasons, and trade duration logs will display here.
        </p>
      </Card>
    </div>
  );
}