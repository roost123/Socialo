import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const fontClasses = `${outfit.variable} ${outfit.className}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
