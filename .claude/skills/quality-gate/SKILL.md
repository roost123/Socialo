# Quality Gate — UI/Frontend Work

Dit is de kwaliteitsstandaard voor alle visuele output in dit project.

## Voordat je "klaar" zegt

1. Open de browser en bekijk het resultaat op desktop (1440px) EN mobile (375px)
2. Stel jezelf deze vragen:
   - Ziet dit eruit als een professionele productiesite, of als een prototype?
   - Zijn er elementen met placeholder tekst of minimale styling?
   - Zijn alle animaties smooth bij verschillende scroll-snelheden?
   - Is er genoeg whitespace? (bij twijfel: meer whitespace)
   - Is de typografie consistent met de design specs?
3. Als het antwoord op vraag 1 "prototype" is: itereer. Niet stoppen.

## Veelvoorkomende fouten die je MOET vermijden

- Tekst die te dicht op elkaar staat (check line-height en padding)
- Animaties die "springen" in plaats van smooth transitioneren
- Secties die er op mobile niet goed uitzien
- Buttons zonder hover states
- Inconsistente font sizes of weights
- Elementen die net niet gecentreerd zijn

## Definition of Done per sectie

- Visueel geïnspecteerd in browser op desktop EN mobile
- Alle animaties smooth (test door langzaam en snel te scrollen)
- Typografie matcht VISUAL_BRIEFING.md specs
- Geen console errors
- Lighthouse performance > 90
