const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-55'

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-hover active:scale-[0.99]',
  secondary:
    'border border-line bg-surface text-ink hover:border-accent hover:text-accent active:scale-[0.99]',
  ghost: 'text-muted hover:text-accent hover:bg-accent-tint',
  danger: 'bg-error text-white hover:brightness-90 active:scale-[0.99]',
}

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  fullWidth = false,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
