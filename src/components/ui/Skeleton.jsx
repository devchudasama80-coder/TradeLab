export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded',
  };

  return (
    <div
      className={`
        animate-pulse bg-bg-tertiary
        ${variants[variant]}
        ${className}
      `}
    />
  );
}