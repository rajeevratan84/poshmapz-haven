
import React from 'react';
import FadeIn from './animations/FadeIn';
import { 
  Map, 
  Building, 
  Search, 
  Navigation, 
  TrendingUp, 
  ShieldCheck, 
  GraduationCap, 
  Zap,
  Users,
  Code
} from 'lucide-react';

const features = [
  {
    icon: <Map className="h-6 w-6 text-posh-green" />,
    title: "Unified Neighbourhood Data",
    description: "Crime rates, school performance, transport links, demographics—all in one place."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-posh-green" />,
    title: "AI-Driven Predictions",
    description: "Forecast property value growth and emerging trends in your target areas."
  },
  {
    icon: <Building className="h-6 w-6 text-posh-green" />,
    title: "Custom Scores & Vibe Check",
    description: "Personalised ratings and a 'local vibe score' to quickly compare areas."
  },
  {
    icon: <Code className="h-6 w-6 text-posh-green" />,
    title: "Future Integrations",
    description: "Planned API links with Rightmove, Zoopla, and councils, plus advanced filters."
  },
  {
    icon: <Users className="h-6 w-6 text-posh-green" />,
    title: "Community Engagement",
    description: "Crowd-sourced reviews, Q&A, and photos for real neighbourhood insights."
  }
];

const audienceSegments = [
  {
    title: "For Homebuyers & Renters",
    benefits: [
      "Compare areas quickly and make informed decisions",
      "Save time by accessing multiple data sources in one place", 
      "Get reliable real-time insights on neighborhood safety and quality"
    ]
  },
  {
    title: "For Property Investors",
    benefits: [
      "Identify undervalued areas with growth potential",
      "Reduce risk with data-backed analysis",
      "Expand portfolios confidently with predictive insights"
    ]
  },
  {
    title: "For Strategic Partners & Councils",
    benefits: [
      "Make data-driven policy decisions",
      "Enhance area promotion with accurate data",
      "Integrate with local services for better community planning"
    ]
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
              <span className="text-sm font-medium text-posh-green">Key Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Smarter Home Decisions with Deep Insights
            </h2>
            <p className="text-lg text-posh-dark/80">
              We combine AI, real estate data, and user reviews to give you <span className="text-gold font-medium">deep insights on every neighborhood's unique vibe</span> – so you can find the perfect match for your lifestyle.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FadeIn 
              key={index} 
              delay={index % 3 === 0 ? "delay-0" : 
                    index % 3 === 1 ? "delay-200" : "delay-400"} 
              className="h-full"
            >
              <div className="feature-card h-full flex flex-col p-6 bg-white rounded-xl shadow-md">
                <div className="mb-4 p-3 bg-green-50 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-posh-dark/70 text-sm flex-grow">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <div className="mt-24" id="why-poshmaps">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Why PoshMaps?
              </h2>
              <p className="text-lg text-posh-dark/80">
                Our platform provides unique value to different stakeholders in the property market
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {audienceSegments.map((segment, index) => (
              <FadeIn 
                key={index} 
                delay={index === 0 ? "delay-0" : 
                      index === 1 ? "delay-200" : "delay-400"} 
                className="h-full"
              >
                <div className="h-full bg-white p-8 rounded-2xl shadow-feature">
                  <h3 className="text-xl font-semibold mb-4">{segment.title}</h3>
                  <ul className="space-y-3">
                    {segment.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-posh-green font-bold">•</span>
                        <span className="text-posh-dark/80 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        
        <div className="mt-24" id="investor-section">
          <FadeIn>
            <div className="bg-white p-8 rounded-2xl shadow-feature max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                Investor Perspective
              </h2>
              <p className="text-posh-dark/80 mb-6">
                PoshMaps represents a significant opportunity in the PropTech space, with a clear roadmap for growth and multiple revenue streams.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Development Roadmap</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-5 bg-green-50 rounded-xl">
                      <div className="font-bold text-posh-green mb-2">Phase 1</div>
                      <p className="text-sm text-posh-dark/90">Residential property analysis and user-growth.</p>
                    </div>
                    <div className="p-5 bg-green-50 rounded-xl">
                      <div className="font-bold text-posh-green mb-2">Phase 2</div>
                      <p className="text-sm text-posh-dark/90">Advanced real estate investment tools, commercial real estate features.</p>
                    </div>
                    <div className="p-5 bg-green-50 rounded-xl">
                      <div className="font-bold text-posh-green mb-2">Phase 3</div>
                      <p className="text-sm text-posh-dark/90">Integration with urban planning, council services, insurance/finance models.</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Revenue Streams</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-posh-green font-bold">•</span>
                      <span className="text-posh-dark/80">Premium subscription tiers for advanced features and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-posh-green font-bold">•</span>
                      <span className="text-posh-dark/80">Strategic partnerships with property portals and agencies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-posh-green font-bold">•</span>
                      <span className="text-posh-dark/80">Custom analytics for property developers and institutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-posh-green font-bold">•</span>
                      <span className="text-posh-dark/80">API access for integration with other property tech platforms</span>
                    </li>
                  </ul>
                </div>
                
                <div className="relative rounded-xl overflow-hidden h-full min-h-[320px]">
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                    alt="Property analysis" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy/50 flex items-center justify-center">
                    <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                      <h3 className="text-2xl font-bold text-white mb-2">Join Our Vision</h3>
                      <p className="text-white/90">Become part of the future of property tech</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Data Governance & Trust</h3>
                <p className="text-sm text-posh-dark/90">
                  PoshMaps complies with GDPR and prioritizes transparency. All data sources are properly cited, and we maintain the highest standards of data protection and privacy.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
