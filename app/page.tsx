'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Preloader from './components/common/Preloader';

// Dynamically import components with loading state
const AOSWrapper = dynamic(() => import('./components/AOSWrapper'));
const Header = dynamic(() => import('./components/layout/Header'));
const HeroSlider = dynamic(() => import('./components/home/HeroSlider'));
const AboutSection = dynamic(() => import('./components/home/AboutSection'));
const VideoCTA = dynamic(() => import('./components/home/VideoCTA'));
const ServicesSection = dynamic(() => import('./components/home/ServicesSection'));
const CTA = dynamic(() => import('./components/home/CTA'));
const TestimonialsSection = dynamic(() => import('./components/home/TestimonialsSection'));
const GallerySection = dynamic(() => import('./components/home/GallerySection'));
const Footer = dynamic(() => import('./components/layout/Footer'));

export default function Home() {
  return (
    <>
      <Preloader />
      <Suspense>
        <AOSWrapper>
          <Header />
          <HeroSlider />
          <AboutSection />
          <VideoCTA />
          <ServicesSection />
          <CTA />
          <TestimonialsSection />
          <GallerySection />
          <Footer />
        </AOSWrapper>
      </Suspense>
    </>
  );
}
