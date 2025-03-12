
import React from 'react';
import FadeIn from './animations/FadeIn';
import { MapPin, Gauge, Train, Footprints, MessageCircle, TrendingUp } from 'lucide-react';

const SearchExampleSection: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
              <span className="text-sm font-medium text-posh-green">See It In Action</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              What Posh Maps Reveals About an Area
            </h2>
            <p className="text-lg text-posh-dark/80">
              Here's a real example of the rich insights you'll get about any neighborhood with our AI-powered platform.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="relative bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-sm font-semibold z-10">
                Richmond, London
              </div>
              
              <div className="h-[400px] md:h-[500px] bg-green-100 relative">
                {/* This would be an interactive map in the real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-posh-green/40" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                <div className="flex items-start space-x-3">
                  <Gauge className="h-6 w-6 text-posh-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Crime Rate</h3>
                    <p className="text-posh-dark/70">Low - 20% below London average</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Train className="h-6 w-6 text-posh-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Transport Score</h3>
                    <p className="text-posh-dark/70">Excellent - 30 min to central London</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Footprints className="h-6 w-6 text-posh-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Walkability</h3>
                    <p className="text-posh-dark/70">Very Walkable - 85/100</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:col-span-2">
                  <MessageCircle className="h-6 w-6 text-posh-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Local Reviews</h3>
                    <p className="text-posh-dark/70">"Great community with excellent parks and riverside walks. Family-friendly with good schools. Can be busy during weekends."</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-posh-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Future Property Growth</h3>
                    <p className="text-posh-dark/70">+7% value increase predicted</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default SearchExampleSection;
