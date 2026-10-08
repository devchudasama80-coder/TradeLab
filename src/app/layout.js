import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'TradeLab — Algorithmic Trading Backtesting Platform',
  description:
    'Professional backtesting platform for crypto and forex trading strategies. Analyze, optimize, and validate your trading strategies with historical data.',
  keywords: [
    'trading',
    'backtesting',
    'algorithmic trading',
    'crypto',
    'forex',
    'technical analysis',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-bg-primary text-text-primary">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0F1419',
              border: '1px solid #1E293B',
              color: '#F1F5F9',
            },
          }}
        />
      </body>
    </html>
  );
}