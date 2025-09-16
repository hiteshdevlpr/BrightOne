import AnimatedHeroText from './components/AnimatedHeroText';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ServicesOverview from './components/ServicesOverview';
import RecentWork from './components/RecentWork';
import ServicesStrip from './components/ServicesStrip';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br overflow-hidden from-blue-50 to-purple-50 min-h-screen">
        <div className="absolute inset-0">
          <video src="/videos/hero-bg.mp4" autoPlay muted loop className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <AnimatedHeroText />
      </section>

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