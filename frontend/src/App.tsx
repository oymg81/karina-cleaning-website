
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BusinessHours from './components/BusinessHours';
import Services from './components/Services';
import About from './components/About';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <BusinessHours />
        <Services />
        <About />
        <CtaSection />
      </main>
      
      <Footer />

      <WhatsAppFloatingButton />
    </div>
  );
}

export default App;
