"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "nl", flag: "🇳🇱", label: "NL" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "de", flag: "🇩🇪", label: "DE" },
  { code: "ja", flag: "🇯🇵", label: "JA" },
  { code: "ar", flag: "🇸🇦", label: "AR" },
];

type LangCode = (typeof LANGUAGES)[number]["code"];

interface MenuItemData {
  name: Record<LangCode, string>;
  desc: Record<LangCode, string>;
  price: string;
}

const MENU_ITEMS: { category: Record<LangCode, string>; items: MenuItemData[] }[] = [
  {
    category: { nl: "Voorgerechten", en: "Starters", de: "Vorspeisen", ja: "前菜", ar: "المقبلات" },
    items: [
      {
        name: { nl: "Hollandse garnalencocktail", en: "Dutch shrimp cocktail", de: "Holländischer Garnelencocktail", ja: "オランダ風エビカクテル", ar: "كوكتيل الجمبري الهولندي" },
        desc: { nl: "Noordzeegarnalen met huisgemaakte cocktailsaus", en: "North Sea shrimp with homemade cocktail sauce", de: "Nordseegarnelen mit hauseigener Cocktailsauce", ja: "北海エビと自家製カクテルソース", ar: "جمبري بحر الشمال مع صلصة كوكتيل منزلية" },
        price: "€11.50",
      },
      {
        name: { nl: "Erwtensoep", en: "Pea soup", de: "Erbsensuppe", ja: "えんどう豆のスープ", ar: "شوربة البازلاء" },
        desc: { nl: "Traditionele erwtensoep met rookworst", en: "Traditional pea soup with smoked sausage", de: "Traditionelle Erbsensuppe mit Räucherwurst", ja: "燻製ソーセージ入り伝統的エンドウ豆スープ", ar: "شوربة البازلاء التقليدية مع النقانق المدخنة" },
        price: "€8.00",
      },
    ],
  },
  {
    category: { nl: "Hoofdgerechten", en: "Mains", de: "Hauptgerichte", ja: "メインディッシュ", ar: "الأطباق الرئيسية" },
    items: [
      {
        name: { nl: "Stamppot boerenkool", en: "Kale mash", de: "Grünkohlstampf", ja: "ケールのマッシュ", ar: "هريس الكرنب" },
        desc: { nl: "Met rookworst, jus en spekjes", en: "With smoked sausage, gravy and bacon bits", de: "Mit Räucherwurst, Soße und Speckwürfeln", ja: "燻製ソーセージ、グレービー、ベーコン添え", ar: "مع النقانق المدخنة والمرق ولحم مقدد" },
        price: "€16.50",
      },
      {
        name: { nl: "Zeetong meunière", en: "Sole meunière", de: "Seezunge Meunière", ja: "舌平目のムニエル", ar: "سمك موسى مونيير" },
        desc: { nl: "Gebakken zeetong met botersaus", en: "Pan-fried sole with butter sauce", de: "Gebratene Seezunge mit Buttersauce", ja: "バターソースのパンフライ舌平目", ar: "سمك موسى مقلي مع صلصة الزبدة" },
        price: "€28.00",
      },
    ],
  },
];

export function MenuShowcase() {
  const [activeLang, setActiveLang] = useState<LangCode>("nl");

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="rounded-[1.5rem] bg-charcoal/[0.06] ring-1 ring-charcoal/[0.08] p-1">
        <div className="rounded-[calc(1.5rem-0.25rem)] bg-cream overflow-hidden">
          {/* Mini header */}
          <div className="bg-white/80 backdrop-blur-sm px-4 py-3 border-b border-charcoal/5">
            <p className="text-xs font-semibold text-charcoal text-center">Brasserie Van Gogh</p>
            <p className="text-[10px] text-warm-gray/50 text-center">Eerlijk eten aan de gracht</p>
          </div>

          {/* Language tabs */}
          <div className="flex gap-1 px-3 py-2.5 bg-white/40">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLang(lang.code)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 ${
                  activeLang === lang.code
                    ? "bg-charcoal text-cream"
                    : "bg-charcoal/[0.04] text-warm-gray hover:bg-charcoal/[0.08]"
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>

          {/* Menu content */}
          <div className="px-4 py-3 space-y-4 max-h-[320px] overflow-y-auto scrollbar-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLang}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {MENU_ITEMS.map((section, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sage mb-2">
                      {section.category[activeLang]}
                    </h3>
                    {section.items.map((item, j) => (
                      <div key={j} className="py-2 border-b border-charcoal/[0.04] last:border-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-sm font-medium text-charcoal leading-snug">
                            {item.name[activeLang]}
                          </span>
                          <span className="text-xs font-semibold text-charcoal flex-shrink-0">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-warm-gray/60 mt-0.5 leading-relaxed">
                          {item.desc[activeLang]}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-charcoal/5 bg-white/40">
            <p className="text-[9px] text-warm-gray/30 text-center">
              Powered by Socialo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
