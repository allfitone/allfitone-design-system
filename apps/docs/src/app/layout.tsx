import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { Toaster } from "@allfitone/react/components/sonner";
import { TooltipProvider } from "@allfitone/react/components/tooltip";

import { ThemeProvider } from "@/components/theme-provider";
import { explorerThemeInitScript } from "@/lib/theme";

import "@allfitone/react/tokens.css";
import "@allfitone/react/app.css";
import "@allfitone/react/styles.css";
import "./globals.css";
import "./components.css";
import "./foundation.css";

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
  title: "Allfit One Design System",
  description: "Foundation and component reference for the Allfit One product ecosystem.",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: explorerThemeInitScript }} />
      </head>
      {/* suppressHydrationWarning: extensiones de navegador inyectan
          atributos en <body> (bis_register, __processed_*) antes de
          hidratar — falso positivo, no es código nuestro. */}
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
