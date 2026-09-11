import { useRef, useState } from "react";
import { CheckCircle2, FileText, LoaderCircle, UploadCloud, X } from "lucide-react";

export default function UploadModal({ open, onClose }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  const addFiles = (list) => {
    const next = Array.from(list || []).filter((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
    setFiles((current) => [...current, ...next].slice(0, 10));
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/65 p-4 backdrop-blur-md" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-dark neon-border relative w-full max-w-2xl overflow-hidden rounded-3xl p-5 shadow-2xl sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 size-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-violet-300">Doclyn workspace</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Upload files</h2>
            <p className="mt-1 text-sm text-slate-400">PDFs stay in your workflow until you choose an action.</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.09] hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div
          className={`relative mt-6 rounded-2xl border border-dashed p-8 text-center transition-all ${dragging ? "border-cyan-300/70 bg-cyan-300/[0.07] shadow-[0_0_35px_rgba(34,211,238,.12)]" : "border-white/15 bg-white/[0.025] hover:border-violet-300/35 hover:bg-white/[0.045]"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple hidden onChange={(e) => addFiles(e.target.files)} />
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-200 shadow-[0_0_28px_rgba(124,58,237,.14)]">
            <UploadCloud size={25} />
          </div>
          <h3 className="mt-4 font-semibold text-white">Drop your PDFs here</h3>
          <p className="mt-1 text-sm text-slate-500">or select files from your device</p>
          <button onClick={() => inputRef.current?.click()} className="glow-button mt-5 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.11]">
            Browse files
          </button>
          <p className="mt-3 text-[11px] text-slate-600">PDF only · up to 50 MB per file</p>
        </div>

        {files.length > 0 && (
          <div className="relative mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.035] p-3">
                <div className="grid size-9 place-items-center rounded-lg bg-violet-500/10 text-violet-300"><FileText size={17} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <CheckCircle2 size={17} className="text-cyan-300" />
                <button onClick={() => setFiles(files.filter((_, i) => i !== index))} className="text-slate-600 hover:text-white"><X size={16} /></button>
              </div>
            ))}
          </div>
        )}

        <div className="relative mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05]">Cancel</button>
          <button disabled={!files.length} className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
            {files.length ? "Continue" : "Select files"}
            {files.length ? <CheckCircle2 size={16} /> : <LoaderCircle size={16} className="opacity-0" />}
          </button>
        </div>
      </div>
    </div>
  );
}
