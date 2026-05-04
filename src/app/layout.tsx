import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "600", "700", "800"], display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm", weight: ["300", "400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Flippin – Karten kaufen & verkaufen",
  description: "Dein Marktplatz für seltene Sammelkarten. Pokémon, MTG, Yu-Gi-Oh!, One Piece. Faire Preise, schneller Versand im DACH-Raum.",
  openGraph: {
    title: "Flippin – Karten kaufen & verkaufen",
    description: "Dein Marktplatz für seltene Sammelkarten im DACH-Raum.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
