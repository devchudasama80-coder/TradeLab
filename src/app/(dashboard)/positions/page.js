import Card from '@/components/ui/Card';
import { ArrowLeftRight } from 'lucide-react';

export default function PositionsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Open Positions & Order Book
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Monitor open simulated trade positions and real-time P&L exposure.
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center text-center py-20 border-dashed">
        <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-4">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">
          Positions Dashboard
        </h2>
        <p className="text-sm text-text-muted max-w-md mt-1">
          Active simulated positions will render here during real-time backtest playback.
        </p>
      </Card>
    </div>
  );
}