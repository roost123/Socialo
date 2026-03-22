"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-label tracking-[3px] mb-12 opacity-50">
        S O C I A L O
      </p>
      <h1 className="text-h1 text-[var(--text-heading)] mb-4">
        Er ging iets mis
      </h1>
      <p className="text-body text-[var(--text-secondary)] mb-8 max-w-[400px]">
        Er is een onverwachte fout opgetreden. Probeer de pagina opnieuw te
        laden.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-medium text-[15px] rounded-[10px] transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        Probeer opnieuw
      </button>
    </div>
  );
}
