"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";

const faqs = [
  {
    question: "Do I need any technical knowledge?",
    answer:
      "None at all. If you can take a photo and click a button, you can use Socialo. We handle all the technology — you just tell us what problem you want solved.",
  },
  {
    question: "How is this different from ChatGPT or a standard chatbot?",
    answer:
      "A chatbot answers questions and stops there. Socialo handles the full chain: a customer message becomes a booking, a confirmation, a reminder, a follow-up. The difference isn't the bot — it's everything that happens after the conversation.",
  },
  {
    question: "What languages does the Menu Translator support?",
    answer:
      "Over 80 languages, covering every major language in the world — from English and French to Japanese, Arabic, Hindi, Swahili, and everything in between. Your guests pick their language, and the menu appears translated.",
  },
  {
    question: "Does the schedule builder comply with Dutch labor law?",
    answer:
      "Yes. It checks against the Arbeidstijdenwet (Working Hours Act) and the Horeca CAO: maximum hours per day and week, minimum rest periods, rules for minors, minimum call-in hours for on-call workers, and contract hour compliance.",
  },
  {
    question: "How much does Socialo cost?",
    answer:
      "We're currently in the demo phase and working with early adopters. Pricing will depend on which solution you need and the size of your business. Get in touch and we'll figure out what makes sense for you.",
  },
  {
    question: "Can I try it before committing?",
    answer:
      "Absolutely. Every solution on this page has a working demo you can try right now — no account needed, no credit card, no strings attached.",
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
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal">
              Questions you might have.
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
