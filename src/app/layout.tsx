import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrightOne Creative | Real Estate Media & Personal Branding | Durham Region",
  description: "Professional real estate photography, videography, and personal branding services in the Greater Toronto Area. HDR photography, cinematic video tours, drone aerials, virtual staging, and social media content.",
  keywords: "real estate photography, property photography, real estate videography, drone photography, virtual staging, personal branding, headshots, Toronto real estate photography, GTA photography, listing photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
