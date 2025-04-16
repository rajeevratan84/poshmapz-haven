
import React, { useEffect, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import FeaturesSection from '@/components/FeaturesSection';
import SearchExampleSection from '@/components/SearchExampleSection';
import TeamSection from '@/components/TeamSection';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

// Lazy load components that are lower in the page
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback - simplified for better performance
const SectionLoader = () => (
  <div className="w-full py-6 flex justify-center items-center">
    <div className="w-5 h-5 border-2 border-posh-green border-t-transparent rounded-full animate-spin"></div>
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
      <main className="space-y-0">
        <HeroSection />
        
        {/* New prominent postcode search link */}
        <div className="bg-gradient-to-r from-blue-600 to-coral py-8 px-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
              Discover How Posh Your Postcode Is
            </h2>
            <Link to="/postcode">
              <Button size="xl" variant="glow" className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Check Your Postcode Now</span>
              </Button>
            </Link>
          </div>
        </div>
        
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
