
import React, { useEffect, useCallback, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import FeaturesSection from '@/components/FeaturesSection';
import SearchExampleSection from '@/components/SearchExampleSection';

// Lazy load components that are lower in the page
const TrustSection = lazy(() => import('@/components/TrustSection'));
const HowItWorks = lazy(() => import('@/components/HowItWorks'));
const TestimonialSection = lazy(() => import('@/components/TestimonialSection'));
const TeamSection = lazy(() => import('@/components/TeamSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback
const SectionLoader = () => (
  <div className="w-full py-20 flex justify-center items-center">
    <div className="w-8 h-8 border-2 border-posh-green border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
        <Suspense fallback={<SectionLoader />}>
          <HowItWorks />
          <TeamSection />
          <TrustSection />
          <TestimonialSection />
          <CTASection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
