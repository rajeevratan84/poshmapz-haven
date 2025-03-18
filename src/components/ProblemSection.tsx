
import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import ScrollAnimation from './animations/ScrollAnimation';

const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="section-padding bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <ScrollAnimation type="fade-up" className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4 px-3 py-1 bg-green-50/20 rounded-full">
            <span className="text-sm font-medium text-posh-green">The Problem</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
            Why Traditional Property Search Fails
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Finding the right place to live or invest can be overwhelming. Current platforms lack comprehensive data and real insights about neighborhoods.
          </p>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollAnimation type="fade-up" delay={300}>
            <div className="bg-black/60 border border-white/10 p-8 rounded-2xl shadow-feature h-full">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-white">Current Property Search</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80"><strong>Multiple websites needed</strong> for complete research on schools, crime, and transport</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80"><strong>Impossible to visit all areas</strong> to determine if they truly fit your lifestyle</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80"><strong>Complex data interpretation</strong> that doesn't paint the full picture of an area</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80">No way to understand the true <strong>neighborhood culture and community</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <span className="text-white/80">Lack of <strong>AI-powered predictions</strong> for future area changes</span>
                </li>
              </ul>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={500}>
            <div className="bg-black/60 p-8 rounded-2xl shadow-feature border-2 border-[#ea384c]/20 h-full">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-posh-green/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-posh-green" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-white">The PoshMaps Solution</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-posh-green" />
                  <span>
                    <strong className="text-posh-green">All-in-one platform</strong> consolidating property data, area insights, and predictive analytics
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-posh-green" />
                  <span>
                    <strong className="text-posh-green">AI-powered forecasting</strong> for neighborhood desirability and property values
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-posh-green" />
                  <span>
                    <strong className="text-posh-green">Interactive visualization</strong> with heatmaps and custom scoring
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-posh-green" />
                  <span>
                    <strong className="text-posh-green">Community insights</strong> through user reviews and local perspectives
                  </span>
                </li>
              </ul>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
