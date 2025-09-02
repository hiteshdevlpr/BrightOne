import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrightOne.ca - Professional Real Estate Photography & Virtual Services",
  description: "Premium real estate photography, videography, 3D tours, and virtual staging services for real estate agents and property owners in Canada.",
  keywords: "real estate photography, real estate videography, 3D tours, virtual staging, real estate marketing, property photography",
  authors: [{ name: "BrightOne.ca" }],
  openGraph: {
    title: "BrightOne.ca - Professional Real Estate Services",
    description: "Premium real estate photography, videography, 3D tours, and virtual staging services",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
