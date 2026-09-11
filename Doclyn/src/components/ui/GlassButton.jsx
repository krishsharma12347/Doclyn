import { ArrowRight } from "lucide-react";

export default function GlassButton({ children, variant = "primary", icon = true, className = "", ...props }) {
  const base = "glow-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold";
  const variants = {
    primary: "border border-violet-300/25 bg-gradient-to-r from-violet-600/90 to-indigo-500/90 text-white shadow-[0_0_30px_rgba(124,58,237,.18)]",
    secondary: "border border-white/12 bg-white/[0.055] text-slate-100 hover:bg-white/[0.09]",
    ghost: "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05]",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
