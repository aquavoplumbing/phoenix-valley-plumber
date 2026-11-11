import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import { getSiteConfigResult } from "@/lib/config";
import { computeOpenStatus } from "@/lib/hours";
import { getCities, getNav, getSiteUrl } from "@/lib/routes";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/schema";
import { Footer } from "@/components/layout/Footer";
import { FloatingCallPill } from "@/components/layout/FloatingCallPill";
import { Header } from "@/components/layout/Header";
import { StickyCallBar } from "@/components/layout/StickyCallBar";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { CallTracker } from "@/components/ui/CallTracker";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B2A4A",
};

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Phoenix Plumber | Emergency Plumbing & Repairs | Call Now",
      template: `%s | ${site.brand}`,
    },
    description:
      "Licensed Phoenix, AZ plumber for emergency repairs, water heaters, drains and sewer lines. Serving the Valley. Call now.",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.brand,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${site.brand} — Licensed Phoenix, AZ Plumber`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.jpg"],
    },
    verification: {
      google: "Tu0xx_tqGjVtQBdsPo7jw85CRIR3Mgypl2AUQleWLn4",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { config: site, missingFields, isValid } = getSiteConfigResult();
  const nav = getNav();
  const cities = getCities();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID?.trim() || site.analytics.ga4.trim();

  return (
    <html lang="en-US" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-M8V457FF"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());",
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {!isValid && process.env.NODE_ENV !== "production" ? (
          <div
            role="status"
            style={{
              backgroundColor: "#FEF3C7",
              color: "#78350F",
              padding: "8px 16px",
              fontSize: "0.875rem",
              borderBottom: "1px solid #F59E0B",
              textAlign: "center",
            }}
          >
            <strong>Dev Config TODO:</strong> Populate{" "}
            <code>data/site.json</code> ({missingFields.map((f) => f.path).join(", ")}) before
            running a production build.
          </div>
        ) : null}

        <UtilityBar site={site} />
        <Header site={site} nav={nav} cities={cities} initialStatus={initialStatus} />

        <main id="main-content">{children}</main>

        <Footer site={site} nav={nav} cities={cities} />

        <StickyCallBar display={site.phone.display} e164={site.phone.e164} />
        <FloatingCallPill display={site.phone.display} e164={site.phone.e164} />
        <CallTracker />

        <JsonLd data={buildOrganizationSchema(site, siteUrl)} />
        <JsonLd data={buildWebSiteSchema(site, siteUrl)} />

        {ga4Id ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${ga4Id}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
