import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, FileArchive, FileText, Minimize2, Sparkles, Split, UploadCloud } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NeonBackground from "../components/ui/NeonBackground";
import Logo from "../components/ui/Logo";
import UploadModal from "../components/upload/UploadModal";

const data = {
  merge: { title: "Merge PDF", desc: "Combine multiple PDF files into one document.", icon: FileArchive, accent: "violet", cta: "Merge files" },
  split: { title: "Split PDF", desc: "Extract pages or split one PDF into separate files.", icon: Split, accent: "cyan", cta: "Split PDF" },
  compress: { title: "Compress PDF", desc: "Reduce PDF size while keeping the document usable.", icon: Minimize2, accent: "pink", cta: "Compress PDF" },
  "ai-pdf": { title: "Ask your PDF", desc: "Upload a document and ask questions about its contents.", icon: Sparkles, accent: "violet", cta: "Start AI workspace" },
};

export default function ToolPage() {
  const { tool } = useParams();
  const [open, setOpen] = useState(false);
  const current = useMemo(() => data[tool] || data.merge, [tool]);
  const Icon = current.icon;

  return (
    <div className="doclyn-page relative min-h-screen">
      <NeonBackground />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Logo />
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.08]"><ArrowLeft size={15} /> Dashboard</Link>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-5 pb-20 pt-12">
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-200 shadow-[0_0_35px_rgba(124,58,237,.15)]"><Icon size={28} /></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-violet-300">Doclyn tool</p>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">{current.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">{current.desc}</p>
        </div>

        <div className="glass-dark neon-border mt-12 rounded-[30px] p-4 sm:p-6">
          <div className="rounded-[24px] border border-dashed border-violet-300/20 bg-gradient-to-br from-violet-500/[0.07] via-transparent to-cyan-400/[0.04] p-10 text-center sm:p-16">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.045] text-slate-300 shadow-[0_0_35px_rgba(124,58,237,.10)]">
              <UploadCloud size={27} />
            </div>
            <h2 className="font-display mt-5 text-xl font-semibold">Drop your PDF here</h2>
            <p className="mt-2 text-sm text-slate-600">or select a file from your device</p>
            <button onClick={() => setOpen(true)} className="glow-button mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white">Choose files <ArrowRight size={16} /></button>
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-600"><FileText size={13} /> PDF only · maximum 50 MB</div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["Private workflow", "Simple interface", "Fast feedback"].map((item) => <div key={item} className="glass rounded-xl px-4 py-3 text-center text-xs text-slate-500">{item}</div>)}
        </div>
      </main>

      <UploadModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
