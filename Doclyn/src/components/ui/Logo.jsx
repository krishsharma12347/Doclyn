import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-violet-300/20 bg-white/[0.07] shadow-[0_0_24px_rgba(124,58,237,.22)]">
        <span className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/30 via-violet-500/15 to-cyan-400/25" />
        <span className="relative font-display text-lg font-bold">D</span>
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight">
          Doc<span className="gradient-text-strong">lyn</span>
        </span>
      )}
    </Link>
  );
}
