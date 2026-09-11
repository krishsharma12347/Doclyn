import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ to, icon: Icon, title, description, badge, comingSoon = false }) {
  const content = (
    <div className="tool-card glass h-full rounded-2xl border border-line p-5">
      <div className="mb-4 flex items-start justify-between">
        <span className="tool-icon flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        {badge ? (
          <span className="rounded-full border border-line-strong bg-white/5 px-2.5 py-1 text-[11px] font-medium text-accent-2">
            {badge}
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
      {!comingSoon && (
        <div className="tool-arrow mt-4 flex items-center gap-1 text-sm font-medium text-accent-2">
          Open tool <ArrowRight className="size-3.5" strokeWidth={2} />
        </div>
      )}
    </div>
  );

  if (comingSoon) {
    return <div className="cursor-not-allowed opacity-80">{content}</div>;
  }

  return <Link to={to}>{content}</Link>;
}
