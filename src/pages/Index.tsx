
import React, { useEffect, useCallback, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import FeaturesSection from '@/components/FeaturesSection';
import SearchExampleSection from '@/components/SearchExampleSection';

// Prefetch these components so they load faster when needed
const HowItWorks = lazy(() => import('@/components/HowItWorks'));
const TeamSection = lazy(() => import('@/components/TeamSection'));

// Lazy load components that are lower in the page with more delay
const TrustSection = lazy(() => {
  // Add a small delay to prioritize more important components
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/components/TrustSection')), 300);
  });
});
const TestimonialSection = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/components/TestimonialSection')), 300);
  });
});
const CTASection = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/components/CTASection')), 300);
  });
});
const Footer = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/components/Footer')), 300);
  });
});

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
      
      // Preload important images
      const preloadImages = [
        'https://images.unsplash.com/photo-1543872084-c7bd3822856f',
        'https://images.unsplash.com/photo-1580359179460-0bfa067096e5'
      ];
      
      preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
      
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
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TrustSection />
          <TestimonialSection />
        </Suspense>
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
