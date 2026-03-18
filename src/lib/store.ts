import type { MenuData, MenuTranslation } from "./types";

// In-memory store for the demo. Swap to Cloudflare KV for production.
const menus = new Map<string, MenuData>();
const translations = new Map<string, MenuTranslation>();

export function saveMenu(menu: MenuData): void {
  menus.set(menu.id, menu);
}

export function getMenu(id: string): MenuData | undefined {
  return menus.get(id);
}

export function updateMenu(id: string, updates: Partial<MenuData>): MenuData | undefined {
  const menu = menus.get(id);
  if (!menu) return undefined;
  const updated = { ...menu, ...updates };
  menus.set(id, updated);
  return updated;
}

export function saveTranslation(
  menuId: string,
  lang: string,
  translation: MenuTranslation
): void {
  translations.set(`${menuId}:${lang}`, translation);
}

export function getTranslation(
  menuId: string,
  lang: string
): MenuTranslation | undefined {
  return translations.get(`${menuId}:${lang}`);
}

export function clearTranslations(menuId: string): void {
  for (const key of translations.keys()) {
    if (key.startsWith(`${menuId}:`)) {
      translations.delete(key);
    }
  }
}
