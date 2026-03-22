# Socialo.nl — Website

## Project
Marketing website voor Socialo, een MKB AI-automatiseringsbedrijf. Eén lange scrollpagina, verticaal verhaal. Premium, minimalistisch, Apple/Linear-achtig.

## Kwaliteitsstandaard
Elk component dat je oplevert moet production-ready zijn. Geen skelet, geen basis die "later nog afgemaakt wordt". Als je een sectie bouwt, is die af.

Concreet:
- Geen TODO-comments, geen placeholder-logica, geen lege functies
- Geen "simpele versie eerst" — bouw het goed in één keer
- Alle styling, hover states, responsive gedrag, en animaties zitten erin
- Als je iets bouwt, test het visueel voordat je zegt dat je klaar bent
- Als je twijfelt of iets er goed uitziet: fix het, vraag niet of ik het wil

Na elke oplevering: loop je eigen output na. Check responsive (375px, 768px, 1280px), check of animaties smooth zijn, check of kleuren en spacing kloppen met de specs hieronder. Als iets niet klopt, fix het voordat je rapporteert.

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS
- GSAP + ScrollTrigger (scroll-animaties)
- Vercel deployment
- Geen externe UI-libraries (geen shadcn, MUI, Radix). Alles custom.

## Typografie
Font: Afacad Flux (Google Fonts), via next/font/google.
- Display: 36px / 700 / -1.5px tracking
- H1: 28px / 700 / -1px
- H2: 22px / 700 / -0.5px
- H3: 17px / 500 / -0.3px
- Body: 16px / 400 / 0px / line-height 1.6
- Label: 11px / 500 / uppercase / +2px tracking

## Kleuren
Achtergrond: #FAFAFA. Tekst: #000000. Secondary: #737373. Muted: #A3A3A3. Borders: #E5E5E5. Surface: #F5F5F5.
Gradient (dark sections): linear-gradient(135deg, #243748, #4B749F).
Primary button: #7C5CFC solid, wit tekst. Secondary button: wit, border #E5E5E5. Ghost: #F5F5F5.
Badges — Sage: #E4EADB/#3A5A2A. Blue: #DBEAFE/#1D4ED8. Green: #D1FAE5/#065F46. Amber: #FEF3C7/#92400E.

## Layout
- Border-radius: 10px buttons, 14-16px cards, 6px badges
- Spacing tussen secties: 100-120px
- Max-width container: ~1200px centered
- Responsief: Tailwind breakpoints (sm/md/lg/xl)
- Monochrome UI als podium, foto/video brengt kleur

## Animaties
- GSAP ScrollTrigger voor alle scroll-animaties
- Fade-in: opacity 0→1, translateY 20→0, duration 0.6-0.8s, ease power2.out
- Stagger: 0.1-0.15s
- Cleanup in useEffect returns
- Respecteer prefers-reduced-motion

## Conventies
- Alle copy en sectie-specs staan in docs/WEBSITE_SPEC.md
- Beelden zijn placeholders (div met achtergrondkleur #E5E5E5, correcte aspect ratio, beschrijvende class)
- Elk component moet visueel af zijn op desktop én mobiel
