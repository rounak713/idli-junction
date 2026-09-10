import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/FloatingActions';
import Hero from '../components/sections/Hero';
import Menu from '../components/sections/Menu';
import About from '../components/sections/About';
import Gallery from '../components/sections/Gallery';
import Franchise from '../components/sections/Franchise';
import Contact from '../components/sections/Contact';
import useScrollReveal from '../hooks/useScrollReveal';

const PublicLayout = () => {
  // Run once at layout level so every .reveal element animates on scroll
  useScrollReveal();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Menu />
        <Gallery />
        <About />
        <Franchise />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default PublicLayout;
