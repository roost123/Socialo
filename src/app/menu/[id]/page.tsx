"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import type { MenuData, MenuCategory } from "@/lib/types";

export default function MenuPage() {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the menu data
  useEffect(() => {
    fetch(`/api/menu/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Menu not found");
        return res.json();
      })
      .then((data: MenuData) => {
        setMenu(data);
        setCategories(data.categories);
        setSelectedLang(data.originalLanguage);
        setLoading(false);
      })
      .catch(() => {
        setError("Menu not found");
        setLoading(false);
      });
  }, [id]);

  // Load translation when language changes
  useEffect(() => {
    if (!menu || !selectedLang) return;

    // If it's the original language, use original data
    if (selectedLang === menu.originalLanguage) {
      setCategories(menu.categories);
      return;
    }

    setTranslating(true);
    fetch(`/api/menu/${id}/${selectedLang}`)
      .then((res) => {
        if (!res.ok) throw new Error("Translation failed");
        return res.json();
      })
      .then((data: { categories: MenuCategory[] }) => {
        setCategories(data.categories);
        setTranslating(false);
      })
      .catch(() => {
        setTranslating(false);
      });
  }, [selectedLang, menu, id]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-warm-gray text-sm animate-pulse">
          Loading menu...
        </div>
      </div>
    );
  }

  if (error || !menu || !categories) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-2">
            Menu not found
          </h1>
          <p className="text-warm-gray text-sm">
            This menu may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-warm-gray">
              Menu
            </span>
            <span className="text-[10px] text-warm-gray/50">
              Powered by Socialo
            </span>
          </div>

          {/* Language selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedLang === lang.code
                    ? "bg-charcoal text-cream"
                    : "bg-charcoal/[0.04] text-warm-gray hover:bg-charcoal/[0.08]"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Translation loading overlay */}
      {translating && (
        <div className="fixed inset-0 z-20 bg-cream/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-sage border-t-transparent animate-spin" />
            <span className="text-sm text-charcoal">Translating...</span>
          </div>
        </div>
      )}

      {/* Menu content */}
      <main className="max-w-lg mx-auto px-4 pt-6">
        {categories.map((category, i) => (
          <section key={i} className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sage mb-4 sticky top-[88px] bg-cream/90 backdrop-blur-sm py-2 z-[5]">
              {category.name}
            </h2>
            <div className="space-y-1">
              {category.items.map((item, j) => (
                <div
                  key={j}
                  className="py-3 border-b border-charcoal/[0.04] last:border-0"
                >
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="text-base font-medium text-charcoal leading-snug">
                      {item.name}
                    </h3>
                    {item.price && (
                      <span className="text-sm font-medium text-charcoal flex-shrink-0">
                        {item.price}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-warm-gray leading-relaxed font-light">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 bg-cream/80 backdrop-blur-xl border-t border-charcoal/5 py-3">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-center">
          <a
            href="/"
            className="text-[11px] text-warm-gray/50 hover:text-warm-gray transition-colors"
          >
            Powered by <span className="font-medium">Socialo</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
