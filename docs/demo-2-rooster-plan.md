# Demo 2: Zelf-makend Rooster — Implementatieplan

## Het idee in 30 seconden

Horeca-eigenaar voert medewerkers in → deelt een link → medewerkers geven beschikbaarheid op via hun telefoon → één klik → AI maakt het weekrooster. Bij problemen (ziekmelding, te weinig bezetting) lost het systeem het zelf op.

## Wat maakt deze demo indrukwekkend?

Het contrast is hier ook de kern:
- **Zonder Socialo:** Elke maandag 2-4 uur puzzelen met Excel, WhatsApp-berichtjes, en contractregels in je hoofd
- **Met Socialo:** Één knop. Klaar. En het rooster respecteert alle regels die jij altijd handmatig moet checken.

De "wow" zit in twee momenten:
1. **Generatie:** Je klikt op "Maak rooster" en binnen 10 seconden staat er een compleet, kloppend weekrooster
2. **Slimheid:** Het systeem kent Nederlandse arbeidswetgeving, contracturen, rusttijden — dingen waar je normaal handmatig op let

---

## User flows

### Flow 1: Restaurant-eigenaar (setup)
1. Komt op `/demo/schedule` — korte uitleg + "Start"
2. Voert medewerkers in (naam, rol, contracttype, uren per week)
3. Definieert bezettingseisen per dagdeel (bv. lunch: 1 kok + 2 bediening, diner: 2 koks + 4 bediening)
4. Krijgt een deelbare link voor beschikbaarheid

### Flow 2: Medewerker (beschikbaarheid)
1. Opent link op telefoon → `/demo/schedule/[id]/availability`
2. Ziet een weekoverzicht met dagdelen (ochtend/middag/avond)
3. Tikt aan wanneer ze beschikbaar zijn
4. Klaar — geen account, geen app, geen gedoe

### Flow 3: Restaurant-eigenaar (generatie)
1. Terug op het dashboard → ziet wie beschikbaarheid heeft ingevuld
2. Klikt "Maak rooster"
3. AI genereert het rooster (~10 sec)
4. Ziet het weekrooster in een visuele grid
5. Kan shifts slepen om aan te passen (drag & drop)
6. Waarschuwingen als er regels worden overtreden (rode highlight)

### Flow 4: Ziekmelding (bonus demo)
1. Op het dashboard: klik op een ingepland persoon → "Ziekmelding"
2. Systeem zoekt automatisch een vervanging op basis van beschikbaarheid en contractregels
3. Toont voorstel → eigenaar keurt goed

---

## Nederlandse arbeidswetgeving (Arbeidstijdenwet)

Dit is wat de demo slim maakt — en wat het verschil maakt met "gewoon ChatGPT gebruiken."

### Harde regels die we checken

| Regel | Bron |
|---|---|
| Max 12 uur per dag | Arbeidstijdenwet |
| Max 60 uur per week | Arbeidstijdenwet |
| Gemiddeld max 48 uur over 16 weken | Arbeidstijdenwet |
| Min 11 uur dagelijkse rust (sluit 23:00 → niet openen 07:00) | Arbeidstijdenwet |
| Min 36 uur aaneengesloten weekrust | Arbeidstijdenwet |
| Min 3 uur per oproep (nuluren/oproepkracht) | Horeca CAO |
| Oproepkracht min 24 uur van tevoren oproepen | Horeca CAO |
| Jongeren (16-17): max 8 uur per dag, niet tijdens schooltijd | Arbeidstijdenwet |

### Zachte regels (voorkeuren)

- Contracturen zo dicht mogelijk bij het afgesproken aantal
- Eerlijke verdeling van onpopulaire shifts (zondag, sluiting)
- Persoonlijke voorkeuren respecteren waar mogelijk
- Binnen het loonbudget blijven

---

## Technische architectuur

### Aanpak: Hybrid LLM + validatie

Geen pure constraint solver (te complex voor een demo), geen pure LLM (niet betrouwbaar genoeg). De hybrid aanpak:

1. **LLM genereert** het rooster op basis van alle data (gestructureerde prompt)
2. **TypeScript valideert** tegen harde regels (arbeidstijdenwet, contracturen)
3. **Bij overtredingen:** re-prompt de LLM met de specifieke problemen
4. **Resultaat:** een rooster dat er goed uitziet én daadwerkelijk klopt

Dit is voor een demo met 8-15 medewerkers en 1 week ruim voldoende.

### Routes

```
/demo/schedule              → Setup pagina (medewerkers + bezetting invoeren)
/demo/schedule/[id]         → Dashboard (beschikbaarheid status + rooster genereren)
/demo/schedule/[id]/availability → Medewerker beschikbaarheid (deelbare link)
```

### API routes

```
POST /api/schedule/create       → Restaurant + medewerkers opslaan, return ID
GET  /api/schedule/[id]         → Data ophalen (medewerkers, beschikbaarheid, rooster)
POST /api/schedule/[id]/availability → Beschikbaarheid opslaan voor een medewerker
POST /api/schedule/[id]/generate    → Rooster genereren via LLM + validatie
POST /api/schedule/[id]/sick        → Ziekmelding + vervanging zoeken
```

### Data model

```typescript
interface Employee {
  id: string;
  name: string;
  role: "cook" | "server" | "dishwasher" | "bartender" | "host";
  contractType: "fulltime" | "parttime" | "oncall" | "student";
  contractHours: number; // uren per week
  isMinor: boolean;      // 16-17 jaar
  preferences: string;   // vrije tekst, bv "liever geen zondagen"
}

interface Availability {
  employeeId: string;
  // Per dag (ma-zo) per dagdeel: beschikbaar of niet
  slots: Record<string, ("morning" | "afternoon" | "evening")[]>;
}

interface StaffingRequirement {
  dayPart: "morning" | "afternoon" | "evening";
  // Per dag, hoeveel van elke rol nodig
  roles: Record<string, number>; // bv { cook: 2, server: 4 }
}

interface Shift {
  employeeId: string;
  day: string;       // "monday", "tuesday", etc.
  start: string;     // "07:00"
  end: string;       // "15:00"
  role: string;
}

interface Schedule {
  id: string;
  weekStart: string;
  shifts: Shift[];
  warnings: string[]; // zachte regels die niet perfect kloppen
  violations: string[]; // harde regels die overtreden worden (zou leeg moeten zijn)
}
```

### AI prompt (vereenvoudigd)

```
Je bent een rooster-assistent voor een Nederlands horecabedrijf.

MEDEWERKERS:
{JSON met naam, rol, contracttype, uren, beschikbaarheid}

BEZETTINGSEISEN:
{JSON met hoeveel personeel per dagdeel per rol}

REGELS:
- Max 12 uur per dag per medewerker
- Min 11 uur rust tussen shifts
- Min 36 uur aaneengesloten rust per week
- Contracturen respecteren (±2 uur tolerantie)
- Oproepkrachten: min 3 uur per shift
- Jongeren: max 8 uur per dag

Maak een weekrooster. Output als JSON:
{
  "shifts": [
    { "employeeId": "...", "day": "monday", "start": "07:00", "end": "15:00", "role": "cook" }
  ],
  "notes": ["eventuele opmerkingen over keuzes die je hebt gemaakt"]
}
```

### TypeScript validator

Een reeks functies die het gegenereerde rooster checken:

```typescript
function validateSchedule(schedule: Schedule, employees: Employee[]): ValidationResult {
  // checkMaxHoursPerDay() — max 12u
  // checkDailyRest() — min 11u tussen shifts
  // checkWeeklyRest() — min 36u aaneengesloten
  // checkContractHours() — binnen tolerantie
  // checkMinShiftLength() — min 3u voor oproepkrachten
  // checkMinorRestrictions() — max 8u voor jongeren
  // checkCoverage() — zijn alle bezettingseisen gedekt?
}
```

---

## UI design

### Setup pagina
- Stap 1: Medewerkers toevoegen (simpel formulier: naam, rol, contract, uren)
- Stap 2: Bezettingseisen per dagdeel (drag sliders of number inputs)
- Stap 3: "Genereer link voor beschikbaarheid"
- Strak, stapsgewijs, geen overweldigende interface

### Beschikbaarheid (mobiel-eerst)
- 7 kolommen (ma-zo), 3 rijen (ochtend/middag/avond)
- Tik om te togglen (groen = beschikbaar, grijs = niet)
- Naam bovenaan, "Opslaan" knop onderaan
- Extreem simpel — dit moet in 30 seconden klaar zijn

### Weekrooster (het visitekaartje)
- **Grid:** dagen horizontaal, medewerkers verticaal
- **Shift blocks:** gekleurde blokken per rol (blauw = bediening, rood = keuken, etc.)
- **Shift info:** tijden + rol in het blok
- **Stats sidebar:** uren per medewerker deze week, bezettingsgraad per dagdeel
- **Warnings:** gele badges voor zachte waarschuwingen, rode voor harde overtredingen
- **Drag & drop:** shifts verslepen naar andere medewerkers/tijden, met live validatie

### Ziekmelding flow
- Klik op een shift → "Ziekmelding" knop
- Modal toont: "Zoeken naar vervanging..."
- AI checkt beschikbare medewerkers → toont voorstel
- Eigenaar keurt goed of wijst af

---

## Bouwvolgorde

### Fase 1: Kern
1. **Data types + store** — medewerker model, beschikbaarheid, rooster
2. **Setup pagina** — medewerkers invoeren, bezettingseisen
3. **Beschikbaarheid pagina** — mobiele week-grid
4. **Generatie API** — LLM prompt + basis validatie
5. **Rooster weergave** — visuele week-grid (zonder drag & drop)

### Fase 2: Interactief
6. **Validatie engine** — alle arbeidstijdenwet regels
7. **Warnings/violations UI** — visuele feedback op het rooster
8. **Drag & drop** — shifts verslepen met `dnd-kit`

### Fase 3: Demo-ready
9. **Ziekmelding flow** — vervanging zoeken
10. **Pre-loaded demo** — voorbeeldrestaurant met 10 medewerkers en ingevulde beschikbaarheid
11. **Animaties** — loading state bij generatie, smooth transitions

---

## Dependencies (nieuw)

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Verder hergebruiken we `@anthropic-ai/sdk` (al geïnstalleerd) en `nanoid`.

---

## Kosten & limieten

- **Claude API:** ~$0.02-0.05 per rooster generatie (1 prompt met alle medewerker data)
- **Re-prompts:** max 2-3 extra calls als validatie faalt → totaal ~$0.10 worst case
- **Bottleneck:** Generatie duurt 10-20 seconden. Acceptabel met goede loading state.

---

## Scope voor de demo — wat we WEL en NIET doen

### Wel:
- Medewerkers invoeren met rol en contracttype
- Beschikbaarheid via deelbare link
- Automatische roostergeneratie
- Visueel weekrooster
- Nederlandse arbeidstijdenwet validatie
- Pre-loaded demo data

### Niet (bewust):
- Geen user accounts / authenticatie
- Geen notificaties (WhatsApp/email) — simuleren we visueel
- Geen historische data / meerdere weken
- Geen loonberekening
- Geen POS-integratie
- Geen multi-locatie support

---

## Risico's

| Risico | Impact | Mitigatie |
|---|---|---|
| LLM genereert ongeldig rooster | Demo ziet er onprofessioneel uit | Validatie layer + max 3 re-prompts |
| Te veel medewerkers voor LLM context | Prompt wordt te groot | Demo limiet: max 15 medewerkers |
| Drag & drop complexiteit | Kost veel dev-tijd | Fase 2 — eerst werkend zonder d&d |
| Arbeidstijdenwet regels incorrect | Verkeerde indruk bij horeca-eigenaren | Regels geverifieerd via officiële bronnen (Arbeidstijdenwet, Horeca CAO, KHN) |

---

## Open vragen

1. **Taal van de demo?** De website is Engels, maar deze demo is specifiek voor NL-horeca. Suggestie: UI in het Engels (consistent met de rest), maar de demo-data (namen, rollen) in het Nederlands.
2. **Shift tijden:** Werken we met vaste dagdelen (ochtend 07-15, middag 11-19, avond 16-00) of vrije tijden? Suggestie: vaste dagdelen voor de demo, simpeler.
3. **Hoeveel demo-medewerkers?** Suggestie: 10 — genoeg om het indrukwekkend te maken, niet te veel voor de LLM.
