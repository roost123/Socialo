import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import { saveMenu } from "@/lib/store";
import type { MenuCategory } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
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
              text: `Analyze this restaurant menu photo. Extract all dishes organized by category.

Return ONLY valid JSON in this exact format, no other text:
{
  "originalLanguage": "<ISO 639-1 language code>",
  "categories": [
    {
      "name": "<category name>",
      "items": [
        {
          "name": "<dish name>",
          "description": "<description or null if none>",
          "price": "<price with currency symbol or null if not visible>"
        }
      ]
    }
  ]
}

Rules:
- Keep the original language, do not translate
- Include ALL items you can read
- Use null for missing descriptions or prices
- Preserve the original category structure from the menu`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [
      null,
      text,
    ];
    const parsed = JSON.parse(jsonMatch[1]!.trim()) as {
      originalLanguage: string;
      categories: MenuCategory[];
    };

    const id = nanoid(10);
    const menu = {
      id,
      createdAt: new Date().toISOString(),
      originalLanguage: parsed.originalLanguage,
      categories: parsed.categories,
    };

    saveMenu(menu);

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Menu extraction failed:", error);
    return NextResponse.json(
      { error: "Failed to extract menu from image" },
      { status: 500 }
    );
  }
}
