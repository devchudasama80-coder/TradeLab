'use client';

import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Play } from 'lucide-react';
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
    const { name, value } = e.target;

    if (name === 'strategy') {
      setConfig((prev) => ({
        ...prev,
        strategy: value,
        parameters: { ...STRATEGY_DEFAULTS[value] },
      }));
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

  return (
    <div className="bg-bg-card border border-border-primary rounded-xl p-4 md:p-5">
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
              <div className="w-16">
                <Input label="Period" name="period" type="number" value={config.parameters?.period ?? 14} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="OS" name="oversold" type="number" value={config.parameters?.oversold ?? 30} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="OB" name="overbought" type="number" value={config.parameters?.overbought ?? 70} onChange={handleParamChange} />
              </div>
            </>
          )}

          {config.strategy === 'macd' && (
            <>
              <div className="w-16">
                <Input label="Fast" name="fastPeriod" type="number" value={config.parameters?.fastPeriod ?? 12} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="Slow" name="slowPeriod" type="number" value={config.parameters?.slowPeriod ?? 26} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="Signal" name="signalPeriod" type="number" value={config.parameters?.signalPeriod ?? 9} onChange={handleParamChange} />
              </div>
            </>
          )}

          {config.strategy === 'bollinger' && (
            <>
              <div className="w-20">
                <Input label="Period" name="period" type="number" value={config.parameters?.period ?? 20} onChange={handleParamChange} />
              </div>
              <div className="w-20">
                <Input label="StdDev" name="stdDev" type="number" step="0.1" value={config.parameters?.stdDev ?? 2.0} onChange={handleParamChange} />
              </div>
            </>
          )}

          {config.strategy === 'stochastic' && (
            <>
              <div className="w-16">
                <Input label="%K" name="kPeriod" type="number" value={config.parameters?.kPeriod ?? 14} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="%D" name="dPeriod" type="number" value={config.parameters?.dPeriod ?? 3} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="OS" name="oversold" type="number" value={config.parameters?.oversold ?? 20} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="OB" name="overbought" type="number" value={config.parameters?.overbought ?? 80} onChange={handleParamChange} />
              </div>
            </>
          )}

          {config.strategy === 'supertrend' && (
            <>
              <div className="w-20">
                <Input label="ATR" name="period" type="number" value={config.parameters?.period ?? 10} onChange={handleParamChange} />
              </div>
              <div className="w-20">
                <Input label="Mult" name="multiplier" type="number" step="0.1" value={config.parameters?.multiplier ?? 3} onChange={handleParamChange} />
              </div>
            </>
          )}

          {config.strategy === 'cci' && (
            <>
              <div className="w-16">
                <Input label="Period" name="period" type="number" value={config.parameters?.period ?? 20} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="OS" name="oversold" type="number" value={config.parameters?.oversold ?? -100} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="OB" name="overbought" type="number" value={config.parameters?.overbought ?? 100} onChange={handleParamChange} />
              </div>
            </>
          )}

          {config.strategy === 'ema_rsi_combo' && (
            <>
              <div className="w-16">
                <Input label="Fast" name="fastPeriod" type="number" value={config.parameters?.fastPeriod ?? 20} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="Slow" name="slowPeriod" type="number" value={config.parameters?.slowPeriod ?? 50} onChange={handleParamChange} />
              </div>
              <div className="w-16">
                <Input label="RSI" name="rsiPeriod" type="number" value={config.parameters?.rsiPeriod ?? 14} onChange={handleParamChange} />
              </div>
            </>
          )}
        </div>

        <div className="ml-auto min-w-[160px]">
          <Button
            variant="primary"
            className="w-full h-[42px]"
            icon={Play}
            isLoading={loading}
            onClick={onRun}
          >
            Execute Run
          </Button>
        </div>
      </div>
    </div>
  );
}