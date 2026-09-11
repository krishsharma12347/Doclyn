import { Link } from "react-router-dom";
import { FileStack, Scissors, Minimize2, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";

const QUICK_LINKS = [
  { to: "/tools/merge", icon: FileStack, label: "Merge PDF" },
  { to: "/tools/split", icon: Scissors, label: "Split PDF" },
  { to: "/tools/compress", icon: Minimize2, label: "Compress PDF" },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 lg:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="glass h-fit rounded-2xl border border-line p-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">Quick tools</p>
        <nav className="mt-2 space-y-1">
          {QUICK_LINKS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-ink"
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="mt-1 text-sm text-muted">Your recent activity will show up here.</p>

        <GlassCard className="mt-6 flex flex-col items-center justify-center px-6 py-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Clock className="size-5" strokeWidth={1.75} />
          </span>
          <p className="mt-4 text-sm font-medium text-ink">No processing history yet</p>
          <p className="mt-1 max-w-xs text-xs text-muted">
            File history tracking is coming in a future update. Run a tool to get started.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
