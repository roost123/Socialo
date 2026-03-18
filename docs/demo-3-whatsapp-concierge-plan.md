# Demo 3: Hotel WhatsApp Concierge — Implementatieplan

## Het idee in 30 seconden

Hotelgast stuurt een WhatsApp-bericht → AI-concierge beantwoordt vragen, toont kamerfoto's, boekt roomservice, geeft restauranttips — alles in één gesprek. De receptie hoeft niets te doen.

## Wat maakt deze demo indrukwekkend?

We kunnen geen echte WhatsApp-koppeling maken in een demo. Maar dat hoeft ook niet. We bouwen een **WhatsApp-achtige chat interface** die het gesprek simuleert. De bezoeker typt een vraag, de AI antwoordt als hotelconcierge.

De "wow" zit in:
1. **Realisme:** Het ziet eruit als WhatsApp, voelt als WhatsApp
2. **Kennis:** De bot kent het hotel (kamertypes, prijzen, faciliteiten, omgeving)
3. **Acties:** De bot kan dingen DOEN (roomservice bestellen, late checkout aanvragen) — niet alleen vragen beantwoorden

## Aanpak

### Gesimuleerde WhatsApp UI
- Groene bubbels (gast) + witte bubbels (bot)
- Typing indicator (drie dots animatie)
- Tijdstempels, leesbevestigingen (blauwe vinkjes)
- Suggestie-chips voor veelgestelde vragen
- Foto's/kaarten inline in het gesprek

### Hotel context
Pre-loaded hotel data die de AI als context krijgt:
- Hotel naam, locatie, sterren
- Kamertypes + prijzen + foto's (placeholder images)
- Faciliteiten (spa, zwembad, gym, restaurant)
- Roomservice menu
- Omgeving (restaurants, bezienswaardigheden)
- Regels (checkout tijd, parkeren, huisdieren)

### Acties die de bot kan "uitvoeren"
- Roomservice bestellen (toont bevestiging)
- Late checkout aanvragen (toont bevestiging)
- Restaurant reservering (toont bevestiging)
- Taxi boeken (toont bevestiging)
- Routebeschrijving geven

## Routes

```
/demo/concierge    → Demo pagina met WhatsApp-achtige chat
```

## API

```
POST /api/concierge/chat  → Stuur bericht, krijg AI antwoord terug
```

## Tech

- Claude API met hotel-specifieke system prompt
- Streaming response voor realistic typing effect
- Geen database nodig — chat state in React state
- Placeholder hotel images via CSS gradients of inline SVG

## Bouwvolgorde

1. Hotel data + system prompt
2. Chat API route (Claude streaming)
3. WhatsApp-style chat UI
4. Suggestion chips + inline actions
5. Polish: typing indicator, timestamps, read receipts
