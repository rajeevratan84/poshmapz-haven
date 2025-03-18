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
    icon: <Map className="h-6 w-6 text-[#ea384c]" />,
    title: "Unified Neighbourhood Data",
    description: "Crime rates, school performance, transport links, demographics—all in one place."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-[#ea384c]" />,
    title: "Smart Area Recommendations",
    description: "AI-powered suggestions based on your preferences and commute requirements."
  },
  {
    icon: <Building className="h-6 w-6 text-[#ea384c]" />,
    title: "Custom Scores & Vibe Check",
    description: "Personalised ratings and a 'local vibe score' to quickly compare areas."
  },
  {
    icon: <Users className="h-6 w-6 text-[#ea384c]" />,
    title: "Community Insights",
    description: "Real neighborhood insights from locals who know the area best."
  },
  {
    icon: <Zap className="h-6 w-6 text-[#ea384c]" />,
    title: "Smart Recommendations",
    description: "Discover perfect areas based on your lifestyle and travel preferences."
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
      "Track market trends and demographic changes"
    ]
  },
  {
    title: "For Estate Agents",
    benefits: [
      "Provide clients with comprehensive area insights",
      "Showcase neighborhood benefits with real data",
      "Stand out with AI-powered property recommendations"
    ]
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="section-padding bg-black">
      <div className="container mx-auto px-6">
        <ScrollAnimation type="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-[#ea384c]/20 rounded-full">
              <span className="text-sm font-medium text-[#ea384c]">Key Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
              Smarter Home Decisions with Deep Insights
            </h2>
            <p className="text-lg text-white/80">
              We combine AI, real estate data, and user reviews to give you <span className="text-[#ea384c] font-medium">deep insights on every neighborhood's unique vibe</span> – so you can find the perfect match for your lifestyle.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FadeIn 
              key={index} 
              delay={index % 3 === 0 ? "delay-0" : 
                    index % 3 === 1 ? "delay-200" : "delay-400"} 
              className="h-full"
            >
              <div className="feature-card h-full flex flex-col p-6 bg-black/60 border border-[#ea384c]/10 rounded-xl hover:border-[#ea384c]/20 transition-colors">
                <div className="mb-4 p-3 bg-[#ea384c]/10 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70 text-sm flex-grow">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
