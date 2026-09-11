import { useState } from "react";
import { ArrowRight, Bot, Check, FileArchive, FileCog, FileText, LockKeyhole, Menu, MessageSquareText, Minimize2, ScanText, ShieldCheck, Sparkles, Split, UploadCloud, WandSparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import NeonBackground from "../components/ui/NeonBackground";
import Logo from "../components/ui/Logo";
import GlassButton from "../components/ui/GlassButton";
import ToolCard from "../components/dashboard/ToolCard";
import UploadModal from "../components/upload/UploadModal";

const tools = [
  { icon: FileArchive, title: "Merge PDF", description: "Combine multiple PDFs into one clean document.", accent: "violet", href: "/tools/merge" },
  { icon: Split, title: "Split PDF", description: "Separate pages or extract exactly what you need.", accent: "cyan", href: "/tools/split" },
  { icon: Minimize2, title: "Compress PDF", description: "Reduce file size while keeping documents readable.", accent: "pink", href: "/tools/compress" },
  { icon: FileCog, title: "PDF Tools", description: "A growing workspace for everyday document tasks.", accent: "amber", href: "/dashboard" },
];

export default function Home() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="doclyn-page relative min-h-screen">
      <NeonBackground />
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#tools" className="transition hover:text-white">PDF Tools</a>
          <a href="#ai" className="transition hover:text-white">AI Workspace</a>
          <a href="#security" className="transition hover:text-white">Security</a>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Link to="/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white">Log in</Link>
          <Link to="/register" className="glow-button rounded-xl border border-violet-300/20 bg-white/[0.07] px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500/15">Get started</Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 sm:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen && (
        <div className="relative z-30 mx-5 rounded-2xl glass p-3 sm:hidden">
          <a href="#tools" className="block rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.05]">PDF Tools</a>
          <a href="#ai" className="block rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.05]">AI Workspace</a>
          <Link to="/login" className="block rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.05]">Log in</Link>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <section className="mx-auto max-w-5xl pt-20 text-center sm:pt-28">
          <div className="glass float-slow mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-slate-300">
            <Sparkles size={14} className="text-cyan-300" />
            Modern PDF tools. One intelligent workspace.
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
          </div>

          <h1 className="font-display mt-7 text-5xl font-bold leading-[1.02] tracking-[-.045em] text-white sm:text-7xl lg:text-[82px]">
            Your documents.
            <br />
            <span className="gradient-text">Simplified. Intelligent.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Merge, split and compress PDFs in seconds. Then use Doclyn's intelligent workspace to understand, summarize and analyze documents.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => setUploadOpen(true)} className="glow-button inline-flex items-center justify-center gap-2 rounded-xl border border-violet-300/25 bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_38px_rgba(124,58,237,.22)]">
              <UploadCloud size={18} /> Open workspace <ArrowRight size={16} />
            </button>
            <a href="#tools" className="glow-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]">
              Explore PDF tools
            </a>
          </div>
        </section>

        <section className="relative mx-auto mt-20 max-w-6xl">
          <div className="pointer-events-none absolute -inset-10 rounded-[50px] bg-gradient-to-r from-violet-600/10 via-fuchsia-500/5 to-cyan-400/10 blur-3xl" />
          <div className="glass-dark neon-border relative overflow-hidden rounded-[30px] p-3 shadow-2xl sm:p-4">
            <div className="rounded-[24px] border border-white/8 bg-[#0b0a17]/75">
              <div className="flex items-center gap-3 border-b border-white/8 px-4 py-4 sm:px-6">
                <div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" /></div>
                <div className="mx-auto hidden h-7 w-72 rounded-lg border border-white/8 bg-white/[0.03] sm:block" />
                <div className="size-7 rounded-full border border-cyan-300/15 bg-cyan-300/10" />
              </div>
              <div className="grid min-h-[330px] md:grid-cols-[190px_1fr]">
                <div className="hidden border-r border-white/8 p-4 md:block">
                  <p className="px-2 text-[9px] font-bold uppercase tracking-[.2em] text-slate-600">Workspace</p>
                  <div className="mt-4 space-y-2">
                    {["Overview", "My Files", "PDF Tools", "AI Workspace"].map((item, i) => (
                      <div key={item} className={`rounded-xl px-3 py-2.5 text-xs ${i === 0 ? "border border-violet-300/15 bg-violet-500/15 text-white shadow-[0_0_22px_rgba(124,58,237,.12)]" : "text-slate-500"}`}>{item}</div>
                    ))}
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <div className="flex items-end justify-between">
                    <div><p className="text-xs text-slate-500">Doclyn workspace</p><h2 className="font-display mt-1 text-xl font-semibold">Everything for your PDFs.</h2></div>
                    <span className="hidden rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-[10px] text-cyan-200 sm:block">3 tools ready</span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      [FileArchive, "Merge PDF", "Combine files", "violet"],
                      [Minimize2, "Compress", "Reduce size", "cyan"],
                      [MessageSquareText, "Ask your PDF", "AI powered", "pink"],
                    ].map(([Icon, title, sub, color]) => (
                      <div key={title} className="tool-card glass relative rounded-2xl p-4">
                        <div className={`grid size-10 place-items-center rounded-xl border border-white/10 bg-gradient-to-br ${color === "violet" ? "from-violet-500/25 to-fuchsia-500/10 text-violet-200" : color === "cyan" ? "from-cyan-500/25 to-blue-500/10 text-cyan-200" : "from-fuchsia-500/25 to-pink-500/10 text-fuchsia-200"}`}><Icon size={18} /></div>
                        <p className="mt-5 text-sm font-semibold text-white">{title}</p>
                        <p className="mt-1 text-xs text-slate-500">{sub}</p>
                        <ArrowRight size={15} className="tool-arrow absolute bottom-4 right-4 text-slate-600" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-2xl border border-dashed border-violet-300/15 bg-gradient-to-r from-violet-500/[0.06] to-cyan-400/[0.03] p-5 text-center">
                    <UploadCloud className="mx-auto text-violet-300" size={22} />
                    <p className="mt-2 text-sm font-medium text-slate-300">Drop a document to get started</p>
                    <p className="mt-1 text-xs text-slate-600">Private workspace · PDF up to 50 MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tools" className="pt-28">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-violet-300">PDF workspace</p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Powerful tools. Zero clutter.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">The common PDF tasks you actually need, presented in one focused workspace.</p>
            </div>
            <Link to="/dashboard" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">View all tools <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => <ToolCard key={tool.title} {...tool} />)}
          </div>
        </section>

        <section id="ai" className="relative mt-24 overflow-hidden rounded-[30px] glass-dark neon-border p-6 sm:p-10">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/15 bg-fuchsia-400/[0.07] px-3 py-1.5 text-[11px] font-semibold text-fuchsia-200"><WandSparkles size={14} /> Intelligent workspace</span>
              <h2 className="font-display mt-5 text-3xl font-bold sm:text-4xl">Your PDF can answer back.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">Ask questions about a document, summarize long files, extract important information, and analyze contracts — without turning the interface into a complicated AI dashboard.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Ask questions", "Summarize documents", "Contract risk analysis", "Extract key points"].map((item) => <div key={item} className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-cyan-300" /> {item}</div>)}
              </div>
            </div>
            <div className="glass relative rounded-3xl p-5 sm:p-6">
              <div className="flex items-center gap-3 border-b border-white/8 pb-4">
                <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/25 to-cyan-400/10 text-violet-200"><Bot size={19} /></div>
                <div><p className="text-sm font-semibold">Ask your PDF</p><p className="text-[11px] text-slate-500">AI document assistant</p></div>
                <span className="ml-auto size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" />
              </div>
              <div className="mt-5 space-y-3">
                <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md border border-violet-300/10 bg-violet-500/10 p-3 text-sm text-slate-300">What are the key obligations in this contract?</div>
                <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.045] p-3 text-sm leading-6 text-slate-400">I found 4 key obligations. The strongest one concerns delivery timelines and breach consequences...</div>
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/8 bg-black/15 p-2">
                <div className="flex-1 px-2 text-xs text-slate-600">Ask about this document...</div>
                <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500"><ArrowRight size={15} /></div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="grid gap-4 pt-10 sm:grid-cols-3">
          {[
            [ShieldCheck, "Private by design", "Files are handled only for the task you choose."],
            [LockKeyhole, "Secure workflow", "Authentication and protected API routes are part of the architecture."],
            [ScanText, "Built for documents", "The interface stays focused on fast document workflows."],
          ].map(([Icon, title, desc]) => (
            <div key={title} className="glass rounded-2xl p-5">
              <Icon className="text-cyan-300" size={20} />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/6 px-5 py-8 text-center text-xs text-slate-600">
        <span className="font-semibold text-slate-400">Doclyn</span> · PDF tools and intelligent document workflows.
      </footer>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
