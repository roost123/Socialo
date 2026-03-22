# Scroll Website — Socialo One-Pager

## Filosofie

Dit is een scroll-ervaring, geen website met secties. Eén gedachte per scherm, één boodschap tegelijk. Alles verschijnt en ontvouwt zich door scroll.

## Referenties

Bestudeer deze sites voor inspiratie (niet kopiëren, maar het principe begrijpen):
- jeskojets.com — scroll = storytelling
- apple.com/siri — één boodschap per scherm, enorme witruimte
- aventuradentalarts.com — horizontale verschuiving bij verticaal scrollen
- linear.app — typografie, blurs, fade-ins (maar te druk als geheel)

## GSAP Setup

Gebruik GSAP ScrollTrigger voor ALLE animaties. Lenis voor smooth scrolling.

```
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

- `scrub: true` — waar elementen meebewegen met scroll
- `toggleActions: "play none none none"` — waar elementen eenmalig verschijnen
- `pin: true` — waar de viewport vast blijft en content wisselt

## Design Tokens

```
Kleuren:
  --bg: #FAFAFA
  --text: #1A1A1A
  --text-muted: #6B6B6B
  --accent: #4A7C6F (gedempte teal, spaarzaam)
  --gradient-1: #E8E4F0 (zacht paars)
  --gradient-2: #E0EDE8 (zacht groen)
  --gradient-3: #E4E8F0 (zacht blauw)

Typografie (Inter):
  h1: 700, 64px/40px mobile, line-height 1.1, tracking -0.02em
  h2: 600, 48px/32px mobile, line-height 1.15, tracking -0.02em
  h3: 600, 24px/20px mobile, line-height 1.3
  body: 400, 18px/16px mobile, line-height 1.6, kleur --text-muted

Spacing:
  Elke sectie: minimaal 100vh
  Padding: 120px top/bottom desktop, 80px mobile
  Max content width: 800px gecentreerd
  Max ~40 woorden per zichtbaar blok
```

## Globale regels

- NOOIT meerdere kolommen/cards naast elkaar voor content
- NOOIT bullet points of genummerde lijsten op de pagina
- NOOIT tekst kleiner dan 16px
- NOOIT auto-play animaties — alles is scroll-triggered
- Navbar: fixed, transparant → wit bij scroll, hide on scroll down, show on scroll up

## Secties

Gedetailleerde specs per sectie staan in @docs/VISUAL_BRIEFING.md.
Bouw altijd één sectie per sessie. Lees de specs voor die specifieke sectie voordat je begint.

## Mobile (< 768px)

- Koppen: ~60-65% van desktop grootte
- Horizontale scroll-secties → verticale stapel met fade-ins
- Gepinde secties → gewone verticale scroll (pinning is janky op mobile)
- Alle padding: ~60% van desktop
- Touch targets: minimaal 48px
