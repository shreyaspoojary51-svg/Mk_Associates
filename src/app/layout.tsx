import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import MarketingOnly from "@/components/layout/MarketingOnly";
import Footer from "@/components/layout/Footer";
import Concierge from "@/components/layout/Concierge";
import DeferredMotion from "@/components/DeferredMotion";
import "./globals.css";
const serif = localFont({
  src: [
    {
      path: "../../public/fonts/instrument-serif.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/instrument-serif-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
const sans = localFont({
  src: "../../public/fonts/dm-sans.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 1000",
});
const site =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const launchReady =
  process.env.NEXT_PUBLIC_LAUNCH_READY === "true" &&
  site.startsWith("https://") &&
  !["localhost", "127.0.0.1"].includes(new URL(site).hostname);
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "MK Associates | Interior Architecture, Mumbai",
    template: "%s | MK Associates",
  },
  description:
    "Thoughtful homes and workspaces by Mahindra & Kunal in Andheri West, Mumbai. Explore our approach and plan a free design consultation.",
  robots: launchReady
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "MK Associates",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MarketingOnly>
          <Header />
        </MarketingOnly>
        {launchReady && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "MK Associates",
                url: site,
                description:
                  "Interior architecture studio led by Mahindra and Kunal in Andheri West, Mumbai.",
                areaServed: { "@type": "City", name: "Mumbai" },
              }).replace(/</g, "\\u003c"),
            }}
          />
        )}
        <main id="main">{children}</main>
        <MarketingOnly>
          <Footer />
        </MarketingOnly>
        <Concierge />
        <DeferredMotion />
      </body>
    </html>
  );
}
