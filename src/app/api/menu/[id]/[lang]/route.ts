import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getMenu } from "@/lib/store";
import { getTranslation, saveTranslation } from "@/lib/store";
import { DEMO_MENUS } from "@/lib/demo-menus";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import type { MenuTranslation } from "@/lib/types";

const anthropic = new Anthropic();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; lang: string }> }
) {
  const { id, lang } = await params;

  const menu = DEMO_MENUS.find((m) => m.id === id) ?? getMenu(id);

  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  // If requesting the original language, return the original data
  if (lang === menu.originalLanguage) {
    return NextResponse.json({ categories: menu.categories });
  }

  // Check cache
  const cached = getTranslation(id, lang);
  if (cached) {
    return NextResponse.json(cached);
  }

  // Find the language name for the prompt
  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  const langName = langInfo?.name ?? lang;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Translate this restaurant menu to ${langName} (${lang}).

Here is the menu data in JSON:
${JSON.stringify(menu.categories, null, 2)}

Return ONLY valid JSON in this exact format, no other text:
{
  "categories": [
    {
      "name": "<translated category name>",
      "items": [
        {
          "name": "<translated dish name>",
          "description": "<translated description or null>",
          "price": "<KEEP ORIGINAL price, do not change>"
        }
      ]
    }
  ]
}

Rules:
- Translate dish names and descriptions naturally (not too literal)
- Keep the tone appropriate for a restaurant menu
- NEVER change prices — keep them exactly as they are
- Keep null values as null
- Maintain the same structure and order`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [
      null,
      text,
    ];
    const translation = JSON.parse(jsonMatch[1]!.trim()) as MenuTranslation;

    // Cache the translation
    saveTranslation(id, lang, translation);

    return NextResponse.json(translation);
  } catch (error) {
    console.error("Translation failed:", error);
    return NextResponse.json(
      { error: "Failed to translate menu" },
      { status: 500 }
    );
  }
}
