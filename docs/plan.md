# Socialo — Masterplan

Laatste update: 2026-03-18

---

## Status overzicht (eerlijk)

| Onderdeel | Status | Wat mist |
|---|---|---|
| Landingspagina | ✅ Goed | Video content, screen recordings van demo's |
| Demo 1: Menu Vertaler | 🟡 UI klaar | Niet getest met echte API. Heeft ANTHROPIC_API_KEY nodig om te werken. |
| Demo 2: Rooster | 🟡 UI klaar | Niet getest met echte API. Schedule generatie ongetest. |
| Demo 3: WhatsApp Concierge | 🟡 UI klaar | Niet getest met echte API. Chat flow ongetest. |

**Kernprobleem:** Alle 3 demo's zijn afhankelijk van de Claude API (`ANTHROPIC_API_KEY`). Zonder die key werkt de vertaling, rooster-generatie, en concierge-chat niet.

---

## WAT ER KLAAR IS

### Landingspagina
- [x] Hero met animated gradient orbs en scroll indicator
- [x] Problem sectie met 3 cards
- [x] What is Socialo uitleg
- [x] Examples met "Try the demo" knoppen op alle 3
- [x] Stats sectie met animated counters
- [x] Why Socialo (keten-visualisatie vs losse tools)
- [x] FAQ sectie met 6 vragen
- [x] CTA sectie
- [x] Navbar met alle secties
- [x] Footer

### Demo 1: Menu Vertaler
- [x] Upload pagina (foto of handmatig)
- [x] AI extractie API route
- [x] Bewerkbaar formulier (restaurantnaam, tagline, categorieën, gerechten)
- [x] QR code generatie + download
- [x] Taalkeuze pagina met 80+ talen, zoek, vlaggen
- [x] Vertaald menu weergave
- [x] Vertaal API route met caching
- [x] Demo menu's (Italiaans + Nederlands)
- [x] Manual entry route (leeg menu aanmaken)

### Demo 2: Rooster
- [x] Setup pagina (medewerkers + bezettingseisen)
- [x] Beschikbaarheid pagina (mobiel weekgrid)
- [x] Rooster generatie API (Claude + validatie)
- [x] Validatie engine (Arbeidstijdenwet, Horeca CAO)
- [x] Weekrooster weergave (grid met shift blocks)
- [x] Uren tracking per medewerker
- [x] Issues/warnings weergave
- [x] Demo restaurant met 10 medewerkers

### Demo 3: WhatsApp Concierge
- [x] WhatsApp-style chat UI
- [x] Hotel data (kamers, faciliteiten, roomservice, omgeving)
- [x] Chat API route met hotel system prompt
- [x] Typing indicator
- [x] Suggestion chips
- [x] Welcome message

---

## WAT ER NOG MOET GEBEUREN

### Prioriteit 1: Demo's werkend krijgen
- [ ] `ANTHROPIC_API_KEY` instellen als environment variable
- [ ] Demo 1 end-to-end testen: upload foto → AI extractie → edit → vertaling
- [ ] Demo 2 end-to-end testen: beschikbaarheid → generatie → validatie
- [ ] Demo 3 end-to-end testen: chat → antwoorden → roomservice bestellen

### Prioriteit 2: Demo's verbeteren
- [ ] Demo 1: Loading skeletons tijdens vertaling
- [ ] Demo 1: Error states met retry knoppen
- [ ] Demo 2: Skeleton loader voor rooster generatie
- [ ] Demo 2: Drag & drop shifts (dnd-kit)
- [ ] Demo 3: Contextual suggestion chips na elk antwoord
- [ ] Demo 3: Inline rich content (kamer info cards, etc.)

### Prioriteit 3: Landingspagina
- [ ] Screen recordings van werkende demo's als video/GIF
- [ ] Testimonials sectie (kan fictief zijn voor demo)

### Prioriteit 4: Deployment
- [ ] Cloudflare Workers deployment fixen (output: standalone)
- [ ] Environment variables instellen op Cloudflare
- [ ] Custom domain (socialo.nl)
- [ ] SSL/HTTPS

---

## TECHNISCHE NOTITIES

### Environment variables nodig:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### Deploy commando:
```bash
npm run build  # Next.js build
# Deploy naar Cloudflare via dashboard of wrangler
```

### Bekende issues:
1. In-memory store: alle data verdwijnt bij restart. OK voor demo, niet voor productie.
2. Geen rate limiting op API routes — bij veel gebruik gaat de API-rekening omhoog.
3. Translation cache is in-memory — verdwijnt bij restart.
