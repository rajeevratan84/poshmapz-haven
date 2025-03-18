import React, { useEffect, useCallback, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import FeaturesSection from '@/components/FeaturesSection';
import SearchExampleSection from '@/components/SearchExampleSection';
import TeamSection from '@/components/TeamSection';

// Lazy load components that are lower in the page
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback - simplified for better performance
const SectionLoader = () => (
  <div className="w-full py-12 flex justify-center items-center">
    <div className="w-6 h-6 border-2 border-posh-green border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  // Enhanced scroll handler with better performance
  const handleAnchorClick = useCallback((e: MouseEvent) => {
    if (typeof window === 'undefined') return;
    
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin + anchor.pathname === window.location.origin + window.location.pathname) {
      e.preventDefault();
      
      const targetElement = document.querySelector(anchor.hash);
      if (targetElement) {
        const navbarHeight = 80; 
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Using replaceState instead of pushState for better performance
        history.replaceState(null, '', anchor.hash);
      }
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use passive listener for better scroll performance
      document.addEventListener('click', handleAnchorClick, { passive: false });
      
      return () => {
        document.removeEventListener('click', handleAnchorClick);
      };
    }
  }, [handleAnchorClick]);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="space-y-8">
        <HeroSection />
        <SearchExampleSection />
        <ProblemSection />
        <FeaturesSection />
        <TeamSection />
        <Suspense fallback={<SectionLoader />}>
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
