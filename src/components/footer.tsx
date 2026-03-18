export function Footer() {
  return (
    <footer className="px-4 py-12 border-t border-charcoal/[0.05]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-medium text-charcoal tracking-tight">
          Socialo
        </span>
        <span className="text-xs text-warm-gray/50">
          &copy; {new Date().getFullYear()} Socialo. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
