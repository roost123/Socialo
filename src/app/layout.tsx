import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Socialo — That should be automatic by now.",
  description:
    "We take repetitive work and make it disappear. Automations for small and medium businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
