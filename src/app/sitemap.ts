import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";

const BASE_URL = "https://socialo.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage per locale
  for (const locale of locales) {
    const path = locale === defaultLocale ? "" : `/${locale}`;
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === defaultLocale ? 1.0 : 0.8,
    });
  }

  return entries;
}
