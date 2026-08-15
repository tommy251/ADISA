import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site/SiteShell";
import AdisaPreloader from "@/components/ui/adisa-preloader";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ADISA ·Àdísà· — Men's Shoes, Fairly Priced",
  description:
    "ADISA brings premium men's shoes to Nigeria at a fair price. Sneakers, formal, boots, loafers — ₦20,000–35,000 only. Card and crypto checkout. Named for Darosa, who gave freely.",
  keywords: [
    "men shoes Nigeria",
    "ADISA",
    "sneakers Lagos",
    "formal shoes",
    "boots",
    "loafers",
    "dropship shoes",
    "pay with card",
    "pay with crypto",
  ],
  openGraph: {
    title: "ADISA ·Àdísà· — Men's Shoes, Fairly Priced",
    description: "Premium men's shoes delivered across Nigeria, ₦20k–35k only.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AdisaPreloader />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
