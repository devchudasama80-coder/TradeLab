'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  name,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

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
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-lg bg-bg-tertiary border
            ${error ? 'border-loss' : 'border-border-primary focus:border-accent-gold'}
            ${Icon ? 'pl-10' : 'pl-4'}
            ${type === 'password' ? 'pr-10' : 'pr-4'}
            py-2.5 text-sm text-text-primary font-mono
            placeholder:text-text-muted placeholder:font-sans
            focus:outline-none focus:ring-1
            ${error ? 'focus:ring-loss' : 'focus:ring-accent-gold/40'}
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-loss text-xs mt-1">{error}</p>}
    </div>
  );
}