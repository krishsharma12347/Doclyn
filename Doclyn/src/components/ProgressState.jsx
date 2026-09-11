import { AlertCircle, CheckCircle2, Download, RotateCcw } from "lucide-react";
import NeonButton from "./ui/NeonButton";
import api from "../services/api";

/** Streams the output file to the browser using the stored access token. */
async function downloadFile(fileId, filename) {
  const response = await api.get(`/files/${fileId}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "doclyn-output.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default function ProgressState({ status, message, result, onRetry, onReset }) {
  if (status === "idle") return null;

  if (status === "uploading" || status === "processing") {
    return (
      <div className="glass fade-up flex items-center gap-3 rounded-xl border border-line px-4 py-3.5">
        <span className="animate-pulse-soft size-2 rounded-full bg-accent" />
        <span className="text-sm text-muted">{message}</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="fade-up flex flex-col gap-3 rounded-xl border border-error/30 bg-error/10 px-4 py-3.5">
        <div className="flex items-center gap-2.5 text-sm text-error">
          <AlertCircle className="size-4 shrink-0" strokeWidth={1.75} />
          {message}
        </div>
        {onRetry ? (
          <NeonButton variant="secondary" onClick={onRetry} className="self-start">
            <RotateCcw className="size-3.5" strokeWidth={1.75} />
            Try again
          </NeonButton>
        ) : null}
      </div>
    );
  }

  if (status === "success" && result) {
    return (
      <div className="fade-up flex flex-col gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" strokeWidth={1.75} />
          Done — {result.output_file_name}
        </div>
        <div className="flex gap-2">
          <NeonButton onClick={() => downloadFile(result.output_file_id, result.output_file_name)}>
            <Download className="size-3.5" strokeWidth={1.75} />
            Download
          </NeonButton>
          <NeonButton variant="ghost" onClick={onReset}>
            Start over
          </NeonButton>
        </div>
      </div>
    );
  }

  return null;
}
