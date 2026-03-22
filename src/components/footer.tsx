"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const footerLinks = [
    { label: t("whatWeDo"), href: "#wat-we-doen" },
    { label: t("howItWorks"), href: "#hoe-het-werkt" },
    { label: t("contact"), href: "#contact" },
  ];
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-6 border-t border-[var(--border-color)]">
      <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <a
          href="#"
          onClick={(e) => handleClick(e, "#")}
          className="text-[13px] font-bold tracking-[3px] uppercase text-[var(--text-heading)] hover:opacity-70 transition-opacity duration-300"
        >
          S O C I A L O
        </a>

        <div className="flex items-center gap-2 sm:gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-small text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors duration-300 py-3 px-1.5"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-small text-[var(--text-muted)]">
          {tFooter("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
