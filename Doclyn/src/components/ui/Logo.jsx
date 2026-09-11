import { FileStack } from "lucide-react";

export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2">
        <FileStack className="size-[18px] text-white" strokeWidth={2} />
      </span>
      <span className="text-lg font-bold tracking-tight text-ink">Doclyn</span>
    </div>
  );
}
