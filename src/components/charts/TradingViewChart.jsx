'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  createSeriesMarkers,
} from 'lightweight-charts';

export default function TradingViewChart({ candles = [], trades = [] }) {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    chartContainerRef.current.innerHTML = '';

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: '#0F1419' },
        textColor: '#94A3B8',
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace',
      },
      grid: {
        vertLines: { color: '#1E293B' },
        horzLines: { color: '#1E293B' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#F59E0B',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#F59E0B',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: '#1E293B',
      },
      timeScale: {
        borderColor: '#1E293B',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartInstanceRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    const formattedCandles = candles.map((c) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candlestickSeries.setData(formattedCandles);

    const markers = [];
    trades.forEach((trade) => {
      if (trade.entryTime) {
        markers.push({
          time: trade.entryTime,
          position: 'belowBar',
          color: '#10B981',
          shape: 'arrowUp',
          text: `BUY @ $${trade.entryPrice}`,
        });
      }
      if (trade.exitTime) {
        markers.push({
          time: trade.exitTime,
          position: 'aboveBar',
          color: '#EF4444',
          shape: 'arrowDown',
          text: `SELL @ $${trade.exitPrice} (${
            trade.pnl >= 0 ? '+' : ''
          }$${trade.pnl})`,
        });
      }
    });

    markers.sort((a, b) => a.time - b.time);

    if (typeof candlestickSeries.setMarkers === 'function') {
      candlestickSeries.setMarkers(markers);
    } else if (typeof createSeriesMarkers === 'function') {
      createSeriesMarkers(candlestickSeries, markers);
    }
                    
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles, trades]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border-primary bg-bg-card">
      <div ref={chartContainerRef} className="w-full h-105" />
    </div>
  );
}