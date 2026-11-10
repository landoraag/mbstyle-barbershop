import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Barbearia em Itapeva`,
    template: `%s · ${site.name}`,
  },
  description: `${site.tagline}. Barbearia em Itapeva-SP. Escolha seu barbeiro e agende online. ${site.address.street}, ${site.address.district}.`,
  icons: { icon: "/brand/icon.svg" },
  openGraph: {
    title: `${site.name} — Barbearia em Itapeva`,
    description: site.slogan,
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..700&family=Manrope:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
