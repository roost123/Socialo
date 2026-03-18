import { NextRequest, NextResponse } from "next/server";
import { getMenu, saveMenu, updateMenu, clearTranslations } from "@/lib/store";
import { DEMO_MENUS } from "@/lib/demo-menus";
import { nanoid } from "nanoid";
import type { MenuData } from "@/lib/types";
import { validateMenuData } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const menu = DEMO_MENUS.find((m) => m.id === id) ?? getMenu(id);

  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  return NextResponse.json(menu);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Partial<MenuData>;
  try {
    body = (await request.json()) as Partial<MenuData>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // For demo menus, create a copy with a new ID
  const demoMenu = DEMO_MENUS.find((m) => m.id === id);
  if (demoMenu) {
    const newId = nanoid(10);
    const newMenu: MenuData = {
      ...demoMenu,
      ...body,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    const errors = validateMenuData(newMenu);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0], details: errors }, { status: 400 });
    }

    saveMenu(newMenu);
    return NextResponse.json(newMenu);
  }

  // Build the updated menu to validate before saving
  const existing = getMenu(id);
  if (!existing) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  const merged: MenuData = { ...existing, ...body, id }; // Never allow ID change
  const errors = validateMenuData(merged);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0], details: errors }, { status: 400 });
  }

  // Clear cached translations when menu is edited
  clearTranslations(id);

  const updated = updateMenu(id, body);
  return NextResponse.json(updated);
}
