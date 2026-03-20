import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { LenisProvider } from "@/components/lenis-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Socialo — Dat moet toch automatisch kunnen?",
  description:
    "Socialo bouwt maatwerk AI-automatisering voor het MKB. Wij zoeken uit waar jij tijd verliest — en bouwen precies wat jij nodig hebt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={GeistSans.className}>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
