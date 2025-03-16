
import React from 'react';
import { MapPin, Gauge, Train, Footprints, MessageCircle, TrendingUp, Award, Sliders, Coffee, Beer, Building, Smile } from 'lucide-react';
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
            Here's a real example of the rich insights you'll get about any neighborhood with our AI-powered platform, designed to help you <span className="text-gold font-medium">find the perfect area vibe</span> that matches your preferences.
          </p>
        </ScrollAnimation>

        <div id="richmond-example" className="max-w-5xl mx-auto">
          <ScrollAnimation type="fade-up" delay={200}>
            <div className="relative bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-sm font-semibold z-10 flex items-center">
                <MapPin className="h-4 w-4 text-gold mr-1" />
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
                    <p className="text-posh-dark/70">
                      Flats: +2.5% over 5 years better than 57% of London
                      <br />
                      Houses: +3% over 5 years better than 42% of London
                    </p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation type="fade-up" delay={800} className="flex items-start space-x-3">
                  <Smile className="h-6 w-6 shrink-0 mt-1" style={{ color: iconColor }} />
                  <div>
                    <h3 className="font-semibold mb-1">Area Vibe</h3>
                    <p className="text-posh-dark/70">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">Family-friendly</span>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">Upscale</span>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Riverside</span>
                    </p>
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
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-t border-green-100">
                <div className="text-center">
                  <h3 className="font-semibold text-posh-green mb-3">Find Your Perfect Neighborhood Vibe</h3>
                  <p className="text-sm text-posh-dark/80 max-w-2xl mx-auto">
                    PoshMaps creates a unique "vibe profile" for each area based on local amenities, community characteristics, 
                    and resident reviews. Whether you're seeking a trendy urban hotspot, a family-friendly suburb, 
                    or a quiet village atmosphere, we'll help you find the perfect match for your lifestyle.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <ScrollAnimation type="fade-up" delay={300} className="col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-40 relative">
              <img 
                src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be" 
                alt="London row houses" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-4">Classic London Terraces</p>
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation type="fade-up" delay={400} className="col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-40 relative">
              <img 
                src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8" 
                alt="British countryside" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-4">Peaceful Village Green</p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default SearchExampleSection;
