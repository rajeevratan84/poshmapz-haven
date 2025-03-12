
import React from 'react';
import FadeIn from './animations/FadeIn';
import { Database, UserCheck, Brain } from 'lucide-react';

const TrustSection: React.FC = () => {
  return (
    <section className="section-padding bg-green-50">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-white rounded-full">
              <span className="text-sm font-medium text-posh-green">Why Trust Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Data-Driven Insights You Can Rely On
            </h2>
            <p className="text-lg text-posh-dark/80">
              Posh Maps combines multiple trusted data sources with AI analysis to deliver accurate, comprehensive insights.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FadeIn delay="delay-0">
            <div className="bg-white p-8 rounded-2xl shadow-feature flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-green-50 rounded-full">
                <Database className="h-8 w-8 text-posh-green" />
              </div>
              <h3 className="font-semibold text-xl mb-4">Data-Backed Insights</h3>
              <p className="text-posh-dark/70">
                We use government data, property records, and official statistics to ensure our insights are factual and reliable.
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay="delay-200">
            <div className="bg-white p-8 rounded-2xl shadow-feature flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-green-50 rounded-full">
                <UserCheck className="h-8 w-8 text-posh-green" />
              </div>
              <h3 className="font-semibold text-xl mb-4">Verified Reviews</h3>
              <p className="text-posh-dark/70">
                Our community reviews come from verified residents who provide authentic perspectives on neighborhood life.
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay="delay-400">
            <div className="bg-white p-8 rounded-2xl shadow-feature flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-green-50 rounded-full">
                <Brain className="h-8 w-8 text-posh-green" />
              </div>
              <h3 className="font-semibold text-xl mb-4">AI Predictive Analysis</h3>
              <p className="text-posh-dark/70">
                Our machine learning algorithms analyze trends and patterns to provide accurate future value predictions.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-16">
          <div className="bg-white py-8 px-10 rounded-2xl shadow-feature max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="font-semibold text-xl">Trusted Data Providers</h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {['Police.uk', 'Transport for London', 'Ofsted', 'Land Registry', 'Google Maps'].map((provider) => (
                <div key={provider} className="text-posh-dark/60 font-medium">
                  {provider}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TrustSection;
