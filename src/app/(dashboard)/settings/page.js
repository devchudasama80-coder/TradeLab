import Card from '@/components/ui/Card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Platform Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Configure default risk parameters, commission rates, and API keys.
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center text-center py-20 border-dashed">
        <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-4">
          <Settings className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">
          User & Engine Settings
        </h2>
        <p className="text-sm text-text-muted max-w-md mt-1">
          Manage commission defaults, slippage estimates, and trading account preferences.
        </p>
      </Card>
    </div>
  );
}