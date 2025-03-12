
import React from 'react';
import FadeIn from './animations/FadeIn';
import { XCircle } from 'lucide-react';

const painPoints = [
  {
    title: "No real insights on safety & crime",
    description: "Traditional platforms don't tell you if an area is actually safe to live in."
  },
  {
    title: "No vibe or lifestyle filtering",
    description: "Can't search based on the community feel or lifestyle preferences that matter to you."
  },
  {
    title: "Difficult to compare schools & transport",
    description: "School catchment areas and commute times are hard to evaluate across neighborhoods."
  },
  {
    title: "No future property value predictions",
    description: "Missing crucial data on which areas are likely to appreciate in the coming years."
  }
];

const ProblemSection: React.FC = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
              <span className="text-sm font-medium text-posh-green">The Problem</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Why Traditional Property Search Fails
            </h2>
            <p className="text-lg text-posh-dark/80">
              Tired of generic property listings? Buying a home is more than just price – it's about safety, lifestyle, and future value. Existing platforms only show houses, not the neighborhoods that matter most to you.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {painPoints.map((point, index) => (
            <FadeIn 
              key={index} 
              delay={index === 0 ? "delay-0" : 
                     index === 1 ? "delay-200" : 
                     index === 2 ? "delay-400" : 
                     "delay-600"}
            >
              <div className="bg-white p-8 rounded-2xl shadow-feature flex items-start space-x-4">
                <div className="shrink-0">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{point.title}</h3>
                  <p className="text-posh-dark/70">{point.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
