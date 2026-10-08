import Card from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Deep Performance Analytics
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Drawdown distribution, monthly returns heatmap, and risk-adjusted Sharpe/Sortino ratios.
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center text-center py-20 border-dashed">
        <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-4">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">
          Performance Analytics Suite
        </h2>
        <p className="text-sm text-text-muted max-w-md mt-1">
          Interactive drawdown histograms and monthly returns heatmap will load in Phase 8.
        </p>
      </Card>
    </div>
  );
}