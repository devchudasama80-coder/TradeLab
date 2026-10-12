'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, LogOut, Activity } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [btcPrice, setBtcPrice] = useState({
    price: '96,450.00',
    change: '+1.85',
    isPositive: true
  });

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch (err) {}
    }
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveBtcPrice() {
      try {
        const res = await fetch('/api/market-data?ticker=true');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.price) {
            const priceFormatted = Number(data.price).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            const changeVal = Number(data.change24h || 0);
            const changeFormatted = (changeVal >= 0 ? '+' : '') + changeVal.toFixed(2);

            setBtcPrice({
              price: priceFormatted,
              change: changeFormatted,
              isPositive: changeVal >= 0
            });
          }
        }
      } catch (err) {}
    }
    fetchLiveBtcPrice();
    const interval = setInterval(fetchLiveBtcPrice, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {}
  }

  return (
    <header className="h-14 md:h-16 border-b border-[#1E2638] bg-[#07090E]/90 backdrop-blur-md sticky top-0 z-40 px-3 md:px-8 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="DC Funded Trader"
            width={280}
            height={70}
            priority
            className="h-6 sm:h-8 md:h-11 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="flex items-center space-x-2 md:space-x-3 bg-[#0D111A] border border-[#1E2638] px-2 py-1 md:px-3.5 md:py-1.5 rounded-lg text-[10px] md:text-xs font-mono">
          <div className="hidden sm:flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" />
            <span className="text-[#8B949E] font-medium">BTC/USD</span>
          </div>
          <span className="text-[#F0F6FC] font-bold">${btcPrice.price}</span>
          <span
            className={`flex items-center font-bold px-1 md:px-1.5 py-0.5 rounded ${
              btcPrice.isPositive
                ? 'text-[#10B981] bg-[#10B981]/10'
                : 'text-[#EF4444] bg-[#EF4444]/10'
            }`}
          >
            {btcPrice.isPositive ? (
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1 inline" />
            ) : (
              <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1 inline" />
            )}
            {btcPrice.change}%
          </span>
        </div>

        {user ? (
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col items-end text-xs">
              <span className="text-[#F0F6FC] font-semibold">{user.name || 'Trader'}</span>
              <span className="text-[#8B949E] text-[10px] truncate max-w-[140px]">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 md:p-2 rounded-lg bg-[#0D111A] border border-[#1E2638] text-[#8B949E] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors"
            >
              <LogOut className="w-4 h-4 md:w-4 md:h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 md:space-x-3 text-[10px] md:text-xs font-medium">
            <Link
              href="/login"
              className="hidden sm:block text-[#8B949E] hover:text-[#F0F6FC] transition-colors px-2 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#07090E] font-bold px-2 py-1.5 md:px-3.5 md:py-1.5 rounded-lg shadow-sm hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}