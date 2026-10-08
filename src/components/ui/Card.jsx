'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  animate = true,
  onClick,
  ...props
}) {
  const Component = animate ? motion.div : 'div';

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        ...(hover
          ? { whileHover: { y: -2, transition: { duration: 0.2 } } }
          : {}),
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        bg-bg-card rounded-xl border border-border-primary
        ${hover ? 'cursor-pointer hover:border-border-secondary transition-all' : ''}
        ${padding}
        ${className}
      `}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}