import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ToolCard({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-3 rounded-lg border border-line bg-surface p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-canvas"
    >
      <span className="flex size-10 items-center justify-center rounded-lg border border-line transition-all duration-200 group-hover:border-accent group-hover:bg-accent-tint">
        {Icon ? <Icon className="size-5 text-accent" strokeWidth={1.75} /> : null}
      </span>

      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors duration-200 group-hover:text-accent">
        Open tool
        <ArrowRight
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </span>
    </Link>
  )
}
