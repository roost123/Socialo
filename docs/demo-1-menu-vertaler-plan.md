# Demo 1: Menu QR Vertaler — Implementatieplan

## Het idee in 30 seconden

Restaurant maakt foto van hun menukaart → AI leest alles uit → er komt een mooie meertalige webpagina uit → QR-code op tafel → gast scant, kiest taal, leest het menu. Klaar.

## Wat maakt deze demo indrukwekkend?

Het "wow-moment" zit in het contrast:
- **Input:** Een foto van een rommelig handgeschreven menu, of een saaie PDF
- **Output:** Een strakke, mobielvriendelijke pagina in 50+ talen, binnen seconden

Dat contrast is het hele verkoopargument. De demo moet dát gevoel overbrengen.

---

## User flows

### Flow 1: Restaurant-eigenaar (creator)
1. Komt op `/demo/menu` — korte uitleg + "Upload je menu"
2. Uploadt een foto (drag & drop of camera)
3. Ziet een loading state terwijl AI het menu verwerkt (~5-10 sec)
4. Krijgt een preview van het uitgelezen menu (categorieën, gerechten, prijzen)
5. Kan handmatig corrigeren als iets niet klopt
6. Klikt "Publiceer" → krijgt een QR-code + link
7. QR-code is downloadbaar/printbaar

### Flow 2: Gast (viewer)
1. Scant QR-code op tafel → komt op `/menu/[id]`
2. Ziet een taalkeuze (vlaggetjes of taallijst)
3. Kiest taal → menu verschijnt in die taal
4. Mooi, mobiel, snel. Geen app nodig, geen download.

---

## Technische architectuur

### Routes (in de bestaande Next.js app)

```
/demo/menu          → Creator landing page (uitleg + upload)
/demo/menu/[id]     → Creator dashboard (preview, QR code, edit)
/menu/[id]          → Gast-pagina (taalkeuze + menu) ← dit is de publieke URL
```

Noot: de gast-pagina staat op `/menu/[id]` (niet `/demo/menu/...`) zodat de URL kort en clean is op de QR-code.

### Stack

| Component | Keuze | Waarom |
|---|---|---|
| **AI (OCR + vertaling)** | Claude API (vision + structured output) | Stuurt foto + JSON-schema, krijgt gestructureerde data terug. Eén API call voor extractie. |
| **Vertaling** | Claude API (tweede call) | Vertaal de geëxtraheerde tekst naar de gekozen taal. On-demand, niet vooraf alle talen. |
| **Image upload** | `react-dropzone` | Headless, past bij ons design systeem, simpelste optie |
| **QR code** | `qrcode.react` | Meest populair, SVG output, één component |
| **Storage** | Cloudflare KV | We deployen al naar Cloudflare Workers. KV is simpelste key-value store. Geen ORM, geen schema. |
| **Caching vertalingen** | Cloudflare KV | Vertaling per taal opslaan als die al gedaan is, zodat we niet elke keer de API aanroepen |

### Data model (KV)

```
Key: menu:{id}
Value: {
  id: string,
  createdAt: string,
  originalLanguage: string,
  imageUrl: string,          // base64 of R2 URL
  categories: [
    {
      name: string,
      items: [
        {
          name: string,
          description: string,
          price: string
        }
      ]
    }
  ]
}

Key: menu:{id}:lang:{langCode}
Value: {
  categories: [
    {
      name: string,          // vertaald
      items: [
        {
          name: string,      // vertaald
          description: string // vertaald
          // price NIET vertaald — is universeel
        }
      ]
    }
  ]
}
```

Simpel. Menu-data in één key, vertalingen per taal in aparte keys. Vertalingen worden lazy gegenereerd: pas als een gast die taal kiest.

### AI prompts

**Stap 1: Menu extractie**
```
Systeem: Je bent een menu-extractie assistent. Analyseer deze foto van een
restaurant menu en extraheer alle gerechten met categorieën.

Structured output schema:
{
  originalLanguage: string (ISO 639-1),
  categories: [{
    name: string,
    items: [{
      name: string,
      description: string | null,
      price: string | null
    }]
  }]
}
```

**Stap 2: Vertaling (on-demand)**
```
Vertaal dit menu naar {targetLanguage}.
Behoud de structuur exact. Vertaal ALLEEN de tekst, niet de prijzen.
Gebruik natuurlijke taal die past bij een restaurant menu (niet te formeel,
niet te letterlijk).
```

### API routes (Next.js)

```
POST /api/menu/extract    → Upload foto, AI extractie, opslaan in KV, return menu ID
GET  /api/menu/[id]       → Haal menu data op
GET  /api/menu/[id]/[lang] → Haal vertaling op (cached of live genereren)
```

---

## Design (gast-pagina)

De gast-pagina is het visitekaartje. Die moet er beter uitzien dan het originele menu.

### Layout
- Mobile-first (95% van de scans is op telefoon)
- Restaurantnaam + logo bovenaan (optioneel)
- Taalkeuze als horizontale pill-bar (scroll als er veel talen zijn)
- Menu in verticale scroll met sticky categorieheaders
- Prijzen rechts uitgelijnd
- Subtiele "Powered by Socialo" footer met link

### Stijl
- Gebruikt hetzelfde design systeem als de Socialo site (cream bg, charcoal text, sage accents)
- Maar subtieler — het menu moet centraal staan, niet het merk
- Denk: clean, typografie-gedreven, geen visuele clutter

---

## Bouwvolgorde

### Fase 1: Kernfunctionaliteit (MVP)
1. **API route voor menu extractie** — upload foto, Claude haalt data eruit, sla op in KV
2. **Gast-pagina** (`/menu/[id]`) — menu weergeven in originele taal
3. **Vertaalfunctie** — taalkeuze + on-demand vertaling via Claude
4. **Creator pagina** — upload flow + preview + QR code generatie

### Fase 2: Polish
5. **Edit functie** — creator kan geëxtraheerde data handmatig corrigeren
6. **Loading states** — skeleton loaders, progress indicators
7. **Error handling** — slechte foto's, API failures, etc.
8. **Animaties** — pagina-overgangen, taalswitch animatie

### Fase 3: Demo-ready
9. **Voorbeeldmenu's** — 2-3 pre-loaded menu's zodat je de demo kunt laten zien zonder foto te uploaden
10. **Mobile camera integratie** — directe foto nemen (niet alleen uploaden)
11. **QR code download** — als PNG/SVG, print-ready

---

## Dependencies (nieuw)

```bash
npm install @anthropic-ai/sdk react-dropzone qrcode.react nanoid
```

- `@anthropic-ai/sdk` — Claude API client
- `react-dropzone` — File upload UI
- `qrcode.react` — QR code generatie
- `nanoid` — Korte unieke IDs voor menu URLs

---

## Kosten & limieten

- **Claude API:** ~$0.01-0.03 per menu extractie (1 foto), ~$0.005 per vertaling
- **Cloudflare KV:** Gratis tier = 100k reads/dag, 1k writes/dag — meer dan genoeg voor een demo
- **Bottleneck:** De AI-call duurt 5-15 seconden. Dat is acceptabel als de loading state goed is.

---

## Risico's & mitigatie

| Risico | Impact | Mitigatie |
|---|---|---|
| Slechte foto kwaliteit | AI leest menu verkeerd uit | Edit-functie voor handmatige correctie + duidelijke instructie bij upload |
| AI hallucineert gerechten | Fout menu online | Preview stap vóór publicatie — creator checkt altijd |
| Vertaalkwaliteit variabel | Raar klinkende vertalingen | Testen met 5-10 talen. Claude is sterk in vertaling, maar edge cases bestaan |
| API kosten bij veel gebruik | Budget issues | Rate limiting op API routes. Voor demo fase niet relevant |

---

## Open vragen

1. **Willen we image storage?** Nu slaan we de foto als base64 op in KV. Bij grote foto's kan dat 1-2MB per entry zijn. Alternatief: Cloudflare R2 (object storage). Voor de demo maakt het niet uit.
2. **Hoeveel talen standaard aanbieden?** Suggestie: top 15 (EN, DE, FR, ES, IT, PT, ZH, JA, KO, AR, RU, TR, PL, NL, TH) + "Other" optie.
3. **Branding opties voor het restaurant?** Voor de demo: nee, gewoon Socialo-stijl. Later: kleuren/logo aanpassen.
4. **Offline toegang?** De gast-pagina zou als PWA kunnen werken. Overbodig voor demo, maar leuk voor later.
