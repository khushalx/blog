import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/standard-italic.css";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { site } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Independent Financial Research`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_GA_ID &&
          /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID) && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });`}
              </Script>
            </>
          )}
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
