import { FileText, X, Check } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileListItem({ name, size, status, onRemove }) {
  return (
    <li className="glass flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <FileText className="size-4 shrink-0 text-accent-2" strokeWidth={1.75} />
        <span className="truncate text-sm text-ink">{name}</span>
        <span className="shrink-0 font-mono text-xs text-muted">{formatBytes(size)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {status === "uploaded" && <Check className="size-4 text-success" strokeWidth={2} />}
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md p-1 text-muted transition-colors hover:bg-white/5 hover:text-error"
            aria-label={`Remove ${name}`}
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        ) : null}
      </div>
    </li>
  );
}
