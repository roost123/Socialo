import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const anthropic = new Anthropic();
const resend = new Resend(process.env.RESEND_API_KEY || "dummy");

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ContactInfo {
  name: string;
  email: string;
}

type ConversationStatus = "complete" | "incomplete" | "escalate";

function formatTranscript(messages: ChatMessage[]): string {
  return messages
    .map((m) => {
      const label = m.role === "user" ? "Bezoeker" : "Socialo";
      return `${label}: ${m.content}`;
    })
    .join("\n\n");
}

async function generateSummary(
  messages: ChatMessage[],
  contactInfo?: ContactInfo
): Promise<string> {
  const transcript = formatTranscript(messages);
  const contactContext = contactInfo
    ? `\n\nBekende contactgegevens:\n- Naam: ${contactInfo.name}\n- E-mail: ${contactInfo.email}`
    : "";

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: `Je krijgt een transcript van een intake-gesprek op de Socialo website. Maak een beknopte samenvatting in het volgende format:

NAAM: [naam]
E-MAIL: [e-mailadres]
BEDRIJF: [bedrijfsnaam of "Onbekend"]
SECTOR: [sector/branche of "Onbekend"]
OMVANG: [aantal medewerkers of "Onbekend"]
PROBLEEM: [korte beschrijving van hun probleem/uitdaging]
BEHOEFTE: [wat ze zoeken/hopen te bereiken]
EXTRA: [overige relevante informatie]

Wees beknopt. Schrijf "Onbekend" als iets niet besproken is.`,
    messages: [
      {
        role: "user",
        content: transcript + contactContext,
      },
    ],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "Samenvatting niet beschikbaar.";
}

function buildEmailHtml(
  summary: string,
  transcript: string,
  status: ConversationStatus,
  contactInfo?: ContactInfo
): string {
  const statusLabel =
    status === "complete"
      ? "Afgerond gesprek"
      : status === "escalate"
        ? "Persoonlijk contact gewenst"
        : "Onvolledig gesprek";

  const statusColor =
    status === "complete"
      ? "#065F46"
      : status === "escalate"
        ? "#92400E"
        : "#737373";

  const contactBlock = contactInfo
    ? `
    <div style="padding: 24px 28px; border-bottom: 1px solid #E5E5E5;">
      <h2 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #737373;">
        Contactgegevens
      </h2>
      <table style="font-size: 14px; line-height: 1.7;">
        <tr><td style="color: #737373; padding-right: 16px;">Naam</td><td style="font-weight: 500;">${contactInfo.name}</td></tr>
        <tr><td style="color: #737373; padding-right: 16px;">E-mail</td><td><a href="mailto:${contactInfo.email}" style="color: #4B749F; text-decoration: none;">${contactInfo.email}</a></td></tr>
      </table>
    </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1A1A; background: #FAFAFA;">
  <div style="background: white; border-radius: 12px; border: 1px solid #E5E5E5; overflow: hidden;">
    <div style="padding: 24px 28px; border-bottom: 1px solid #E5E5E5;">
      <div style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: ${statusColor}; background: ${statusColor}15; margin-bottom: 12px;">
        ${statusLabel}
      </div>
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">
        Nieuw intake-gesprek${contactInfo ? ` — ${contactInfo.name}` : ""}
      </h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #737373;">
        ${new Date().toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" })}
      </p>
    </div>
    ${contactBlock}

    <div style="padding: 24px 28px; border-bottom: 1px solid #E5E5E5;">
      <h2 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #737373;">
        Samenvatting
      </h2>
      <pre style="margin: 0; font-family: inherit; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${summary}</pre>
    </div>

    <div style="padding: 24px 28px;">
      <h2 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #737373;">
        Volledig transcript
      </h2>
      <pre style="margin: 0; font-family: inherit; font-size: 13px; line-height: 1.6; white-space: pre-wrap; color: #404040;">${transcript}</pre>
    </div>
  </div>

  <p style="text-align: center; font-size: 11px; color: #A3A3A3; margin-top: 16px;">
    Verzonden via Socialo intake-chatbot
  </p>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, status, contactInfo } = (await request.json()) as {
      messages: ChatMessage[];
      status: ConversationStatus;
      contactInfo?: ContactInfo;
    };

    // Allow sending even without messages if we have contact info
    if ((!messages || messages.length === 0) && !contactInfo) {
      return NextResponse.json(
        { error: "Geen berichten ontvangen." },
        { status: 400 }
      );
    }

    const transcript =
      messages && messages.length > 0
        ? formatTranscript(messages)
        : "Geen chatgesprek gevoerd.";

    // Generate AI summary (skip for very short conversations)
    let summary: string;
    if (messages && messages.filter((m) => m.role === "user").length >= 2) {
      summary = await generateSummary(messages, contactInfo);
    } else if (contactInfo) {
      summary = `NAAM: ${contactInfo.name}\nE-MAIL: ${contactInfo.email}\n\nTe weinig chatinformatie voor een uitgebreide samenvatting.`;
    } else {
      summary = "Te weinig informatie voor een samenvatting.";
    }

    // Build subject line
    const name = contactInfo?.name;
    const companyMatch = summary.match(/BEDRIJF:\s*(.+)/);
    const company = companyMatch?.[1]?.trim();

    let subject: string;
    if (status === "escalate") {
      subject = `Persoonlijk contact gewenst${name ? ` — ${name}` : ""}`;
    } else if (status === "complete" && name) {
      subject = `Nieuw intake-gesprek: ${name}${company && company !== "Onbekend" ? ` — ${company}` : ""}`;
    } else {
      subject = `Onvolledig gesprek${name ? ` — ${name}` : ""} — ${new Date().toLocaleDateString("nl-NL")}`;
    }

    const html = buildEmailHtml(summary, transcript, status, contactInfo);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Socialo Intake <onboarding@resend.dev>",
      to: "nrterence@gmail.com",
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Intake send failed:", error);
    return NextResponse.json(
      { error: "Email verzenden mislukt." },
      { status: 500 }
    );
  }
}
