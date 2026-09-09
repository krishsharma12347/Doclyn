import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          <span className="font-medium text-ink">Doclyn</span> — precise PDF tooling.
        </p>

        <div className="flex items-center gap-4 text-sm">
          <Link
            to="/tools/merge"
            className="text-muted transition-colors duration-200 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 rounded"
          >
            Merge
          </Link>
          <Link
            to="/tools/split"
            className="text-muted transition-colors duration-200 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 rounded"
          >
            Split
          </Link>
          <Link
            to="/tools/compress"
            className="text-muted transition-colors duration-200 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 rounded"
          >
            Compress
          </Link>
        </div>

        <p className="font-mono text-xs text-muted">v1.0.0</p>
      </div>
    </footer>
  )
}
