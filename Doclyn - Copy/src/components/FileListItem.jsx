import { FileText, X } from 'lucide-react'

export function formatBytes(bytes) {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(1)} ${units[unit]}`
}

export default function FileListItem({ name, size, status, onRemove }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 transition-all duration-200 hover:border-accent">
      <FileText className="size-4 shrink-0 text-accent" strokeWidth={1.75} />

      <span className="min-w-0 flex-1 truncate font-mono text-sm text-ink">{name}</span>

      <span className="shrink-0 font-mono text-xs text-muted">{formatBytes(size)}</span>

      {status ? (
        <span className="shrink-0 rounded border border-line px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted">
          {status}
        </span>
      ) : null}

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="shrink-0 rounded p-1 text-muted transition-all duration-200 hover:bg-accent-tint hover:text-error focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      ) : null}
    </li>
  )
}
