
import React from 'react';
import { XCircle } from 'lucide-react';
import ScrollAnimation from './animations/ScrollAnimation';

const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="section-padding bg-gray-50">
      <div className="container mx-auto px-6">
        <ScrollAnimation type="fade-up" className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
            <span className="text-sm font-medium text-posh-green">The Problem</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Why Traditional Property Search Fails
          </h2>
          <p className="text-lg text-posh-dark/80 max-w-2xl mx-auto">
            Finding the right place to live or invest can be overwhelming. Platforms like Rightmove or Zoopla offer basic property listings, but insights—like crime trends, school rankings, and future growth forecasts—are scattered across multiple sites. This results in guesswork, missed opportunities, and uncertainty.
          </p>
        </ScrollAnimation>

        <ScrollAnimation type="fade-up" delay={300} className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-feature">
            <h3 className="text-2xl font-semibold mb-6">Solution: Comprehensive, Data-Rich Property Analysis</h3>
            <p className="text-posh-dark/80 mb-4">
              PoshMaps consolidates all those disparate data sources into one visually interactive map. Our AI-powered system forecasts neighbourhood desirability and future property value, giving you real-time insights and predictive analytics—plus features like a 'posh index', heatmaps, and user-generated reviews.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default ProblemSection;
