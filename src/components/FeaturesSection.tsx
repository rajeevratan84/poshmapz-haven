
import React from 'react';
import FadeIn from './animations/FadeIn';
import ScrollAnimation from './animations/ScrollAnimation';
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
  },
  {
    icon: <Zap className="h-6 w-6 text-posh-green" />,
    title: "Recommend Perfect Areas",
    description: "Get personalized area recommendations based on your preferences and travel times."
  }
];

const audienceSegments = [
  {
    title: "For Homebuyers & Renters",
    benefits: [
      "Compare areas quickly and make informed decisions",
      "Save time by accessing multiple data sources in one place", 
      "Get reliable real-time insights on neighborhood safety and quality"
    ],
    bgColor: "bg-gradient-to-br from-green-900/40 to-green-800/20"
  },
  {
    title: "For Property Investors",
    benefits: [
      "Identify undervalued areas with growth potential",
      "Reduce risk with data-backed analysis",
      "Expand portfolios confidently with predictive insights"
    ],
    bgColor: "bg-gradient-to-br from-blue-900/40 to-blue-800/20"
  },
  {
    title: "For Strategic Partners & Councils",
    benefits: [
      "Make data-driven policy decisions",
      "Enhance area promotion with accurate data",
      "Integrate with local services for better community planning"
    ],
    bgColor: "bg-gradient-to-br from-purple-900/40 to-purple-800/20"
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-10 md:py-12 bg-black">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-block mb-3 px-3 py-1 bg-green-50/20 rounded-full">
              <span className="text-sm font-medium text-posh-green">Key Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Smarter Home Decisions with Deep Insights
            </h2>
            <p className="text-lg text-white/80">
              We combine AI, real estate data, and user reviews to give you <span className="text-coral font-medium">deep insights on every neighborhood's unique vibe</span> – so you can find the perfect match for your lifestyle.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FadeIn 
              key={index} 
              delay={index % 3 === 0 ? "delay-0" : 
                    index % 3 === 1 ? "delay-200" : "delay-400"} 
              className="h-full"
            >
              <div className="feature-card h-full flex flex-col p-6 bg-black/60 border border-white/10 rounded-xl shadow-md hover-lift hover-glow">
                <div className="mb-4 p-3 bg-posh-green/20 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70 text-sm flex-grow">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <div className="mt-12" id="why-poshmaps">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                Why PoshMaps?
              </h2>
              <p className="text-lg text-white/80">
                Our platform provides unique value to different stakeholders in the property market
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {audienceSegments.map((segment, index) => (
              <ScrollAnimation 
                key={index} 
                type="fade-up"
                delay={index * 150}
                duration={500}
                className="h-full"
              >
                <div className={`h-full ${segment.bgColor} border border-white/10 p-6 rounded-2xl shadow-feature hover-lift hover-glow`}>
                  <h3 className="text-xl font-semibold mb-4 text-white">{segment.title}</h3>
                  <ul className="space-y-3">
                    {segment.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-posh-green font-bold">•</span>
                        <span className="text-white/80 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
