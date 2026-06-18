import type { Metadata } from "next";
import { Montserrat, Caveat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CA Design — AI in design",
  description: "Månadsträff för designers — arkiv",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${caveat.variable}`}
        style={{ fontFamily: 'var(--font-montserrat), Helvetica Neue, Arial, sans-serif' }}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          storageKey="ca-theme"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
