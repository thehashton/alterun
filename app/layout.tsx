import type { Metadata } from "next";
import { Cinzel, Crimson_Pro } from "next/font/google";
import "./globals.css";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <HeaderBorderButton />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
