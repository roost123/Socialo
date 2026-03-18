# Menu Translator Demo — Stap-voor-stap plan

Focus: **Eén demo, perfect.** De rest komt later.

---

## De 8 stappen

### Stap 1: Data laag fixen
**Probleem:** In-memory store verliest alles bij restart. Type safety heeft gaten.
**Doen:**
- Verplaats naar file-based JSON storage (simpel, persistent, geen database nodig)
- Fix alle type issues (null handling, loose types)
- Validatie toevoegen: geen lege dish names, geen lege categorieën
- `imageUrl` en `logoUrl` velden verwijderen (gebruiken we niet, is misleidend)

### Stap 2: API routes solide maken
**Probleem:** Geen timeouts, vage errors, geen input validatie.
**Doen:**
- Extract route: image validatie (max 10MB, alleen image types), timeout na 30s
- Translate route: timeout, betere foutmelding, fallback response bij falen
- Menu CRUD: input validatie, proper error responses
- New route: accepteer optionele restaurantnaam uit body
- Alle routes: consistente error format `{ error: string, details?: string }`

### Stap 3: Creator landing page (`/demo/menu`)
**Probleem:** Manual entry fallback is dood, error state is basic.
**Doen:**
- Fix manual entry flow (POST naar /api/menu/new met optionele naam)
- Betere error state bij upload falen (specifieke tips: "foto te donker", "geen menu gevonden")
- Upload progress indicator
- Camera capture optie voor mobiel

### Stap 4: Menu editor (`/demo/menu/[id]`)
**Probleem:** Null type hack, geen validatie, geen unsaved changes warning.
**Doen:**
- Fix tagline null handling proper
- Validatie: markeer lege velden rood, blokkeer save bij kritieke fouten
- "Unsaved changes" indicator
- Bevestiging bij verwijderen van categorie/gerecht
- Auto-save of duidelijke save feedback
- Betere empty states ("Voeg je eerste gerecht toe")

### Stap 5: Gastpagina taalkeuze (`/menu/[id]` — eerste scherm)
**Probleem:** Werkt maar kan beter. Skeleton matcht niet met echt menu.
**Doen:**
- Browser language detection: stel automatisch de taal voor
- Onthoud laatst gekozen taal in localStorage
- Dynamische skeleton gebaseerd op het echte menu (aantal categorieën/items)
- Snellere perceived performance: toon origineel menu direct, vertaal op achtergrond

### Stap 6: Gastpagina menu (`/menu/[id]` — na taalkeuze)
**Probleem:** Translation error is onduidelijk, geen client-side caching.
**Doen:**
- Client-side translation cache (localStorage)
- Duidelijker error: "Vertaling naar [taal] is niet gelukt. Je ziet het menu in [originele taal]."
- Smooth animatie bij wisselen van taal (fade out/in)
- Print-friendly styling (@media print)

### Stap 7: End-to-end testen en edge cases
**Doen:**
- Test met demo menu's: elke taal in de "Popular" lijst
- Test met lege menu's, menu's met 1 item, menu's met 50 items
- Test op mobiel viewport
- Test error states: API key missing, rate limit, netwerk error
- Performance check: hoe snel laadt het menu, hoe snel vertaalt het

### Stap 8: Polish en deploy
**Doen:**
- Final responsive check alle viewports
- Accessibility check (aria labels, keyboard nav, screen reader)
- Meta tags voor social sharing (og:image, og:title)
- Deploy naar Cloudflare
- Test op productie URL

---

## Huidige status

| Stap | Status |
|---|---|
| 1. Data laag fixen | Done |
| 2. API routes solide maken | Done |
| 3. Creator landing page | Done |
| 4. Menu editor | Done |
| 5. Gastpagina taalkeuze | Done |
| 6. Gastpagina menu | Done |
| 7. End-to-end testen | Done |
| 8. Polish en deploy | Done |
