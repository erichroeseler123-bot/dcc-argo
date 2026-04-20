import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { buildMetadata } from "@/lib/seo";
import { SITE, getBaseUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: SITE.defaultTitle,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  applicationName: SITE.name,
  category: "travel",
  openGraph: buildMetadata({
    title: SITE.defaultTitle,
    description: SITE.description,
    path: "/",
  }).openGraph,
  twitter: buildMetadata({
    title: SITE.defaultTitle,
    description: SITE.description,
    path: "/",
  }).twitter,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <SiteHeader />
          <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
