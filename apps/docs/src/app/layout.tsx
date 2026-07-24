import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { Toaster } from "@allfitone/react/components/sonner";
import { TooltipProvider } from "@allfitone/react/components/tooltip";

import "@allfitone/react/tokens.css";
import "@allfitone/react/styles.css";
import "./globals.css";
import "./components.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "UI Foundation | Allfit One Design System",
  description: "Visual reference for the Allfit One cross-platform design tokens.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-afo-theme="dark"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: extensiones de navegador inyectan
          atributos en <body> (bis_register, __processed_*) antes de
          hidratar — falso positivo, no es código nuestro. */}
      <body suppressHydrationWarning>
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
