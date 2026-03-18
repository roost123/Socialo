# SOCIALO

> "Dat moet toch automatisch kunnen!"

## Missie

Socialo bouwt digitale medewerkers voor het MKB. Geen AI-jargon, geen complexe tooling — gewoon oplossingen voor echte problemen. Wij zijn het antwoord op: "Ik kan geen tweede administratief medewerker vinden", "Ik mis telefoontjes op mijn drukste dag", en "Ik besteed 3 uur per dag aan facturen overtikken."

## Wat we doen

Socialo is een AI-automatiseringsbedrijf dat digitale medewerkers levert aan MKB-bedrijven. We automatiseren taken die nu te veel tijd, geld of personeel kosten.

### Voorbeelden van digitale medewerkers

| Rol | Probleem dat we oplossen |
|-----|-------------------------|
| **Receptionist** | Gemiste telefoontjes, trage reacties op e-mail/chat |
| **Boekhouder** | Uren kwijt aan facturen overtikken en administratie |
| **Marketeer** | Geen tijd/kennis voor social media en campagnes |
| **Planner** | Handmatig roosters maken, afspraken inplannen |
| **Klantenservice** | Terugkerende vragen steeds opnieuw beantwoorden |

### Twee sporen

1. **Volledige digitale medewerkers** — Autonome agents die een complete rol vervullen (bijv. AI-receptionist die belt, mailt en agendapunten maakt)
2. **Workflow-tools voor bestaande medewerkers** — Stappen binnen het werk automatiseren (bijv. factuurherkenning, automatische planning)

## Doelgroep

- **Wie:** MKB-bedrijven met 5–50 medewerkers
- **Waar:** West-Europa, Dubai, welvarende regio's
- **Pijn:** Te weinig personeel, te veel handmatig werk, geen budget voor volledige FTE's
- **Koopgedrag:** Denken niet in "AI" of "chatbots" — denken in problemen en oplossingen

## Kernpositionering

- We verkopen geen AI, we lossen problemen op
- De klant hoeft niet te weten hoe het werkt, alleen dát het werkt
- Prijs per "medewerker" of per opgelost probleem, niet per API-call of token

## Technische principes

- **Pragmatisch boven perfect** — Werkende oplossing > mooie architectuur
- **Modulair** — Elke digitale medewerker is een zelfstandige module
- **Integratie-first** — Moet werken met wat de klant al gebruikt (Google Workspace, Exact, Mollie, WhatsApp, telefonie)
- **Taal:** Nederlands en Engels als primaire talen
- **Security & privacy:** GDPR-compliant, data in EU

## Tech Stack (startrichting)

- **Frontend:** Next.js (dashboard voor klanten)
- **Backend:** Node.js / Python (afhankelijk van use case)
- **AI:** Claude API (Anthropic) als primaire LLM
- **Orchestratie:** Agent-based architectuur per digitale medewerker
- **Integraties:** REST/webhooks naar bestaande tools
- **Infra:** Vercel / AWS EU (Frankfurt)
- **Database:** PostgreSQL (Supabase of Neon)

## Projectstructuur (gepland)

```
Socialo/
├── CLAUDE.md              # Dit bestand
├── apps/
│   ├── web/               # Next.js klantdashboard
│   └── api/               # Backend API
├── packages/
│   ├── agents/            # Digitale medewerkers (modulair)
│   │   ├── receptionist/
│   │   ├── bookkeeper/
│   │   ├── marketer/
│   │   └── planner/
│   ├── integrations/      # Koppelingen met externe tools
│   └── shared/            # Gedeelde types, utils, config
├── docs/                  # Documentatie, business plans
└── infra/                 # IaC, deployment config
```

## Businessmodel

- **SaaS-abonnement** per digitale medewerker per maand
- Pricing op basis van waarde, niet op basis van kosten
- Instapniveau laag (bijv. 1 agent, beperkt volume)
- Upsell naar meer agents of hogere volumes

## Prioriteiten (MVP)

1. **Kies 1 digitale medewerker** als eerste product (bijv. AI-receptionist of AI-boekhouder)
2. **Bouw een werkend prototype** dat 1 concreet probleem oplost
3. **Landingspagina** die het probleem verkoopt (niet de technologie)
4. **5 pilot-klanten** vinden voor validatie

## Development richtlijnen

- Schrijf code in het Engels, documentatie mag Nederlands of Engels
- Commit messages in het Engels
- Gebruik TypeScript waar mogelijk
- Test kritieke flows (agent-logica, integraties)
- Keep it simple — geen over-engineering in de MVP-fase
