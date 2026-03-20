"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const sentences = [
  "Je klantenservice loopt achter omdat één persoon alles handmatig afhandelt.",
  "Je team besteedt uren aan data overtypen van het ene systeem naar het andere.",
  "Je klanten verwachten 24/7 antwoord.\nMaar je hebt geen nachtdienst.",
  "Elke week dezelfde e-mails.\nDezelfde vragen. Dezelfde antwoorden.",
  "Je wéét dat het beter kan.\nMaar je weet niet waar je moet beginnen.",
];

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const sentenceRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${sentences.length * 100}%`,
          pin: true,
          scrub: 1,
        },
      });

      sentenceRefs.current.forEach((sentence, i) => {
        if (!sentence) return;

        if (i === 0) {
          // First sentence: start visible, then fade out
          tl.from(sentence, {
            opacity: 0,
            y: 30,
            filter: "blur(6px)",
            duration: 1,
          })
            .to(sentence, { opacity: 1, duration: 1.5 }) // hold
            .to(sentence, { opacity: 0, y: -30, duration: 0.8 });
        } else {
          // Remaining sentences: fade in, hold, fade out
          tl.from(sentence, {
            opacity: 0,
            y: 30,
            filter: "blur(6px)",
            duration: 1,
          })
            .to(sentence, { opacity: 1, duration: 1.5 }) // hold
            .to(
              sentence,
              {
                opacity: 0,
                y: -30,
                duration: i === sentenceRefs.current.length - 1 ? 0 : 0.8,
              }
            );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="probleem"
      className="section-full relative overflow-hidden"
    >
      <div className="section-content text-center relative h-full flex items-center justify-center">
        {sentences.map((text, i) => (
          <p
            key={i}
            ref={(el) => { sentenceRefs.current[i] = el; }}
            className="text-problem text-text-primary absolute inset-x-0 px-6 gsap-reveal whitespace-pre-line"
            style={{ opacity: 0 }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
