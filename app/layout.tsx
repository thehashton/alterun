import type { Metadata } from "next";
import { Cinzel, Crimson_Pro } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { HeaderBorderButton } from "@/components/HeaderBorderButton";
import { Footer } from "@/components/Footer";
import headerBgImg from "@/images/alterun-header-bg.png";
import headerBorderImg from "@/images/alterun-header-border.png";
import headerTopBorderImg from "@/images/alterun-top-border.png";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Crimson_Pro({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alterun",
  description: "The world of Alterun — blog, chronicles, and codex.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="preload" as="image" href={headerBorderImg.src} />
        <link rel="preload" as="image" href={headerBgImg.src} />
        <link rel="preload" as="image" href={headerTopBorderImg.src} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header user={user} />
        <HeaderBorderButton />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "!bg-alterun-bg-card !border-alterun-gold/40 !text-alterun-muted",
              title: "!text-alterun-gold font-display uppercase tracking-wider",
              description: "!text-alterun-muted",
              success: "!border-alterun-gold/50",
              error: "!border-red-500/50 !text-red-400",
            },
          }}
        />
      </body>
    </html>
  );
}
