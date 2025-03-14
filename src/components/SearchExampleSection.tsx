
import React from 'react';
import { MapPin, Gauge, Train, Footprints, MessageCircle, TrendingUp, Award, Sliders } from 'lucide-react';
import GoogleMap from './GoogleMap';
import ScrollAnimation from './animations/ScrollAnimation';

const SearchExampleSection: React.FC = () => {
  const iconColor = "#FF7F50"; // Coral color for icons
  
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimation type="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
            <span className="text-sm font-medium text-posh-green">See It In Action</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            What Posh Maps Reveals About an Area
          </h2>
          <p className="text-lg text-posh-dark/80">
            Here's a real example of the rich insights you'll get about any neighborhood with our AI-powered platform.
          </p>
        </ScrollAnimation>

        <div className="max-w-5xl mx-auto">
          <ScrollAnimation type="fade-up" delay={200}>
            <div className="relative bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-sm font-semibold z-10">
                Richmond, London
              </div>
              
              <div className="h-[400px] md:h-[500px] relative">
                <GoogleMap address="Richmond, London, UK" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                <ScrollAnimation type="fade-up" delay={300} className="flex items-start space-x-3">
                  <Award className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">PoshMap Index</h3>
                    <p className="text-posh-dark/70">
                      <span className="text-lg font-bold text-posh-green">91%</span> - Excellent area rating
                    </p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation type="fade-up" delay={400} className="flex items-start space-x-3">
                  <Gauge className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">Crime Rate</h3>
                    <p className="text-posh-dark/70">Low - 20% below London average</p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation type="fade-up" delay={500} className="flex items-start space-x-3">
                  <Train className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">Transport Score</h3>
                    <p className="text-posh-dark/70">Excellent - 30 min to central London</p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation type="fade-up" delay={600} className="flex items-start space-x-3">
                  <Footprints className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">Walkability</h3>
                    <p className="text-posh-dark/70">Very Walkable - 85/100</p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation type="fade-up" delay={700} className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">Future Property Growth</h3>
                    <p className="text-posh-dark/70">Flats: +2.5% over 5 years, Houses: +3% over 5 years</p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation type="fade-up" delay={800} className="flex items-start space-x-3">
                  <Sliders className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">Custom Metrics</h3>
                    <p className="text-posh-dark/70">Personalized for your unique preferences</p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation type="fade-up" delay={900} className="flex items-start space-x-3 md:col-span-3">
                  <MessageCircle className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">Local Reviews</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src="https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257" 
                        alt="Local resident" 
                        className="w-8 h-8 rounded-full object-cover"
                        loading="lazy"
                      />
                      <span className="text-sm font-medium">Sarah, local resident</span>
                    </div>
                    <p className="text-posh-dark/70">"Great community with excellent parks and riverside walks. Family-friendly with good schools. Can be busy during weekends."</p>
                  </div>
                </ScrollAnimation>
              </div>
              
              <div className="bg-green-50 p-6 border-t border-green-100">
                <div className="text-center">
                  <h3 className="font-semibold text-posh-green mb-3">Custom Metrics Based on Your Personal Preferences</h3>
                  <p className="text-sm text-posh-dark/80 max-w-2xl mx-auto">
                    PoshMaps can create unique, personalized metrics tailored specifically to your lifestyle. 
                    Whether you need proximity to specific amenities, care about particular school rankings, 
                    or have unique requirements, our AI will rank areas according to what matters most to you.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default SearchExampleSection;
