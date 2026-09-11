import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { FileStack, Scissors, Minimize2 } from "lucide-react";
import UploadZone from "../components/upload/UploadZone";
import FileListItem from "../components/FileListItem";
import ProgressState from "../components/ProgressState";
import NeonButton from "../components/ui/NeonButton";
import api, { getErrorMessage, unwrap, uploadFile } from "../services/api";

// Each tool's shape lives here so the page itself never branches on
// "which tool is this" — it just reads config.
const TOOL_CONFIG = {
  merge: {
    icon: FileStack,
    title: "Merge PDF",
    description: "Combine two or more PDFs into one file, in the order listed below.",
    multiple: true,
    minFiles: 2,
    hint: "PDF only · minimum 2 files",
    buildRequest: (fileIds) => ({ url: "/tools/merge", body: { file_ids: fileIds } }),
  },
  split: {
    icon: Scissors,
    title: "Split PDF",
    description: "Extract specific pages into a new PDF.",
    multiple: false,
    minFiles: 1,
    hint: "PDF only · one file",
    extraField: "pages",
    extraLabel: "Page range",
    extraPlaceholder: "e.g. 1-3,5",
    buildRequest: (fileIds, extra) => ({
      url: "/tools/split",
      body: { file_id: fileIds[0], pages: extra },
    }),
  },
  compress: {
    icon: Minimize2,
    title: "Compress PDF",
    description: "Reduce file size while keeping quality readable.",
    multiple: false,
    minFiles: 1,
    hint: "PDF only · one file",
    levelField: true,
    buildRequest: (fileIds, _extra, level) => ({
      url: "/tools/compress",
      body: { file_id: fileIds[0], level },
    }),
  },
};

const LEVELS = ["low", "medium", "high"];

export default function ToolPage() {
  const { tool } = useParams();
  const config = TOOL_CONFIG[tool];

  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [extra, setExtra] = useState("");
  const [level, setLevel] = useState("medium");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  if (!config) return <Navigate to="/" replace />;

  const busy = status === "uploading" || status === "processing";
  const Icon = config.icon;

  const addFiles = (incoming) => {
    setFiles((prev) => (config.multiple ? [...prev, ...incoming] : incoming.slice(0, 1)));
    setFileIds([]);
    setStatus("idle");
    setMessage("");
    setResult(null);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileIds([]);
  };

  const reset = () => {
    setFiles([]);
    setFileIds([]);
    setExtra("");
    setStatus("idle");
    setMessage("");
    setResult(null);
  };

  const runTool = async (ids) => {
    setStatus("processing");
    setMessage(`Running ${config.title.toLowerCase()}…`);
    const { url, body } = config.buildRequest(ids, extra, level);
    const response = await api.post(url, body);
    setResult(unwrap(response));
    setStatus("success");
  };

  const handleRun = async () => {
    if (files.length < config.minFiles) {
      setStatus("error");
      setMessage(`Select at least ${config.minFiles} PDF${config.minFiles > 1 ? "s" : ""}.`);
      return;
    }
    if (config.extraField && !extra.trim()) {
      setStatus("error");
      setMessage(`${config.extraLabel} is required.`);
      return;
    }

    try {
      let ids = fileIds;
      if (ids.length !== files.length) {
        setStatus("uploading");
        setMessage(`Uploading ${files.length} file${files.length > 1 ? "s" : ""}…`);
        ids = [];
        for (const file of files) {
          try {
            ids.push(await uploadFile(file));
          } catch (err) {
            throw new Error(`${file.name}: ${getErrorMessage(err, "upload failed")}`);
          }
        }
        setFileIds(ids);
      }
      await runTool(ids);
    } catch (err) {
      setStatus("error");
      setMessage(getErrorMessage(err, "Something went wrong. Please try again."));
    }
  };

  const handleRetry = () => {
    if (fileIds.length === files.length && fileIds.length >= config.minFiles) {
      runTool(fileIds).catch((err) => {
        setStatus("error");
        setMessage(getErrorMessage(err, "Failed. Please try again."));
      });
      return;
    }
    handleRun();
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14">
      <div className="mb-8 flex items-start gap-3">
        <span className="glass flex size-10 shrink-0 items-center justify-center rounded-xl text-accent">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">{config.title}</h1>
          <p className="mt-1 text-sm text-muted">{config.description}</p>
        </div>
      </div>

      <div className="space-y-5">
        <UploadZone multiple={config.multiple} disabled={busy} onFilesSelected={addFiles} hint={config.hint} />

        {files.length > 0 ? (
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-sm font-medium text-ink">Selected</h2>
              <span className="font-mono text-xs text-muted">{files.length} file(s)</span>
            </div>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <FileListItem
                  key={`${file.name}-${index}`}
                  name={file.name}
                  size={file.size}
                  status={fileIds[index] ? "uploaded" : undefined}
                  onRemove={busy ? undefined : () => removeFile(index)}
                />
              ))}
            </ul>
          </div>
        ) : null}

        {config.extraField ? (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">{config.extraLabel}</label>
            <input
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              disabled={busy}
              placeholder={config.extraPlaceholder}
              className="glass w-full rounded-xl border border-line px-3.5 py-2.5 font-mono text-sm text-ink outline-none focus:border-accent"
            />
          </div>
        ) : null}

        {config.levelField ? (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Compression level</label>
            <div className="glass inline-flex rounded-xl border border-line p-1">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={busy}
                  onClick={() => setLevel(lvl)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    level === lvl ? "bg-accent text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <NeonButton onClick={handleRun} disabled={busy || files.length < config.minFiles}>
            {busy ? "Working…" : config.title}
          </NeonButton>
          {files.length > 0 && !busy ? (
            <NeonButton variant="ghost" onClick={reset}>
              Clear
            </NeonButton>
          ) : null}
        </div>

        <ProgressState status={status} message={message} result={result} onRetry={handleRetry} onReset={reset} />
      </div>
    </div>
  );
}
