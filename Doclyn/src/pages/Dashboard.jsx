import { useState } from "react";
import { FileArchive, FileCog, FileText, Minimize2, MoreHorizontal, Plus, ShieldCheck, Sparkles, Split, UploadCloud, Clock3, ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NeonBackground from "../components/ui/NeonBackground";
import Sidebar from "../components/dashboard/Sidebar";
import ToolCard from "../components/dashboard/ToolCard";
import UploadModal from "../components/upload/UploadModal";
import Logo from "../components/ui/Logo";

const tools = [
  { icon: FileArchive, title: "Merge PDF", description: "Combine multiple documents into one.", accent: "violet", href: "/tools/merge" },
  { icon: Split, title: "Split PDF", description: "Extract or separate pages quickly.", accent: "cyan", href: "/tools/split" },
  { icon: Minimize2, title: "Compress PDF", description: "Make your files smaller.", accent: "pink", href: "/tools/compress" },
  { icon: FileCog, title: "PDF tools", description: "More document actions are coming.", accent: "amber", href: "/dashboard", badge: "More" },
];

export default function Dashboard() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <div className="doclyn-page relative min-h-screen">
      <NeonBackground />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] gap-4 p-4">
        <Sidebar mobileOpen={mobile} />
        <div className="min-w-0 flex-1 lg:pl-2">
          <header className="glass-dark sticky top-4 z-30 flex items-center justify-between rounded-2xl px-4 py-3 lg:px-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobile(!mobile)} className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 lg:hidden">{mobile ? <X size={19} /> : <Menu size={19} />}</button>
              <div className="lg:hidden"><Logo compact /></div>
              <div className="hidden lg:block"><p className="text-xs text-slate-500">Workspace</p><h1 className="font-display text-lg font-semibold">Dashboard</h1></div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setUploadOpen(true)} className="glow-button inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-600/90 to-indigo-500/90 px-3.5 py-2.5 text-xs font-semibold text-white sm:px-4 sm:text-sm"><Plus size={16} /> New task</button>
              <div className="hidden size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold sm:grid">K</div>
            </div>
          </header>

          <main className="px-1 pb-10 pt-8 sm:px-2 lg:pt-10">
            <section className="relative overflow-hidden rounded-[28px] glass-dark neon-border p-6 sm:p-8">
              <div className="absolute -right-16 -top-20 size-72 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[.22em] text-violet-300">Doclyn workspace</p>
                <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything for your PDFs, <span className="gradient-text">in one place.</span></h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Pick a tool or upload a document. Your workspace is designed to keep the workflow simple.</p>
                <button onClick={() => setUploadOpen(true)} className="glow-button mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.1]"><UploadCloud size={17} /> Upload PDF</button>
              </div>
            </section>

            <section className="mt-8">
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[.2em] text-slate-600">Quick tools</p><h3 className="font-display mt-1.5 text-xl font-semibold">Start with a task</h3></div>
                <Link to="/tools/ai-pdf" className="hidden items-center gap-1 text-xs font-semibold text-slate-500 hover:text-white sm:flex">AI Workspace <ArrowUpRight size={14} /></Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {tools.map((tool) => <ToolCard key={tool.title} {...tool} />)}
              </div>
            </section>

            <section className="mt-8 grid gap-4 xl:grid-cols-[1.3fr_.7fr]">
              <div className="glass-dark rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-slate-500">Recent activity</p><h3 className="mt-1 font-display text-lg font-semibold">Your recent files</h3></div>
                  <button className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.05] hover:text-white"><MoreHorizontal size={18} /></button>
                </div>
                <div className="mt-5 space-y-2">
                  {["Project-contract.pdf", "Marketing-brochure.pdf", "Invoice-september.pdf"].map((name, i) => (
                    <div key={name} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.025] p-3 transition hover:border-white/12 hover:bg-white/[0.045]">
                      <div className="grid size-10 place-items-center rounded-xl border border-violet-300/10 bg-violet-500/10 text-violet-300"><FileText size={18} /></div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-300">{name}</p><p className="mt-0.5 text-xs text-slate-600">{i + 1} day{i ? "s" : ""} ago · PDF</p></div>
                      <span className="hidden rounded-full border border-emerald-300/10 bg-emerald-300/[0.06] px-2 py-1 text-[10px] text-emerald-300 sm:block">Ready</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-dark rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/25 to-cyan-400/10 text-violet-200"><Sparkles size={18} /></div><div><p className="text-xs text-slate-500">AI workspace</p><h3 className="font-display font-semibold">Ask your PDF</h3></div></div>
                <p className="mt-5 text-sm leading-6 text-slate-500">Upload a document and ask questions, create summaries, or analyze important clauses.</p>
                <Link to="/tools/ai-pdf" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/15 bg-fuchsia-400/[0.07] px-4 py-2.5 text-sm font-semibold text-fuchsia-200 transition hover:bg-fuchsia-400/[0.12]">Open AI workspace <ArrowUpRight size={15} /></Link>
              </div>
            </section>

            <section className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                [ShieldCheck, "Secure workflow", "Protected API routes"],
                [Clock3, "Fast tasks", "Simple document flows"],
                [Sparkles, "AI ready", "Intelligent features"],
              ].map(([Icon, title, desc]) => <div key={title} className="glass rounded-2xl p-4"><Icon size={17} className="text-cyan-300" /><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-slate-600">{desc}</p></div>)}
            </section>
          </main>
        </div>
      </div>
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
