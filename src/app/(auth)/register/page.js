'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registration failed.');
        return;
      }

      toast.success('Account created successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-trading-grid flex items-center justify-center p-6 relative overflow-hidden">
      <div className="glow-ambient-emerald top-[-100px] right-[20%]" />

      <div className="w-full max-w-md bg-bg-card/90 border border-border-primary backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="DC Funded Trader Logo"
              width={200}
              height={60}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="text-xl font-extrabold tracking-tight">
              Trade<span className="text-accent-gold">Lab</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Create Quant Account
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Start testing strategies with historical data
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            icon={User}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={loading}
            icon={UserPlus}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-text-muted">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-accent-gold font-semibold hover:underline inline-flex items-center gap-0.5"
          >
            Sign In <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}