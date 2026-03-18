import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import { saveMenu } from "@/lib/store";
import type { MenuCategory } from "@/lib/types";

const anthropic = new Anthropic();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Use JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `Analyze this restaurant menu photo. Extract ALL dishes organized by category.

Return ONLY valid JSON in this exact format, no other text:
{
  "restaurantName": "<restaurant name if visible, or 'My Restaurant'>",
  "originalLanguage": "<ISO 639-1 language code of the menu>",
  "categories": [
    {
      "name": "<category name in original language>",
      "items": [
        {
          "name": "<dish name exactly as written>",
          "description": "<description or null if none visible>",
          "price": "<price with currency symbol, or null if not visible>",
          "imageUrl": null
        }
      ]
    }
  ]
}

Rules:
- Keep EVERYTHING in the original language, do NOT translate anything
- Extract ALL items you can read, do not skip any
- Use null for missing descriptions or prices
- Preserve the exact category structure from the menu
- If no categories are visible, group items logically
- Include appetizers, mains, desserts, drinks — everything`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    const parsed = JSON.parse(jsonMatch[1]!.trim()) as {
      restaurantName: string;
      originalLanguage: string;
      categories: MenuCategory[];
    };

    if (!parsed.categories || parsed.categories.length === 0) {
      return NextResponse.json(
        { error: "Could not read the menu. Try a clearer photo with good lighting." },
        { status: 422 }
      );
    }

    const id = nanoid(10);
    const menu = {
      id,
      createdAt: new Date().toISOString(),
      originalLanguage: parsed.originalLanguage || "en",
      branding: {
        restaurantName: parsed.restaurantName || "My Restaurant",
        logoUrl: null,
        tagline: null,
      },
      categories: parsed.categories,
    };

    saveMenu(menu);

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Menu extraction failed:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Could not read the menu. Try a clearer photo with better lighting." },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong extracting the menu. Please try again." },
      { status: 500 }
    );
  }
}
