import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveMenu } from "@/lib/store";

export async function POST(request: NextRequest) {
  let restaurantName = "My Restaurant";

  try {
    const body = await request.json();
    if (body.restaurantName && typeof body.restaurantName === "string") {
      restaurantName = body.restaurantName.trim();
    }
  } catch {
    // No body or invalid JSON — that's fine, use defaults
  }

  const id = nanoid(10);
  const menu = {
    id,
    createdAt: new Date().toISOString(),
    originalLanguage: "en",
    branding: {
      restaurantName,
      logoUrl: null,
      tagline: null,
    },
    categories: [
      {
        name: "Starters",
        items: [
          { name: "", description: null, price: null, imageUrl: null },
        ],
      },
      {
        name: "Mains",
        items: [
          { name: "", description: null, price: null, imageUrl: null },
        ],
      },
    ],
  };

  saveMenu(menu);
  return NextResponse.json(menu);
}
