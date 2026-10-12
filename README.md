# ⚡ TradeLab — Institutional-Grade Algorithmic Trading & Backtesting Terminal

> A full-stack, production-grade quantitative trading platform built with **Next.js 16 (App Router)**, **TradingView Lightweight Charts v5**, **MySQL (Prisma ORM)**, and real-time **Binance OHLCV market pipelines**.

---

## 🚀 Live Demo & Repository

- **Live Platform**: 
- **GitHub Repository**: [https://github.com/devchudasama80-coder/TradeLab.git](https://github.com/devchudasama80-coder/TradeLab.git)

---

## ✨ Core Features

### 📈 1. High-Performance Backtesting Engine
- **Event-Driven Simulation Engine**: Computes strategy fills against 500+ live Binance historical candles in `<50ms`.
- **Multi-Strategy Suite**:
  - Moving Average Crossover (Fast/Slow EMA/SMA)
  - RSI Reversal (Overbought/Oversold Bounds)
  - MACD Signal Crossover
  - Bollinger Bands Mean Reversion
  - Stochastic Oscillator, Supertrend, CCI, and EMA+RSI Combos.

### 🛡️ 2. Advanced Risk Management & Execution Rules
- **Dynamic Position Sizing**: Risk-per-trade percentage allocation.
- **Stop-Loss (SL) & Take-Profit (TP)**: Automatic order execution on tick simulation.
- **Realistic Transaction Costs**: Configurable maker/taker commission fees (`%`) and market slippage (`%`).
- **Risk Exit Breakdown Cards**: Detailed counters tracking trades exited via SL, TP, or Signal reversal.

### 📊 3. Interactive TradingView Terminal
- **Lightweight Charts v5 Integration**: Financial candlestick charts with real-time zooming, panning, and crosshair tools.
- **Visual Buy/Sell Signal Markers**: Green/Red directional arrows rendered directly on entry/exit bars.
- **Live Equity Curve**: Auto-scaled portfolio capital trajectory with fill gradients.

### 💼 4. Quant Analytics & Trade Audit Logs
- **Key Metrics**: Net P&L, Win Rate %, Profit Factor, Max Drawdown %, Average Win/Loss, and Expectancy.
- **Searchable Trade Logs**: Filter fills by Trade ID, Direction (BUY/SELL), Exit Reason (`TAKE_PROFIT`, `STOP_LOSS`, `SIGNAL`, `END_OF_DATA`), and net realized returns.

### 🔐 5. Full Authentication & Cloud Persistence
- **JWT Session Security**: HttpOnly cookie session management with `jose` and `bcryptjs`.
- **Cloud Database Integration**: MySQL powered by Prisma ORM hosted on Aiven Cloud.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19, JavaScript)
- **Styling**: Tailwind CSS + Custom Dark Terminal Design Tokens + Framer Motion
- **Data Visualization**: TradingView Lightweight Charts v5, Recharts
- **Database**: MySQL + Prisma ORM (v6.4.0)
- **Authentication**: JWT (`jose`), `bcryptjs`, Next.js Middleware Edge Guards
- **Market Data**: Binance REST API (Real OHLCV Klines)
- **Deployment**: Vercel Serverless

---

## 🚀 Local Development Setup

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/devchudasama80-coder/TradeLab.git
cd TradeLab/tradelab
npm install