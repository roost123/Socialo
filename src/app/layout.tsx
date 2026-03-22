import { Afacad_Flux } from "next/font/google";
import "./globals.css";

const afacadFlux = Afacad_Flux({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export { afacadFlux };
