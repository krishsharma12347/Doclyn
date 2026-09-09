import { FileStack, Scissors, Minimize2 } from 'lucide-react'
import ToolCard from '../components/ToolCard'

// Structured as data so more tools can be added without touching the layout.
const TOOLS = [
  {
    to: '/tools/merge',
    icon: FileStack,
    title: 'Merge PDF',
    description: 'Combine two or more PDFs into a single, ordered document.',
  },
  {
    to: '/tools/split',
    icon: Scissors,
    title: 'Split PDF',
    description: 'Pull out an exact page range and keep only what you need.',
  },
  {
    to: '/tools/compress',
    icon: Minimize2,
    title: 'Compress PDF',
    description: 'Shrink file size at low, medium or high compression.',
  },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          PDF workshop
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Precise PDF tools, no clutter.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Merge, split and compress documents in a few clicks. Doclyn keeps the workflow tight
          and the output predictable.
        </p>
      </section>

      <section className="border-t border-line py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Tools</h2>
          <span className="font-mono text-xs text-muted">{TOOLS.length} available</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.to} {...tool} />
          ))}
        </div>
      </section>
    </div>
  )
}
