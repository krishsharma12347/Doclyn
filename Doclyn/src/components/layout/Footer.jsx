export default function Footer() {
  return (
    <footer className="mt-24 px-4 pb-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} Doclyn. All rights reserved.</span>
        <span>Built for fast, private document processing.</span>
      </div>
    </footer>
  );
}
