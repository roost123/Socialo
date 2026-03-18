import { NextRequest, NextResponse } from "next/server";
import { getMenu, saveMenu, updateMenu, clearTranslations } from "@/lib/store";
import { DEMO_MENUS } from "@/lib/demo-menus";
import { nanoid } from "nanoid";
import type { MenuData } from "@/lib/types";

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
  const body = (await request.json()) as Partial<MenuData>;

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
    saveMenu(newMenu);
    return NextResponse.json(newMenu);
  }

  // Clear cached translations when menu is edited
  clearTranslations(id);

  const updated = updateMenu(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// Create a new menu from scratch (manual entry)
export async function POST(
  request: NextRequest,
) {
  const body = (await request.json()) as Omit<MenuData, "id" | "createdAt">;

  const id = nanoid(10);
  const menu: MenuData = {
    ...body,
    id,
    createdAt: new Date().toISOString(),
  };

  saveMenu(menu);
  return NextResponse.json(menu);
}
