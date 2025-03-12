
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
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: <Search className="h-6 w-6 text-posh-green" />,
    title: "AI-Powered Area Search",
    description: "Find homes based on lifestyle preferences, not just price. Our AI understands what matters to you."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-posh-green" />,
    title: "Crime & Safety Insights",
    description: "Get detailed crime statistics and safety scores for any neighborhood with reliable data."
  },
  {
    icon: <Navigation className="h-6 w-6 text-posh-green" />,
    title: "Transport & Walkability",
    description: "Understand commute times, public transport access, and walkability scores for daily living."
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-posh-green" />,
    title: "School Quality Analysis",
    description: "Compare local schools with detailed Ofsted reports and catchment area information."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-posh-green" />,
    title: "Future Value Predictions",
    description: "Our AI forecasts property value trends to help you make smarter investment decisions."
  },
  {
    icon: <Building className="h-6 w-6 text-posh-green" />,
    title: "Neighborhood Vibe Score",
    description: "Discover the atmosphere and community feel with insights from local residents."
  },
  {
    icon: <Map className="h-6 w-6 text-posh-green" />,
    title: "Visual Area Assessment",
    description: "AI-powered analysis of street views to evaluate area aesthetics and maintenance."
  },
  {
    icon: <Zap className="h-6 w-6 text-posh-green" />,
    title: "Real-Time Data Updates",
    description: "Always get the latest information with our continuously updated data sources."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
              <span className="text-sm font-medium text-posh-green">AI-Powered Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Smarter Home Decisions with Deep Insights
            </h2>
            <p className="text-lg text-posh-dark/80">
              We combine AI, real estate data, and user reviews to give you deep insights on every neighborhood – so you can buy with confidence.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FadeIn 
              key={index} 
              delay={index % 5 === 0 ? "delay-0" : 
                    index % 5 === 1 ? "delay-200" : 
                    index % 5 === 2 ? "delay-400" : 
                    index % 5 === 3 ? "delay-600" : "delay-800"} 
              className="h-full"
            >
              <div className="feature-card h-full flex flex-col">
                <div className="mb-4 p-3 bg-green-50 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-posh-dark/70 text-sm flex-grow">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
