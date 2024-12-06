import AOSWrapper from "./components/AOSWrapper";
import Header from "./components/layout/Header";
import HeroSlider from "./components/home/HeroSlider";
import CTA from "./components/home/CTA";
import AboutSection from "./components/home/AboutSection";
import VideoCTA from "./components/home/VideoCTA";
import TestimonialsSection from "./components/home/TestimonialsSection";
import ServicesSection from "./components/home/ServicesSection";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <AOSWrapper>
      <Header />
      <HeroSlider />
      <AboutSection />
      <VideoCTA />
      <ServicesSection />
      <CTA />
      <TestimonialsSection />
      {/* <InstagramFeed /> */}
      <Footer />
    </AOSWrapper>
  );
}
