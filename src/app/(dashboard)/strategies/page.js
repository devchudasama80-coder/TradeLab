'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Brain, Play, Loader2 } from 'lucide-react';

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/strategies');
        const data = await res.json();
        if (data.strategies) setStrategies(data.strategies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Strategy Library
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Built-in quantitative strategies loaded from MySQL
        </p>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center gap-2 text-xs font-mono text-text-muted">
          <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
          Loading strategies from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {strategies.map((s) => (
            <Card key={s.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-bg-tertiary text-text-muted border border-border-primary">
                    {s.code}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-text-primary">{s.name}</h2>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-bg-tertiary/60 border border-border-primary/60 text-xs font-mono space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-semibold">
                    Default Parameters
                  </div>
                  {Object.entries(s.parameters || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-text-muted">{key}</span>
                      <span className="text-text-primary font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/backtester" className="w-full">
                <Button variant="primary" className="w-full" size="sm" icon={Play}>
                  Launch in Terminal
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}