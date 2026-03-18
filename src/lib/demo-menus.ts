import type { MenuData } from "./types";

// Pre-loaded demo menus so you can show the demo without uploading a photo
export const DEMO_MENUS: MenuData[] = [
  {
    id: "demo-italian",
    createdAt: new Date().toISOString(),
    originalLanguage: "it",
    categories: [
      {
        name: "Antipasti",
        items: [
          {
            name: "Bruschetta al Pomodoro",
            description:
              "Pane tostato con pomodorini freschi, basilico e olio extra vergine d'oliva",
            price: "€8.50",
          },
          {
            name: "Carpaccio di Manzo",
            description:
              "Fettine sottili di manzo crudo con rucola, parmigiano e tartufo",
            price: "€14.00",
          },
          {
            name: "Burrata con Prosciutto",
            description: "Burrata fresca servita con prosciutto di Parma e melone",
            price: "€13.50",
          },
        ],
      },
      {
        name: "Primi Piatti",
        items: [
          {
            name: "Spaghetti alle Vongole",
            description:
              "Spaghetti con vongole veraci, aglio, peperoncino e prezzemolo",
            price: "€16.00",
          },
          {
            name: "Risotto ai Funghi Porcini",
            description:
              "Risotto cremoso con funghi porcini freschi e parmigiano",
            price: "€17.50",
          },
          {
            name: "Pappardelle al Cinghiale",
            description: "Pappardelle fatte in casa con ragù di cinghiale toscano",
            price: "€18.00",
          },
        ],
      },
      {
        name: "Secondi Piatti",
        items: [
          {
            name: "Ossobuco alla Milanese",
            description:
              "Stinco di vitello brasato con gremolata e risotto allo zafferano",
            price: "€24.00",
          },
          {
            name: "Branzino al Forno",
            description:
              "Branzino intero al forno con patate, olive e pomodorini",
            price: "€22.00",
          },
          {
            name: "Tagliata di Manzo",
            description:
              "Controfiletto alla griglia con rucola e scaglie di parmigiano",
            price: "€26.00",
          },
        ],
      },
      {
        name: "Dolci",
        items: [
          {
            name: "Tiramisù della Casa",
            description: "Ricetta tradizionale con mascarpone, caffè e cacao",
            price: "€9.00",
          },
          {
            name: "Panna Cotta ai Frutti di Bosco",
            description: "Panna cotta con coulis di frutti di bosco freschi",
            price: "€8.50",
          },
        ],
      },
    ],
  },
  {
    id: "demo-dutch",
    createdAt: new Date().toISOString(),
    originalLanguage: "nl",
    categories: [
      {
        name: "Voorgerechten",
        items: [
          {
            name: "Hollandse Garnalencocktail",
            description:
              "Noordzeegarnalen met huisgemaakte cocktailsaus en toast",
            price: "€11.50",
          },
          {
            name: "Erwtensoep",
            description:
              "Traditionele erwtensoep met rookworst en roggebrood",
            price: "€8.00",
          },
        ],
      },
      {
        name: "Hoofdgerechten",
        items: [
          {
            name: "Stamppot Boerenkool",
            description:
              "Boerenkool met rookworst, jus en spekjes",
            price: "€16.50",
          },
          {
            name: "Zeetong Meunière",
            description:
              "Gebakken zeetong met botersaus, aardappelpuree en seizoensgroenten",
            price: "€28.00",
          },
          {
            name: "Biefstuk van de Haas",
            description:
              "Ossenhaas met pepersaus, gratin dauphinois en groene asperges",
            price: "€32.00",
          },
          {
            name: "Vegetarische Risotto",
            description:
              "Romige risotto met truffel, paddenstoelen en parmezaan",
            price: "€19.00",
          },
        ],
      },
      {
        name: "Nagerechten",
        items: [
          {
            name: "Appeltaart",
            description: "Huisgemaakte appeltaart met slagroom",
            price: "€7.50",
          },
          {
            name: "Dame Blanche",
            description: "Vanille-ijs met warme chocoladesaus en slagroom",
            price: "€8.00",
          },
        ],
      },
    ],
  },
];
