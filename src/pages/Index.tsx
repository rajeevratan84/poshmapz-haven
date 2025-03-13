
import React, { useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import FeaturesSection from '@/components/FeaturesSection';
import SearchExampleSection from '@/components/SearchExampleSection';
import TrustSection from '@/components/TrustSection';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import TeamSection from '@/components/TeamSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  const handleAnchorClick = useCallback((e: MouseEvent) => {
    // Only run this in browser environment
    if (typeof window === 'undefined') return;
    
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin + anchor.pathname === window.location.origin + window.location.pathname) {
      e.preventDefault();
      
      const targetElement = document.querySelector(anchor.hash);
      if (targetElement) {
        const navbarHeight = 80; // Approximately the height of the navbar
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Optionally update URL
        history.pushState(null, '', anchor.hash);
      }
    }
  }, []);
  
  useEffect(() => {
    // Only run this in browser environment
    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleAnchorClick);
      
      return () => {
        document.removeEventListener('click', handleAnchorClick);
      };
    }
  }, [handleAnchorClick]);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <SearchExampleSection />
        <HowItWorks />
        <TeamSection />
        <TrustSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
