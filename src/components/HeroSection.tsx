
import React from 'react';
import { Button } from "@/components/ui/button";
import MapVisualization from "./MapVisualization";
import FadeIn from "./animations/FadeIn";
import { Map, Compass, Zap } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hero-gradient z-0"></div>
      <div className="absolute inset-0 opacity-20 z-0">
        <MapVisualization />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <FadeIn delay="delay-0">
            <div className="inline-block mb-4 px-3 py-1 bg-posh-green/10 rounded-full">
              <span className="text-sm font-medium text-posh-green">Intelligent mapping for modern businesses</span>
            </div>
          </FadeIn>
          
          <FadeIn delay="delay-200">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-balance">
              Transform Your World with <span className="text-gradient">AI-Powered Maps</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay="delay-400">
            <p className="text-lg md:text-xl text-posh-dark/80 mb-8 text-balance max-w-2xl mx-auto">
              Discover breakthrough location intelligence with PoshMaps — where precision meets elegance in an intuitive mapping platform designed for the future.
            </p>
          </FadeIn>
          
          <FadeIn delay="delay-600">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button className="w-full sm:w-auto bg-posh-green hover:bg-green-500 text-white rounded-full px-8 py-6 text-base">
                Get Started — It's Free
              </Button>
              <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base">
                Watch Demo
              </Button>
            </div>
          </FadeIn>
        </div>
        
        <FadeIn delay="delay-800" className="max-w-4xl mx-auto">
          <div className="relative w-full h-[360px] md:h-[480px] rounded-2xl overflow-hidden shadow-glass bg-white/20 backdrop-blur-xs">
            <div className="absolute inset-0 flex items-center justify-center">
              <Map className="w-20 h-20 text-posh-green/40 animate-pulse-subtle" />
            </div>
            <div className="absolute top-4 left-4 glass-panel px-3 py-2 rounded-lg flex items-center space-x-2">
              <Compass className="w-4 h-4 text-posh-green" />
              <span className="text-xs font-medium">Intelligent Navigation</span>
            </div>
            <div className="absolute bottom-4 right-4 glass-panel px-3 py-2 rounded-lg flex items-center space-x-2">
              <Zap className="w-4 h-4 text-posh-green" />
              <span className="text-xs font-medium">Powered by AI</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay="delay-800" className="mt-16 text-center">
          <p className="text-sm text-posh-dark/60 mb-6">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Microsoft', 'Adobe', 'Shopify', 'Slack', 'Uber'].map((company) => (
              <div key={company} className="text-posh-dark/40 font-display font-medium text-lg">
                {company}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
