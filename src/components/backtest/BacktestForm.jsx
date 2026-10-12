'use client';

import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Play, Shield } from 'lucide-react';
import { SUPPORTED_MARKETS, TIMEFRAMES, STRATEGIES } from '../../constants/index';

const STRATEGY_DEFAULTS = {
  ma_crossover: { fastPeriod: 20, slowPeriod: 50 },
  rsi: { period: 14, oversold: 30, overbought: 70 },
  macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  bollinger: { period: 20, stdDev: 2.0 },
  stochastic: { kPeriod: 14, dPeriod: 3, oversold: 20, overbought: 80 },
  supertrend: { period: 10, multiplier: 3 },
  cci: { period: 20, oversold: -100, overbought: 100 },
  ema_rsi_combo: {
    fastPeriod: 20,
    slowPeriod: 50,
    rsiPeriod: 14,
    rsiOversold: 40,
    rsiOverbought: 60,
  },
};

export default function BacktestForm({ config, setConfig, onRun, loading }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'strategy') {
      setConfig((prev) => ({
        ...prev,
        strategy: value,
        parameters: { ...STRATEGY_DEFAULTS[value] },
      }));
      return;
    }

    if (type === 'checkbox') {
      setConfig((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const rr =
    config.useStopLoss &&
    config.useTakeProfit &&
    Number(config.stopLossPct) > 0
      ? (Number(config.takeProfitPct) / Number(config.stopLossPct)).toFixed(2)
      : null;

  return (
    <div className="bg-bg-card border border-border-primary rounded-xl p-4 md:p-5 space-y-4">
      {/* Row 1 — Core */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-52">
          <Select
            label="Strategy"
            name="strategy"
            value={config.strategy}
            onChange={handleChange}
            options={STRATEGIES.map((s) => ({ value: s.value, label: s.label }))}
          />
        </div>

        <div className="w-full sm:w-44">
          <Select
            label="Market Pair"
            name="symbol"
            value={config.symbol}
            onChange={handleChange}
            options={SUPPORTED_MARKETS.map((m) => ({
              value: m.value,
              label: m.label,
            }))}
          />
        </div>

        <div className="w-full sm:w-32">
          <Select
            label="Timeframe"
            name="timeframe"
            value={config.timeframe}
            onChange={handleChange}
            options={TIMEFRAMES}
          />
        </div>

        <div className="w-full sm:w-32">
          <Input
            label="Capital ($)"
            name="initialCapital"
            type="number"
            value={config.initialCapital}
            onChange={handleChange}
          />
        </div>

        <div className="w-full sm:w-28">
          <Input
            label="Risk (%)"
            name="riskPerTrade"
            type="number"
            step="0.1"
            value={config.riskPerTrade}
            onChange={handleChange}
          />
        </div>

        {/* Strategy params */}
        <div className="flex flex-wrap items-end gap-2 border-l border-border-primary/60 pl-3">
          {config.strategy === 'ma_crossover' && (
            <>
              <div className="w-20">
                <Input label="Fast" name="fastPeriod" type="number" value={config.parameters?.fastPeriod ?? 20} onChange={handleParamChange} />
              </div>
              <div className="w-20">
                <Input label="Slow" name="slowPeriod" type="number" value={config.parameters?.slowPeriod ?? 50} onChange={handleParamChange} />
              </div>
            </>
          )}
          {config.strategy === 'rsi' && (
            <>
              <div className="w-16"><Input label="Period" name="period" type="number" value={config.parameters?.period ?? 14} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="OS" name="oversold" type="number" value={config.parameters?.oversold ?? 30} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="OB" name="overbought" type="number" value={config.parameters?.overbought ?? 70} onChange={handleParamChange} /></div>
            </>
          )}
          {config.strategy === 'macd' && (
            <>
              <div className="w-16"><Input label="Fast" name="fastPeriod" type="number" value={config.parameters?.fastPeriod ?? 12} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="Slow" name="slowPeriod" type="number" value={config.parameters?.slowPeriod ?? 26} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="Sig" name="signalPeriod" type="number" value={config.parameters?.signalPeriod ?? 9} onChange={handleParamChange} /></div>
            </>
          )}
          {config.strategy === 'bollinger' && (
            <>
              <div className="w-20"><Input label="Period" name="period" type="number" value={config.parameters?.period ?? 20} onChange={handleParamChange} /></div>
              <div className="w-20"><Input label="Std" name="stdDev" type="number" step="0.1" value={config.parameters?.stdDev ?? 2} onChange={handleParamChange} /></div>
            </>
          )}
          {config.strategy === 'stochastic' && (
            <>
              <div className="w-16"><Input label="%K" name="kPeriod" type="number" value={config.parameters?.kPeriod ?? 14} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="%D" name="dPeriod" type="number" value={config.parameters?.dPeriod ?? 3} onChange={handleParamChange} /></div>
            </>
          )}
          {config.strategy === 'supertrend' && (
            <>
              <div className="w-20"><Input label="ATR" name="period" type="number" value={config.parameters?.period ?? 10} onChange={handleParamChange} /></div>
              <div className="w-20"><Input label="Mult" name="multiplier" type="number" step="0.1" value={config.parameters?.multiplier ?? 3} onChange={handleParamChange} /></div>
            </>
          )}
          {config.strategy === 'cci' && (
            <>
              <div className="w-16"><Input label="Period" name="period" type="number" value={config.parameters?.period ?? 20} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="OS" name="oversold" type="number" value={config.parameters?.oversold ?? -100} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="OB" name="overbought" type="number" value={config.parameters?.overbought ?? 100} onChange={handleParamChange} /></div>
            </>
          )}
          {config.strategy === 'ema_rsi_combo' && (
            <>
              <div className="w-16"><Input label="Fast" name="fastPeriod" type="number" value={config.parameters?.fastPeriod ?? 20} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="Slow" name="slowPeriod" type="number" value={config.parameters?.slowPeriod ?? 50} onChange={handleParamChange} /></div>
              <div className="w-16"><Input label="RSI" name="rsiPeriod" type="number" value={config.parameters?.rsiPeriod ?? 14} onChange={handleParamChange} /></div>
            </>
          )}
        </div>

        <div className="ml-auto min-w-37.5">
          <Button variant="primary" className="w-full h-10.5" icon={Play} isLoading={loading} onClick={onRun}>
            Execute Run
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-border-primary/60">
        <div className="flex items-center gap-2 text-accent-gold mr-2">
          <Shield className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Risk Engine</span>
        </div>

        <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            name="useStopLoss"
            checked={!!config.useStopLoss}
            onChange={handleChange}
            className="accent-accent-gold w-3.5 h-3.5"
          />
          Stop-Loss
        </label>

        <div className="w-24">
          <Input
            label="SL %"
            name="stopLossPct"
            type="number"
            step="0.1"
            value={config.stopLossPct ?? 1.5}
            onChange={handleChange}
            disabled={!config.useStopLoss}
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none ml-2">
          <input
            type="checkbox"
            name="useTakeProfit"
            checked={!!config.useTakeProfit}
            onChange={handleChange}
            className="accent-accent-gold w-3.5 h-3.5"
          />
          Take-Profit
        </label>

        <div className="w-24">
          <Input
            label="TP %"
            name="takeProfitPct"
            type="number"
            step="0.1"
            value={config.takeProfitPct ?? 3.0}
            onChange={handleChange}
            disabled={!config.useTakeProfit}
          />
        </div>

        <div className="w-24">
          <Input
            label="Fee %"
            name="feeRate"
            type="number"
            step="0.01"
            value={config.feeRate ?? 0.1}
            onChange={handleChange}
          />
        </div>

        <div className="w-24">
          <Input
            label="Slippage %"
            name="slippagePct"
            type="number"
            step="0.01"
            value={config.slippagePct ?? 0.05}
            onChange={handleChange}
          />
        </div>

        {rr && (
          <div className="ml-auto px-3 py-2 rounded-lg bg-accent-gold/10 border border-accent-gold/20 text-xs font-mono">
            <span className="text-text-muted">R:R </span>
            <span className="text-accent-gold font-bold">1 : {rr}</span>
          </div>
        )}
      </div>
    </div>
  );
}