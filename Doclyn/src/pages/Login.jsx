import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] glass-dark neon-border lg:grid-cols-[.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden border-r border-white/8 p-10 lg:block">
        <div className="absolute -left-20 top-1/3 size-60 rounded-full bg-violet-600/15 blur-3xl" />
        <Sparkles className="text-cyan-300" size={20} />
        <h1 className="font-display mt-7 max-w-sm text-4xl font-bold leading-tight">A calmer way to work with documents.</h1>
        <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">Keep your PDF tools and intelligent document workflows in one focused workspace.</p>
        <div className="mt-10 space-y-3">
          {["Fast PDF workflows", "Glassmorphism workspace", "AI-ready document tools"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/7 bg-white/[0.025] p-3 text-sm text-slate-300"><span className="grid size-7 place-items-center rounded-lg bg-cyan-300/10 text-cyan-300">✓</span>{item}</div>)}
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <div className="mx-auto max-w-md">
          <div className="grid size-12 place-items-center rounded-2xl border border-violet-300/15 bg-violet-500/10 text-violet-200"><LockKeyhole size={20} /></div>
          <h2 className="font-display mt-6 text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to your Doclyn workspace.</p>

          <form onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }} className="mt-7 space-y-4">
            <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">Email</span><div className="flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 transition focus-within:border-violet-300/35 focus-within:shadow-[0_0_25px_rgba(124,58,237,.10)]"><Mail size={17} className="text-slate-600" /><input required type="email" placeholder="you@example.com" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" /></div></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">Password</span><div className="flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 transition focus-within:border-violet-300/35"><LockKeyhole size={17} className="text-slate-600" /><input required type={show ? "text" : "password"} placeholder="••••••••" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" /><button type="button" onClick={() => setShow(!show)} className="text-slate-600 hover:text-slate-300">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            <div className="flex justify-end"><button type="button" className="text-xs font-semibold text-violet-300 hover:text-violet-200">Forgot password?</button></div>
            <button className="glow-button flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-500 py-3.5 text-sm font-semibold text-white">Sign in <ArrowRight size={16} /></button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">New to Doclyn? <Link to="/register" className="font-semibold text-violet-300 hover:text-violet-200">Create account</Link></p>
        </div>
      </div>
    </div>
  );
}
