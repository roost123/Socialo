import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveMenu } from "@/lib/store";

export async function POST() {
  const id = nanoid(10);
  const menu = {
    id,
    createdAt: new Date().toISOString(),
    originalLanguage: "en",
    branding: {
      restaurantName: "My Restaurant",
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
