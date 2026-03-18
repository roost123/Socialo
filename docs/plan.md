# Socialo — Masterplan

Laatste update: 2026-03-18

---

## Status overzicht

| Onderdeel | Status | Kwaliteit |
|---|---|---|
| Landingspagina (one-pager) | ✅ Gebouwd | ⚡ Goed, maar mist video/scroll-animaties |
| Why Socialo sectie | ✅ Gebouwd | ✅ Goed |
| Demo 1: Menu Vertaler | ✅ Herbouwd | ✅ Full edit form, 80+ talen, zoek, AI prefill |
| Demo 2: Rooster | ✅ Gebouwd | 🟡 Werkend maar ongetest met echte API |
| Demo 3: WhatsApp Concierge | ✅ Gebouwd | 🟡 Werkend maar ongetest met echte API |

---

## WAT ER MOET GEBEUREN

### 1. MENU DEMO — Volledig herbouwen

De huidige menu demo is te simpel. Het moet een indrukwekkende end-to-end ervaring zijn.

#### Creator flow (restaurant-eigenaar)

**Stap 1: Keuze**
- [ ] Landing page met twee opties: "Upload een foto" of "Vul handmatig in"
- [ ] Demo-menu's als snelle start optie

**Stap 2: Upload → AI prefill → Bewerkbaar formulier**
- [ ] Foto uploaden → AI leest menu uit → vult formulier in
- [ ] Formulier met ALLE velden bewerkbaar:
  - Restaurantnaam
  - Logo upload (optioneel)
  - Tagline (optioneel)
  - Per categorie: naam, gerechten
  - Per gerecht: naam, beschrijving, prijs, foto upload (optioneel)
  - Categorieën toevoegen/verwijderen
  - Gerechten toevoegen/verwijderen
  - Drag & drop volgorde (nice to have)
- [ ] "Alles klopt? Publiceer!" knop

**Stap 3: Dashboard**
- [ ] QR code generatie
- [ ] Link kopiëren
- [ ] Preview knop
- [ ] QR code download (PNG, print-ready)

#### Guest flow (restaurantgast)

**Stap 1: Taalkeuze (het eerste wat je ziet)**
- [ ] Full-screen taalkeuze pagina
- [ ] ALLE talen ter wereld (80+) met vlaggen
- [ ] Zoekbalk: typ "Jap" → "Japanese 🇯🇵" verschijnt
- [ ] Populaire talen bovenaan (EN, DE, FR, ES, IT, ZH, JA, AR)
- [ ] Gegroepeerd per regio (Europa, Azië, Midden-Oosten, Afrika, Amerika)
- [ ] Scroll door alle talen OF zoek
- [ ] Na keuze: smooth transitie naar het menu

**Stap 2: Het menu**
- [ ] Restaurant naam + logo bovenaan
- [ ] Mooie typografie, mobiel-first
- [ ] Categorieën met sticky headers
- [ ] Gerecht foto's (als beschikbaar)
- [ ] Prijzen rechts uitgelijnd
- [ ] Taal-switch knop in de header (om te wisselen)
- [ ] "Powered by Socialo" footer
- [ ] Loading skeleton tijdens vertaling

#### Vertaling — MOET WERKEN
- [ ] API route gefixt (betere JSON parsing, betere prompt)
- [ ] 80+ talen ondersteund
- [ ] Caching: vertaling wordt opgeslagen, niet elke keer opnieuw
- [ ] Fallback bij fout: toon originele taal met melding

---

### 2. ROOSTER DEMO — Review en polish

- [ ] Testen met echte Claude API
- [ ] Check of validation engine correct werkt
- [ ] Loading states verbeteren
- [ ] Pre-loaded demo: automatisch beschikbaarheid ingevuld
- [ ] Foutafhandeling bij API failures
- [ ] Responsive check (mobiel)

---

### 3. WHATSAPP CONCIERGE DEMO — Review en polish

- [ ] Testen met echte Claude API
- [ ] Scroll naar laatste bericht verbeteren
- [ ] Suggestion chips na elk antwoord (contextual)
- [ ] Foutafhandeling bij API failures
- [ ] Responsive check

---

### 4. LANDINGSPAGINA — Naar next level

De site moet er niet alleen "goed" uitzien — die moet WOW zijn.

#### Scroll-animaties verbeteren
- [ ] GSAP ScrollTrigger integratie voor complexe scroll sequences
- [ ] Video element dat afspeelt/pauzet bij scrollen
- [ ] Parallax effecten op de hero gradient orbs
- [ ] Number counter animatie (bv "50+ talen" telt op)
- [ ] Card hover micro-interactions

#### Video/media toevoegen
- [ ] Hero: subtiele achtergrond video of animated gradient
- [ ] Demo sectie: screen recordings van de 3 demo's
- [ ] Before/after animatie (het verschil zichtbaar maken)

#### Content verbeteren
- [ ] Testimonials/social proof sectie (kan fake zijn voor demo)
- [ ] Pricing preview ("Vanaf €X/maand")
- [ ] FAQ sectie onderaan

---

## PRIORITEIT

1. **Menu demo herbouwen** — dit is het eerste wat mensen zien, moet perfect zijn
2. **Alle demo's testen** — met echte API calls, edge cases, foutafhandeling
3. **Landingspagina upgraden** — scroll-animaties, video, polish

---

## BESTANDEN DIE MOETEN VERANDEREN

### Menu demo (herbouw)
- `src/lib/types.ts` ✅ Updated (80+ talen, branding, imageUrl)
- `src/lib/store.ts` ✅ Updated (updateMenu, clearTranslations)
- `src/lib/demo-menus.ts` ✅ Updated (branding, imageUrl)
- `src/app/api/menu/extract/route.ts` ✅ Updated (betere prompt)
- `src/app/api/menu/[id]/route.ts` ✅ Updated (PUT voor edits, POST voor manual)
- `src/app/api/menu/[id]/[lang]/route.ts` ✅ Updated (betere JSON parsing)
- `src/app/demo/menu/page.tsx` — HERBOUWEN (upload + handmatig + demo keuze)
- `src/app/demo/menu/[id]/page.tsx` — HERBOUWEN (edit form + dashboard)
- `src/app/menu/[id]/page.tsx` — HERBOUWEN (taalkeuze + vertaald menu)

### Landingspagina (upgrade)
- `src/components/hero.tsx` — Video/animated background toevoegen
- `src/components/examples.tsx` — Screen recording previews
- `src/app/globals.css` — GSAP scroll animatie styles
- Nieuwe component: `src/components/scroll-video.tsx`
