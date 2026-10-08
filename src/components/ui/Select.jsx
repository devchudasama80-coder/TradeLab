'use client';

import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  options = [],
  value,
  onChange,
  name,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
        >
          {label}
          {required && <span className="text-loss ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-lg bg-bg-tertiary border appearance-none
            ${error ? 'border-loss' : 'border-border-primary focus:border-accent-gold'}
            pl-4 pr-10 py-2.5 text-sm text-text-primary
            focus:outline-none focus:ring-1
            ${error ? 'focus:ring-loss' : 'focus:ring-accent-gold/40'}
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          `}
        >
          <option value="" disabled className="bg-bg-card text-text-muted">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-bg-card text-text-primary"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>

      {error && <p className="text-loss text-xs mt-1">{error}</p>}
    </div>
  );
}