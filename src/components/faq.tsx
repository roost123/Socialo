"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";

const faqs = [
  {
    question: "Heb ik technische kennis nodig?",
    answer:
      "Helemaal niet. Als je een foto kunt maken en op een knop kunt drukken, kun je Socialo gebruiken. Wij regelen alle techniek — jij vertelt ons alleen welk probleem je opgelost wilt hebben.",
  },
  {
    question: "Hoe verschilt dit van ChatGPT of een standaard chatbot?",
    answer:
      "Een chatbot beantwoordt vragen en stopt daar. Socialo regelt de hele keten: een klantbericht wordt een boeking, een bevestiging, een herinnering, een opvolging. Het verschil zit niet in de bot — het zit in alles wat er na het gesprek gebeurt.",
  },
  {
    question: "Welke talen ondersteunt de Menuvertaler?",
    answer:
      "Meer dan 80 talen, waarmee je elke grote taal ter wereld dekt — van Engels en Frans tot Japans, Arabisch, Hindi, Swahili en alles ertussenin. Je gast kiest een taal en het menu verschijnt vertaald.",
  },
  {
    question: "Houdt de roostermaker zich aan de Nederlandse arbeidswet?",
    answer:
      "Ja. Het systeem checkt tegen de Arbeidstijdenwet en de Horeca CAO: maximale uren per dag en week, minimale rusttijden, regels voor minderjarigen, minimale oproepuren voor oproepkrachten en naleving van contracturen.",
  },
  {
    question: "Wat kost Socialo?",
    answer:
      "We zitten momenteel in de demofase en werken met early adopters. De prijs hangt af van welke oplossing je nodig hebt en de grootte van je bedrijf. Neem contact op en we kijken samen wat logisch is.",
  },
  {
    question: "Kan ik het uitproberen zonder verplichtingen?",
    answer:
      "Absoluut. Elke oplossing op deze pagina heeft een werkende demo die je nu meteen kunt proberen — geen account nodig, geen creditcard, geen kleine lettertjes.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-charcoal/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-medium text-charcoal pr-8 leading-snug">
          {question}
        </span>
        <CaretDown
          size={18}
          weight="bold"
          className={`text-warm-gray/40 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-warm-gray leading-relaxed font-light">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="px-4 py-28 md:py-40">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
              Veelgestelde vragen
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal">
              Vragen die je misschien hebt.
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer>
          <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] px-6 md:px-10">
              {faqs.map((faq, i) => (
                <StaggerItem key={i}>
                  <FAQItem question={faq.question} answer={faq.answer} />
                </StaggerItem>
              ))}
            </div>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
