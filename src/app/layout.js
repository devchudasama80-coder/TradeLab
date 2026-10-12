import './globals.css';

export const metadata = {
  title: 'TradeLab | Algorithmic Trading & Backtesting Terminal',
  description: 'Institutional-grade quantitative backtesting platform with real Binance OHLCV data.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#07090E] text-[#F0F6FC] antialiased">
        {children}
      </body>
    </html>
  );
}