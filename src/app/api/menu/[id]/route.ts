import { NextRequest, NextResponse } from "next/server";
import { getMenu } from "@/lib/store";
import { DEMO_MENUS } from "@/lib/demo-menus";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check demo menus first, then the store
  const menu =
    DEMO_MENUS.find((m) => m.id === id) ?? getMenu(id);

  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  return NextResponse.json(menu);
}
