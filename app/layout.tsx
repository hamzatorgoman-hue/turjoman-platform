import type { Metadata, Viewport } from "next";
import { Almarai, IBM_Plex_Sans_Arabic, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const display = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const latin = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-latin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ترجمان | بداية تليق بطموحك",
  description:
    "ترجمان منصة إطلاق الأعمال: نحوّل فكرتك إلى هوية احترافية متكاملة، ونرافقك حتى تنطلق بثقة.",
  openGraph: {
    title: "ترجمان | بداية تليق بطموحك",
    description:
      "نحوّل فكرتك إلى هوية احترافية متكاملة، ونساعدك في إطلاق مشروعك بثقة واحتراف.",
    locale: "ar_SA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070503",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${display.variable} ${body.variable} ${latin.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
