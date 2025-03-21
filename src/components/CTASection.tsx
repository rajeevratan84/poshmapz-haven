
import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from './animations/FadeIn';

const CTASection: React.FC = () => {
  return (
    <section id="cta" className="section-padding bg-[#F5F7FA]">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="bg-gradient-to-br from-coral/80 to-coral rounded-3xl py-16 px-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-5" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
                Ready to Find Your Perfect Neighbourhood?
              </h2>
              <p className="text-lg text-white/90 mb-8 md:max-w-xl mx-auto">
                Explore our interactive demo to see what PoshMaps can do for you. Use our AI-powered search to discover your ideal location.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/demo"
                  className="bg-white text-coral font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Try Interactive Demo
                </Link>
                <a 
                  href="#"
                  className="bg-transparent border-2 border-white text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CTASection;
