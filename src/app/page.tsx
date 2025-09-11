import AnimatedHeroText from './components/AnimatedHeroText';
import ServiceCarousel from './components/ServiceCarousel';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br h-screen overflow-hidden from-blue-50 to-purple-50">
        <div className="bg-video">
          <video src="/videos/hero-bg.mp4" autoPlay muted loop className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-65"></div>
        </div>
        <AnimatedHeroText />
      </section>

      {/* Service Carousel */}
      <div className="">
        <ServiceCarousel />
      </div>

      <Footer />
    </div>
  );
}