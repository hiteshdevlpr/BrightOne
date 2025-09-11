import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-league-spartan"
});

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
      <body className={`${leagueSpartan.className} ${leagueSpartan.variable}`}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
