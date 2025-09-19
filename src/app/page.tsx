import HeroCarousel from './components/HeroCarousel';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ServicesOverview from './components/ServicesOverview';
import RecentWork from './components/RecentWork';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <div className="pt-20 md:pt-24">
        <HeroCarousel />
      </div>

      {/* Services Overview Section */}
      <ServicesOverview />

      {/* Recent Work Section */}
      <RecentWork />

      {/* Services Strip */}
      {/* <ServicesStrip /> */}

      <Footer />
    </div>
  );
}