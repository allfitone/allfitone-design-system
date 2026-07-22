import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";

import "@allfitone/react/tokens.css";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
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
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
