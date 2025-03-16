
import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import ScrollAnimation from './animations/ScrollAnimation';

const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="section-padding bg-gradient-to-br from-charcoal to-navy/80 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <ScrollAnimation type="fade-up" className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4 px-3 py-1 bg-coral/20 rounded-full">
            <span className="text-sm font-medium text-coral">The Problem</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
            Why Traditional Property Search Fails
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Finding the right place to live or invest can be overwhelming. Platforms like Rightmove or Zoopla offer basic property listings, but insights—like crime trends, school rankings, and future growth forecasts—are scattered across multiple sites. This results in guesswork, missed opportunities, and uncertainty.
          </p>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollAnimation type="fade-up" delay={300}>
            <div className="bg-light-bg p-8 rounded-2xl shadow-feature border border-white/5 h-full">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-white">Current Property Search</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80">Multiple websites needed for complete research</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80">No way to compare area "vibes" or neighborhood culture</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80">Outdated or incomplete data on important factors</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80">No AI-powered predictions for future area changes</span>
                </li>
              </ul>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={500}>
            <div className="bg-light-bg p-8 rounded-2xl shadow-feature border-2 border-coral/20 h-full">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-coral" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-white">The PoshMaps Solution</h3>
              <p className="text-white/80 mb-6">
                PoshMaps consolidates all those disparate data sources into one visually interactive map. Our AI-powered system forecasts neighbourhood desirability and future property value, giving you real-time insights and predictive analytics—plus features like a 'posh index', heatmaps, and user-generated reviews.
              </p>
              <p className="text-white/80 font-medium">
                Most importantly, we help you <span className="text-coral font-medium">understand the unique "vibe" of each area</span> so you can find the perfect match for your lifestyle and preferences.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
