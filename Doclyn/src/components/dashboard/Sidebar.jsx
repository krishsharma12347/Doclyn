import { FileText, FolderOpen, LayoutDashboard, Settings, Sparkles, Clock3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../ui/Logo";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tools/merge", label: "PDF Tools", icon: FileText },
  { to: "/tools/ai-pdf", label: "AI Workspace", icon: Sparkles },
];

export default function Sidebar({ mobileOpen = false }) {
  return (
    <aside className={`${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed left-4 top-4 bottom-4 z-40 flex w-[248px] flex-col rounded-3xl glass-dark p-4 transition-transform lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]`}>
      <div className="px-2 py-2">
        <Logo />
      </div>

      <div className="mt-8 px-2 text-[10px] font-bold uppercase tracking-[.22em] text-slate-600">Workspace</div>
      <nav className="mt-3 space-y-1.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition-all ${
                isActive
                  ? "border-violet-300/20 bg-gradient-to-r from-violet-500/25 to-cyan-400/10 text-white shadow-[0_0_24px_rgba(124,58,237,.15)]"
                  : "border-transparent text-slate-400 hover:border-white/8 hover:bg-white/[0.045] hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink to="/dashboard" className="flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm text-slate-400 transition hover:border-white/8 hover:bg-white/[0.045] hover:text-white">
          <FolderOpen size={18} /> Files
        </NavLink>
        <NavLink to="/dashboard" className="flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm text-slate-400 transition hover:border-white/8 hover:bg-white/[0.045] hover:text-white">
          <Clock3 size={18} /> Recent
        </NavLink>
      </nav>

      <div className="mt-auto rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-400/20 text-sm font-bold">K</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Your workspace</p>
            <p className="text-xs text-slate-500">Free plan</p>
          </div>
          <Settings size={16} className="ml-auto text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
