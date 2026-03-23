import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildIntakeSystemPrompt } from "@/lib/intake-prompt";

const anthropic = new Anthropic();

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// In-memory rate limiter: max 50 requests per IP per 2 hours
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Lazy cleanup: remove expired entries when map gets large
  if (rateLimitMap.size > 100) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 2 * 60 * 60 * 1000 });
    return true;
  }

  if (entry.count >= 50) return false;
  entry.count++;
  return true;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const allowed = process.env.ALLOWED_ORIGIN || "https://socialo.nl";
  if (!origin) return true; // same-origin requests may not send Origin
  return origin === allowed || origin === "http://localhost:3000";
}

function parseStatusFromResponse(text: string): {
  message: string;
  status: "ongoing" | "complete" | "escalate";
} {
  const statusMatch = text.match(/\|\|\|STATUS:(ongoing|complete|escalate)\|\|\|/);
  const status = (statusMatch?.[1] ?? "ongoing") as "ongoing" | "complete" | "escalate";
  const message = text.replace(/\n?\|\|\|STATUS:\w+\|\|\|/, "").trim();
  return { message, status };
}

export async function POST(request: NextRequest) {
  try {
    if (!checkOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getClientIp(request);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Te veel berichten. Probeer het later opnieuw." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages, contactInfo } = body as {
      messages: ChatMessage[];
      contactInfo?: { name: string; email: string };
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Geen berichten ontvangen." },
        { status: 400 }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: "Te veel berichten." },
        { status: 400 }
      );
    }

    // Validate and sanitize each message
    const validRoles = new Set(["user", "assistant"]);
    const sanitizedMessages = messages.map((m) => ({
      role: validRoles.has(m.role) ? m.role : ("user" as const),
      content: typeof m.content === "string" ? m.content.slice(0, MAX_MESSAGE_LENGTH) : "",
    }));

    // Sanitize contact info
    const sanitizedContact = contactInfo
      ? {
          name: typeof contactInfo.name === "string" ? contactInfo.name.slice(0, MAX_NAME_LENGTH) : "",
          email: typeof contactInfo.email === "string" ? contactInfo.email.slice(0, MAX_EMAIL_LENGTH) : "",
        }
      : undefined;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      system: buildIntakeSystemPrompt(sanitizedContact?.name, sanitizedContact?.email),
      messages: sanitizedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const { message, status } = parseStatusFromResponse(rawText);

    return NextResponse.json({ message, status });
  } catch (error) {
    console.error("Intake chat failed:", error);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
