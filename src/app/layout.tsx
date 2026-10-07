import type { Metadata } from "next";
import { Caveat, Coda, IBM_Plex_Mono, Inria_Sans, Inter, Onest, Press_Start_2P, Science_Gothic } from "next/font/google";
import { localBusinessLd, site } from "@/lib/site";
import { ContactModal } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/ContactModal";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import "./globals.css";

// Headlines (hero and section headings): Science Gothic — a variable "hardware" grotesque (Bank Gothic lineage) with Cyrillic;
// the width axis lets the headline run condensed on phones and full width on desktop.
const scienceGothic = Science_Gothic({ variable: "--font-science", subsets: ["latin", "cyrillic"], axes: ["wdth"] });
// Body text: Onest — a sans designed for Cyrillic UI text, clear at small sizes.
const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin", "cyrillic"], weight: "400" });
// Pixel face for short labels, buttons and marquees (as on the promo banner).
const pressStart = Press_Start_2P({ variable: "--font-press-start", subsets: ["latin", "cyrillic"], weight: "400" });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "cyrillic"], weight: "400" });
// Latin-only faces used for the "PcWizard_uz" wordmark.
const coda = Coda({ variable: "--font-coda", subsets: ["latin"], weight: "800" });
const inriaSans = Inria_Sans({ variable: "--font-inria", subsets: ["latin"], weight: "700" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"], weight: "600" });

// Narrowest layout we design for. On narrower phones the page is laid out at this
// width and the browser scales it down to fit, instead of squeezing the content.
const MIN_WIDTH = 375;
// Portrait only: in landscape every phone is wider than MIN_WIDTH anyway.
// (screen.width is unreliable across rotation on iOS, so use the shorter screen side.)
const minWidthScript = `(function(){var w=${MIN_WIDTH},m=document.createElement("meta");m.name="viewport";document.head.appendChild(m);function f(){var narrow=Math.min(screen.width,screen.height)<w&&matchMedia("(orientation: portrait)").matches;m.content=narrow?"width="+w:"width=device-width, initial-scale=1"}f();addEventListener("orientationchange",function(){setTimeout(f,50)})})()`;

// Страницы задают свои title, description и canonical; здесь — общие значения.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Сборка ПК на заказ по всему Узбекистану — гарантия 30 дней",
  description:
    "Соберём игровой или рабочий ПК под ваш бюджет. Новые комплектующие с чеком, тест под нагрузкой при вас, гарантия 30 дней. Работаем по всему Узбекистану.",
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    images: [{ url: site.logo, width: 366, height: 160, alt: site.name }],
  },
  twitter: { card: "summary" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fonts = [scienceGothic, onest, plexMono, pressStart, caveat, coda, inriaSans, inter].map((f) => f.variable).join(" ");
  return (
    <html lang="ru" className={`${fonts} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: minWidthScript }} />
      </head>
      <body>
        <JsonLd data={localBusinessLd()} />
        {children}
        {/* Opens for every "#contact" link instead of scrolling to the form */}
        <ContactModal />
      </body>
    </html>
  );
}
