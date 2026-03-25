import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "dental",
    "AI",
    "artificial intelligence",
    "dentistry",
    "dental care",
    "InnoDent",
  ],
  authors: [
    {
      name: siteConfig.creator,
    },
  ],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@innodent",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <TopBar
          leftText = "innodent.korea@gmail.com"
          rightText = "5F 514, 15, Haeyang 3-ro, Sangnok-gu, Ansan-si, Gyeonggi-do, Korea"/>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <TopBar
          leftText={
            <>
              &copy; <span className="font-bold">2026</span> Innodent • Developed by Neovaly
            </>
          }
        />
      </body>
    </html>
  );
}
