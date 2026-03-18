import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { MenuData, MenuTranslation } from "./types";

// File-based JSON storage. Persists across restarts, no database needed.
const DATA_DIR = join(process.cwd(), "data");
const MENUS_FILE = join(DATA_DIR, "menus.json");
const TRANSLATIONS_FILE = join(DATA_DIR, "translations.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(path: string, fallback: T): T {
  try {
    if (!existsSync(path)) return fallback;
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(path: string, data: unknown): void {
  ensureDataDir();
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

// --- Menus ---

function loadMenus(): Record<string, MenuData> {
  return readJSON<Record<string, MenuData>>(MENUS_FILE, {});
}

function persistMenus(menus: Record<string, MenuData>): void {
  writeJSON(MENUS_FILE, menus);
}

export function saveMenu(menu: MenuData): void {
  const menus = loadMenus();
  menus[menu.id] = menu;
  persistMenus(menus);
}

export function getMenu(id: string): MenuData | undefined {
  const menus = loadMenus();
  return menus[id];
}

export function updateMenu(id: string, updates: Partial<MenuData>): MenuData | undefined {
  const menus = loadMenus();
  const menu = menus[id];
  if (!menu) return undefined;
  const updated = { ...menu, ...updates };
  menus[id] = updated;
  persistMenus(menus);
  return updated;
}

// --- Translations ---

function loadTranslations(): Record<string, MenuTranslation> {
  return readJSON<Record<string, MenuTranslation>>(TRANSLATIONS_FILE, {});
}

function persistTranslations(translations: Record<string, MenuTranslation>): void {
  writeJSON(TRANSLATIONS_FILE, translations);
}

export function saveTranslation(
  menuId: string,
  lang: string,
  translation: MenuTranslation
): void {
  const translations = loadTranslations();
  translations[`${menuId}:${lang}`] = translation;
  persistTranslations(translations);
}

export function getTranslation(
  menuId: string,
  lang: string
): MenuTranslation | undefined {
  const translations = loadTranslations();
  return translations[`${menuId}:${lang}`];
}

export function clearTranslations(menuId: string): void {
  const translations = loadTranslations();
  let changed = false;
  for (const key of Object.keys(translations)) {
    if (key.startsWith(`${menuId}:`)) {
      delete translations[key];
      changed = true;
    }
  }
  if (changed) persistTranslations(translations);
}
