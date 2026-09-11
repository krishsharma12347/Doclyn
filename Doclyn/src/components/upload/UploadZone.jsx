import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadZone({ multiple = false, disabled = false, onFilesSelected, hint }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type === "application/pdf");
    if (files.length > 0) onFilesSelected(files);
  };

  return (
    <div
      className={`dropzone glass flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line px-6 py-12 text-center ${
        dragOver ? "drag-over" : ""
      } ${disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <UploadCloud className="size-6" strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-sm font-medium text-ink">
        Drag & drop {multiple ? "PDFs" : "a PDF"} here, or click to browse
      </p>
      <p className="mt-1 text-xs text-muted">{hint || "PDF files only"}</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
