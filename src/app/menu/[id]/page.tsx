"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { MagnifyingGlass, Globe, ArrowLeft } from "@phosphor-icons/react";
import { ALL_LANGUAGES } from "@/lib/types";
import type { MenuData, MenuCategory } from "@/lib/types";

// Group languages by region
const LANGUAGE_REGIONS = [
  "Europe",
  "Asia",
  "Middle East",
  "Africa",
  "Americas",
] as const;

const POPULAR_CODES = [
  "en", "de", "fr", "es", "it", "pt", "zh", "ja", "ko", "ar", "ru", "nl",
  "pl", "tr", "th", "hi", "vi", "id",
];

function getBrowserLanguage(): string | null {
  if (typeof navigator === "undefined") return null;
  const browserLang = navigator.language?.split("-")[0];
  if (!browserLang) return null;
  const match = ALL_LANGUAGES.find((l) => l.code === browserLang);
  return match ? match.code : null;
}

function getStoredLanguage(menuId: string): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(`menu-lang-${menuId}`);
  } catch {
    return null;
  }
}

function storeLanguage(menuId: string, lang: string): void {
  try {
    localStorage.setItem(`menu-lang-${menuId}`, lang);
  } catch {
    // Ignore localStorage errors
  }
}

export default function MenuPage() {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [suggestedLang, setSuggestedLang] = useState<string | null>(null);

  // Load the menu data
  useEffect(() => {
    fetch(`/api/menu/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Menu not found");
        return res.json();
      })
      .then((data: MenuData) => {
        setMenu(data);
        setLoading(false);

        // Check for stored or browser language
        const stored = getStoredLanguage(id);
        const browser = getBrowserLanguage();
        const suggestion = stored || browser;
        if (suggestion && suggestion !== data.originalLanguage) {
          setSuggestedLang(suggestion);
        }
      })
      .catch(() => {
        setError("Menu not found");
        setLoading(false);
      });
  }, [id]);

  // Filter languages by search
  const filteredLanguages = useMemo(() => {
    if (!search.trim()) return null; // show grouped view
    const q = search.toLowerCase();
    return ALL_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [search]);

  const popularLanguages = useMemo(
    () => ALL_LANGUAGES.filter((l) => POPULAR_CODES.includes(l.code)),
    []
  );

  // Load translation when language is selected
  const selectLanguage = async (langCode: string) => {
    if (!menu) return;
    setSelectedLang(langCode);
    setTranslating(true);
    setTranslationError(null);
    storeLanguage(id, langCode);

    try {
      const res = await fetch(`/api/menu/${id}/${langCode}`);
      const data = await res.json();

      setCategories(data.categories);

      // Check if API returned a fallback (translation failed, showing original)
      if (data._fallback) {
        const langInfo = ALL_LANGUAGES.find((l) => l.code === langCode);
        setTranslationError(
          `Translation to ${langInfo?.name ?? langCode} failed. Showing menu in original language.`
        );
      }
    } catch {
      // Network error — show original menu
      setCategories(menu.categories);
      const langInfo = ALL_LANGUAGES.find((l) => l.code === langCode);
      setTranslationError(
        `Could not load ${langInfo?.name ?? langCode} translation. Showing original menu.`
      );
    }
    setTranslating(false);
  };

  const retryTranslation = () => {
    if (selectedLang) selectLanguage(selectedLang);
  };

  const goBackToLanguages = () => {
    setSelectedLang(null);
    setCategories(null);
    setSearch("");
    setTranslationError(null);
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-cream">
        <div className="text-warm-gray text-sm animate-pulse">
          Loading menu...
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4 bg-cream">
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

  // ==========================================
  // LANGUAGE SELECTION SCREEN
  // ==========================================
  if (!selectedLang) {
    const suggestedLangInfo = suggestedLang
      ? ALL_LANGUAGES.find((l) => l.code === suggestedLang)
      : null;

    return (
      <div className="min-h-[100dvh] bg-cream flex flex-col">
        {/* Header */}
        <header className="px-4 pt-8 pb-4 text-center">
          {menu.branding.restaurantName && (
            <h1 className="text-xl font-bold text-charcoal mb-1">
              {menu.branding.restaurantName}
            </h1>
          )}
          {menu.branding.tagline && (
            <p className="text-xs text-warm-gray/60 mb-6">
              {menu.branding.tagline}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe size={20} weight="light" className="text-sage" />
            <h2 className="text-lg font-semibold text-charcoal">
              Choose your language
            </h2>
          </div>

          {/* Suggested language */}
          {suggestedLangInfo && (
            <button
              onClick={() => selectLanguage(suggestedLangInfo.code)}
              className="mx-auto mb-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-sage/10 ring-1 ring-sage/20 hover:ring-sage/30 transition-all active:scale-[0.98]"
            >
              <span className="text-xl">{suggestedLangInfo.flag}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-charcoal">
                  {suggestedLangInfo.native}
                </div>
                <div className="text-[10px] text-sage">
                  {getStoredLanguage(id) ? "Last used" : "Detected"}
                </div>
              </div>
            </button>
          )}

          {/* Search bar */}
          <div className="max-w-sm mx-auto relative">
            <MagnifyingGlass
              size={18}
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray/40"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search languages..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white ring-1 ring-charcoal/[0.08] text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:ring-2 focus:ring-sage/30 transition-all"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-20">
          <div className="max-w-sm mx-auto">
            {/* Search results */}
            {filteredLanguages !== null ? (
              <div className="space-y-1">
                {filteredLanguages.length === 0 ? (
                  <p className="text-center text-sm text-warm-gray/50 py-8">
                    No languages found for &ldquo;{search}&rdquo;
                  </p>
                ) : (
                  filteredLanguages.map((lang) => (
                    <LanguageButton
                      key={lang.code}
                      flag={lang.flag}
                      name={lang.name}
                      native={lang.native}
                      onClick={() => selectLanguage(lang.code)}
                    />
                  ))
                )}
              </div>
            ) : (
              <>
                {/* Popular languages */}
                <div className="mb-6">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-gray/40 mb-2 px-1">
                    Popular
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {popularLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.code)}
                        className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white ring-1 ring-charcoal/[0.06] hover:ring-charcoal/[0.12] hover:shadow-sm transition-all active:scale-[0.98] text-left"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-charcoal truncate">
                            {lang.native}
                          </div>
                          <div className="text-[10px] text-warm-gray/50 truncate">
                            {lang.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* All languages by region */}
                {LANGUAGE_REGIONS.map((region) => {
                  const langs = ALL_LANGUAGES.filter(
                    (l) => l.region === region
                  );
                  if (langs.length === 0) return null;
                  return (
                    <div key={region} className="mb-6">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-gray/40 mb-2 px-1">
                        {region}
                      </h3>
                      <div className="space-y-1">
                        {langs.map((lang) => (
                          <LanguageButton
                            key={lang.code}
                            flag={lang.flag}
                            name={lang.name}
                            native={lang.native}
                            onClick={() => selectLanguage(lang.code)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-3 border-t border-charcoal/5">
          <a
            href="/"
            className="text-[11px] text-warm-gray/40 hover:text-warm-gray transition-colors"
          >
            Powered by <span className="font-medium">Socialo</span>
          </a>
        </footer>
      </div>
    );
  }

  // ==========================================
  // MENU VIEW (after language selection)
  // ==========================================
  const selectedLangInfo = ALL_LANGUAGES.find((l) => l.code === selectedLang);

  return (
    <div className="min-h-[100dvh] bg-cream pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={goBackToLanguages}
            className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span className="text-xs">Languages</span>
          </button>
          {menu.branding.restaurantName && (
            <span className="text-sm font-semibold text-charcoal truncate mx-4">
              {menu.branding.restaurantName}
            </span>
          )}
          <button
            onClick={goBackToLanguages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal/[0.04] text-xs font-medium text-warm-gray hover:bg-charcoal/[0.08] transition-all"
          >
            <span>{selectedLangInfo?.flag}</span>
            <span>{selectedLangInfo?.native ?? selectedLang}</span>
          </button>
        </div>
      </header>

      {/* Translating skeleton — matches real menu structure */}
      {translating && (
        <div className="max-w-lg mx-auto px-4 pt-8">
          <div className="text-center mb-8">
            <div className="w-6 h-6 rounded-full border-2 border-sage border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-sm text-charcoal font-medium">
              Translating to {selectedLangInfo?.name ?? selectedLang}...
            </p>
          </div>
          {menu.categories.map((cat, i) => (
            <div key={i} className="mb-8 animate-pulse">
              <div className="h-3 bg-charcoal/[0.06] rounded mb-4" style={{ width: `${Math.min(cat.name.length * 8, 120)}px` }} />
              {cat.items.map((_, j) => (
                <div key={j} className="py-3 border-b border-charcoal/[0.04]">
                  <div className="flex justify-between">
                    <div className="h-4 bg-charcoal/[0.06] rounded w-40" />
                    <div className="h-4 bg-charcoal/[0.06] rounded w-14" />
                  </div>
                  <div className="h-3 bg-charcoal/[0.04] rounded w-64 mt-2" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Translation error banner */}
      {translationError && !translating && (
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-amber-700">
              {translationError}
            </p>
            <button
              onClick={retryTranslation}
              className="text-xs font-medium text-amber-700 underline hover:no-underline flex-shrink-0 ml-3"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Menu content */}
      {categories && !translating && (
        <main className="max-w-lg mx-auto px-4 pt-6">
          {/* Restaurant header */}
          {(menu.branding.restaurantName || menu.branding.tagline) && (
            <div className="text-center mb-8">
              {menu.branding.restaurantName && (
                <h1 className="text-2xl font-bold tracking-[-0.02em] text-charcoal">
                  {menu.branding.restaurantName}
                </h1>
              )}
              {menu.branding.tagline && (
                <p className="text-sm text-warm-gray/60 mt-1">
                  {menu.branding.tagline}
                </p>
              )}
              <div className="w-12 h-px bg-charcoal/10 mx-auto mt-4" />
            </div>
          )}

          {categories.map((category, i) => (
            <section key={i} className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sage mb-4 sticky top-[52px] bg-cream/90 backdrop-blur-sm py-2 z-[5]">
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
                        <span className="text-sm font-semibold text-charcoal flex-shrink-0">
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
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 bg-cream/80 backdrop-blur-xl border-t border-charcoal/5 py-3">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-center">
          <a
            href="/"
            className="text-[11px] text-warm-gray/40 hover:text-warm-gray transition-colors"
          >
            Powered by <span className="font-medium">Socialo</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

function LanguageButton({
  flag,
  name,
  native,
  onClick,
}: {
  flag: string;
  name: string;
  native: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/80 transition-all active:scale-[0.98] text-left"
    >
      <span className="text-lg flex-shrink-0">{flag}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-charcoal">{native}</span>
        <span className="text-xs text-warm-gray/50 ml-2">{name}</span>
      </div>
    </button>
  );
}
