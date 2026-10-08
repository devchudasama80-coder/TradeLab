'use client';

import { motion } from 'framer-motion';

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  delay = 0,
}) {
  const changeColors = {
    profit: 'text-profit bg-profit/10 border-profit/20',
    loss: 'text-loss bg-loss/10 border-loss/20',
    neutral: 'text-text-muted bg-bg-tertiary border-border-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-bg-card rounded-xl border border-border-primary p-5 hover:border-border-secondary transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-bg-tertiary">
            <Icon className="w-4 h-4 text-accent-gold" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold font-mono text-text-primary tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${changeColors[changeType]}`}
          >
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}