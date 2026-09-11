import { Outlet, Link } from "react-router-dom";
import NeonBackground from "../components/ui/NeonBackground";
import Logo from "../components/ui/Logo";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="doclyn-page relative min-h-screen">
      <NeonBackground />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Logo />
        <Link to="/" className="text-sm text-slate-500 transition hover:text-white">Back to home</Link>
      </header>
      <main className="relative z-10 grid min-h-[calc(100vh-80px)] place-items-center px-5 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
