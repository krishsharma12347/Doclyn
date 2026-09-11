import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ToolCard({ icon: Icon, title, description, accent = "violet", href = "/dashboard", badge }) {
  const accentClasses = {
    violet: "from-violet-500/25 to-fuchsia-500/10 text-violet-200",
    cyan: "from-cyan-500/25 to-blue-500/10 text-cyan-200",
    pink: "from-fuchsia-500/25 to-pink-500/10 text-fuchsia-200",
    amber: "from-amber-400/20 to-orange-500/10 text-amber-200",
  };
  return (
    <Link to={href} className="tool-card glass-dark group relative block overflow-hidden rounded-2xl p-5">
      <div className={`tool-icon mb-5 grid size-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br ${accentClasses[accent]}`}>
        <Icon size={21} strokeWidth={1.8} />
      </div>
      {badge && (
        <span className="absolute right-4 top-4 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
          {badge}
        </span>
      )}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1.5 max-w-[250px] text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <ArrowUpRight className="tool-arrow shrink-0 text-slate-500" size={19} />
      </div>
    </Link>
  );
}
