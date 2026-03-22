"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors duration-200 hover:bg-[var(--bg-surface-secondary)]"
        aria-label="Kies taal"
      >
        {locale.toUpperCase()}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 py-2 min-w-[160px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg z-50">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 hover:bg-[var(--bg-surface-secondary)] ${
                l === locale
                  ? "font-medium text-[var(--text-heading)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              <span className="uppercase text-xs tracking-wider opacity-50 mr-2">
                {l}
              </span>
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
