import { AlertTriangle, CheckCircle2, Download } from 'lucide-react'
import Button from './Button'
import { formatBytes } from './FileListItem'

/*
  Shared loading / success / error block used by all three tool pages.
  Props:
    - status: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
    - message: string shown for uploading/processing/error
    - result: { url, filename, size } on success
    - onRetry: optional retry handler shown on error
    - onReset: optional "start over" handler shown on success
*/
export default function ProgressState({ status, message, result, onRetry, onReset }) {
  if (status === 'idle') return null

  if (status === 'uploading' || status === 'processing') {
    return (
      <div className="rounded-lg border border-line bg-surface p-5">
        <p className="font-mono text-sm text-accent animate-pulse">
          {message || (status === 'uploading' ? 'Uploading files…' : 'Processing…')}
        </p>
        <div className="mt-3 h-1 w-full overflow-hidden rounded bg-line">
          <div className="h-full w-1/3 animate-pulse rounded bg-accent" />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="rounded-lg border border-error/40 bg-surface p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-error" strokeWidth={2} />
          <div className="flex-1">
            <p className="text-sm font-medium text-error">{message || 'The job failed.'}</p>
            {onRetry ? (
              <div className="mt-3">
                <Button variant="secondary" onClick={onRetry}>
                  Retry
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-success/40 bg-surface p-5">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} />
        <div className="flex-1">
          <p className="text-sm font-medium text-ink">Done — your file is ready.</p>
          <p className="mt-1 font-mono text-xs text-muted">
            {result?.filename || 'output.pdf'}
            {result?.size ? ` · ${formatBytes(result.size)}` : ''}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {result?.url ? (
              <a
                href={result.url}
                download={result.filename}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-canvas"
              >
                <Download className="size-4" strokeWidth={1.75} />
                Download
              </a>
            ) : (
              <p className="text-sm text-warning">
                The job finished but no download URL was returned.
              </p>
            )}

            {onReset ? (
              <Button variant="secondary" onClick={onReset}>
                Start over
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
