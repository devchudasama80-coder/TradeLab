'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-accent-gold hover:bg-accent-gold-hover text-black font-semibold shadow-lg shadow-accent-gold/10',
  secondary:
    'bg-bg-tertiary hover:bg-bg-card-hover text-text-primary border border-border-primary',
  danger:
    'bg-loss/10 hover:bg-loss/20 text-loss border border-loss/20',
  ghost:
    'bg-transparent hover:bg-bg-tertiary text-text-secondary hover:text-text-primary',
  success:
    'bg-profit/10 hover:bg-profit/20 text-profit border border-profit/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-6 py-3 text-base font-semibold',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer select-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
}