import Card from '@/components/ui/Card';
import { FlaskConical } from 'lucide-react';

export default function BacktesterPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Backtesting Engine
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Configure strategy rules, select historical market data, and simulate trades.
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center text-center py-20 border-dashed">
        <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-4">
          <FlaskConical className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">
          Backtester Engine Setup Ready
        </h2>
        <p className="text-sm text-text-muted max-w-md mt-1">
          In Phase 6 & 7 we will integrate the Moving Average engine and TradingView charts right here!
        </p>
      </Card>
    </div>
  );
}