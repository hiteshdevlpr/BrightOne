import type { Metadata } from "next";
import { League_Spartan, Abril_Fatface, Montserrat } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-league-spartan"
});

const abrilFatface = Abril_Fatface({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-abril-fatface"
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "BrightOne Inc - Professional Real Estate Photography & Virtual Services",
  description: "Premium real estate photography, videography, 3D tours, and virtual staging services for real estate agents and property owners in Canada.",
  keywords: "real estate photography, real estate videography, 3D tours, virtual staging, real estate marketing, property photography",
  authors: [{ name: "BrightOne Inc" }],
  openGraph: {
    title: "BrightOne Inc - Professional Real Estate Services",
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
      <body className={`${leagueSpartan.className} ${leagueSpartan.variable} ${abrilFatface.variable} ${montserrat.variable}`}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
