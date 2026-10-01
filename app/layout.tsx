import { Cairo, Manrope, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { LatinUrlDigits } from "@/components/layout/LatinUrlDigits";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/Toaster";
import { dirForLocale } from "@/i18n/config";
import { getTranslations } from "@/i18n/serverTranslations";

import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("chrome");
  return {
    title: { default: t("siteTitle"), template: `%s | ${t("brand")}` },
    description: t("siteDescription"),
    icons: {
      icon: "/app-logo.png",
      apple: "/app-logo.png",
    },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/">): Promise<ReactNode> {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={dirForLocale(locale)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cairo.variable} ${playfair.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="text-prose relative min-h-full font-sans">
        <div aria-hidden className="app-glow-layer" />
        <NextIntlClientProvider>
          <NuqsAdapter>
            <ThemeProvider>
              <QueryProvider>
                {children}
                <Toaster />
                <Suspense fallback={null}>
                  <LatinUrlDigits />
                </Suspense>
              </QueryProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
