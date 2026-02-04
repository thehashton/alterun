import type { Metadata } from "next";
import { Cinzel, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { HeaderBorderButton } from "@/components/HeaderBorderButton";

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
      <body className="min-h-screen flex flex-col">
        <Header user={user} />
        <HeaderBorderButton />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
