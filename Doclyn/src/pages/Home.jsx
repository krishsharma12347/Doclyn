import { Link } from "react-router-dom";
import { FileStack, Scissors, Minimize2, Sparkles, ArrowRight } from "lucide-react";
import ToolCard from "../components/dashboard/ToolCard";
import NeonButton from "../components/ui/NeonButton";
import { useAuth } from "../context/AuthContext";

const TOOLS = [
  {
    to: "/tools/merge",
    icon: FileStack,
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single, ordered document.",
  },
  {
    to: "/tools/split",
    icon: Scissors,
    title: "Split PDF",
    description: "Extract exactly the pages you need from any PDF.",
  },
  {
    to: "/tools/compress",
    icon: Minimize2,
    title: "Compress PDF",
    description: "Shrink file size while keeping documents sharp and readable.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-14">
      {/* Hero */}
      <section className="fade-up mx-auto max-w-2xl text-center">
        <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-accent-2">
          <Sparkles className="size-3.5" strokeWidth={2} />
          Fast, private PDF tools
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Every PDF tool you need,
          <br />
          in one place.
        </h1>
        <p className="mt-4 text-base text-muted">
          Merge, split, and compress documents in seconds — no installs, no watermarks,
          files removed automatically after 24 hours.
        </p>
        {!isAuthenticated && (
          <div className="mt-7 flex items-center justify-center gap-3">
            <Link to="/register">
              <NeonButton>
                Get started free <ArrowRight className="size-4" strokeWidth={2} />
              </NeonButton>
            </Link>
            <Link to="/login">
              <NeonButton variant="secondary">Log in</NeonButton>
            </Link>
          </div>
        )}
      </section>

      {/* Tool grid */}
      <section className="mt-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Tools</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.to} {...tool} />
          ))}

          {/* AI Contract Analyzer — flagship feature, backend not built yet in Phase 1 */}
          <div className="tool-card glass rounded-2xl border border-accent/30 bg-gradient-to-br from-accent-soft to-transparent p-5 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-start justify-between">
              <span className="tool-icon flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white">
                <Sparkles className="size-5" strokeWidth={1.75} />
              </span>
              <span className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent-2">
                AI Powered · Coming soon
              </span>
            </div>
            <h3 className="text-base font-semibold text-ink">Legal Contract Analyzer</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Upload a contract and get an instant risk summary, missing-clause detection,
              and plain-language breakdown.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
