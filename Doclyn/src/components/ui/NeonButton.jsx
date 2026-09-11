const VARIANTS = {
  primary:
    "neon-btn bg-gradient-to-r from-accent to-accent-2 text-white shadow-[0_8px_24px_rgba(139,92,246,0.28)] hover:shadow-[0_10px_32px_rgba(139,92,246,0.4)]",
  secondary:
    "neon-btn glass text-ink hover:border-line-strong",
  ghost:
    "neon-btn text-muted hover:text-ink hover:bg-white/5",
};

export default function NeonButton({
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
