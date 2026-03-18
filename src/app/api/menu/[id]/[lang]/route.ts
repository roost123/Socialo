import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getMenu } from "@/lib/store";
import { getTranslation, saveTranslation } from "@/lib/store";
import { DEMO_MENUS } from "@/lib/demo-menus";
import { ALL_LANGUAGES } from "@/lib/types";
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

  // Find the language name — check our list first, then use the code itself
  const langInfo = ALL_LANGUAGES.find((l) => l.code === lang);
  const langName = langInfo ? `${langInfo.name} (${langInfo.native})` : lang;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a professional restaurant menu translator. Translate this menu into ${langName}.

Menu data (JSON):
${JSON.stringify(menu.categories, null, 2)}

Return ONLY valid JSON in this exact format — no markdown, no explanation, no code block:
{"categories":[{"name":"<translated category>","items":[{"name":"<translated dish name>","description":"<translated description or null>","price":"<UNCHANGED original price>","imageUrl":null}]}]}

Critical rules:
- Translate ALL text naturally — not word-by-word, but how a native speaker would write a menu
- NEVER change prices — copy them exactly as they are
- NEVER change imageUrl values — keep them as-is
- Keep null values as null
- Maintain exact same structure and order
- Use the appropriate script/characters for the target language`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Try to extract JSON — handle various response formats
    let jsonStr = text.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1]!.trim();
    }

    const translation = JSON.parse(jsonStr) as MenuTranslation;

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
