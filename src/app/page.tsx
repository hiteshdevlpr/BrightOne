import HeroCarousel from './components/HeroCarousel';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ServicesOverview from './components/ServicesOverview';
import RecentWork from './components/RecentWork';
import FAQSection from './components/FAQSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "BrightOne Inc - Professional Real Estate Photography & Virtual Services | GTA",
  description: "Premium real estate photography, videography, 3D tours, and virtual staging services for real estate agents and property owners in Canada. Serving Greater Toronto Area and surrounding regions.",
  keywords: "real estate photography, real estate videography, 3D tours, virtual staging, real estate marketing, property photography, GTA photography, professional property photos, drone photography, floor plans",
  openGraph: {
    title: "BrightOne Inc - Professional Real Estate Photography & Virtual Services | GTA",
    description: "Premium real estate photography, videography, 3D tours, and virtual staging services for real estate agents and property owners in Canada. Serving Greater Toronto Area and surrounding regions.",
    type: "website",
    url: "https://brightone.ca",
    images: [
      {
        url: "/meta-header.png",
        width: 1200,
        height: 630,
        alt: "BrightOne Inc - Professional Real Estate Photography & Virtual Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrightOne Inc - Professional Real Estate Photography & Virtual Services | GTA",
    description: "Premium real estate photography, videography, 3D tours, and virtual staging services for real estate agents and property owners in Canada. Serving Greater Toronto Area and surrounding regions.",
    images: ["/meta-header.png"],
  },
  alternates: {
    canonical: "https://brightone.ca",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <main>
        <section className="pt-20 md:pt-24" aria-label="Hero section">
          <HeroCarousel />
        </section>

        {/* Services Overview Section */}
        <section aria-label="Our services">
          <ServicesOverview />
        </section>

        {/* Recent Work Section */}
        <section aria-label="Recent work portfolio">
          <RecentWork />
        </section>

        {/* FAQ Section */}
        <section aria-label="Frequently asked questions">
          <FAQSection />
        </section>

        {/* Services Strip */}
        {/* <ServicesStrip /> */}
      </main>

      <Footer />
    </div>
  );
}