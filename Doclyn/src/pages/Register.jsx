import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  return (
    <div className="w-full max-w-xl rounded-[30px] glass-dark neon-border p-6 sm:p-10">
      <div className="mx-auto max-w-md">
        <div className="grid size-12 place-items-center rounded-2xl border border-cyan-300/15 bg-cyan-400/10 text-cyan-200"><Sparkles size={20} /></div>
        <h1 className="font-display mt-6 text-3xl font-bold">Create your workspace</h1>
        <p className="mt-2 text-sm text-slate-500">Start with Doclyn's core PDF tools and expand into intelligent workflows.</p>

        <form onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }} className="mt-7 space-y-4">
          <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">Full name</span><div className="flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 focus-within:border-violet-300/35"><UserRound size={17} className="text-slate-600" /><input required placeholder="Your name" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" /></div></label>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">Email</span><div className="flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 focus-within:border-violet-300/35"><Mail size={17} className="text-slate-600" /><input required type="email" placeholder="you@example.com" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" /></div></label>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">Password</span><div className="flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 focus-within:border-violet-300/35"><LockKeyhole size={17} className="text-slate-600" /><input required minLength={8} type={show ? "text" : "password"} placeholder="At least 8 characters" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" /><button type="button" onClick={() => setShow(!show)} className="text-slate-600 hover:text-slate-300">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          <button className="glow-button flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-500 py-3.5 text-sm font-semibold text-white">Create account <ArrowRight size={16} /></button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-violet-300 hover:text-violet-200">Sign in</Link></p>
      </div>
    </div>
  );
}
