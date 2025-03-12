
import React from 'react';
import FadeIn from './animations/FadeIn';
import { 
  Map, 
  Layers, 
  Search, 
  Navigation, 
  Share2, 
  Zap, 
  Globe, 
  Lock 
} from 'lucide-react';

const features = [
  {
    icon: <Search className="h-6 w-6 text-posh-green" />,
    title: "Smart Search",
    description: "Locate anything with intelligent search that understands context and natural language queries."
  },
  {
    icon: <Layers className="h-6 w-6 text-posh-green" />,
    title: "Custom Layers",
    description: "Build detailed visualizations with multiple data layers that reveal deeper insights."
  },
  {
    icon: <Navigation className="h-6 w-6 text-posh-green" />,
    title: "Precision Routing",
    description: "Calculate optimal routes with real-time traffic data and predictive analysis."
  },
  {
    icon: <Globe className="h-6 w-6 text-posh-green" />,
    title: "Global Coverage",
    description: "Access detailed maps for every corner of the globe with consistent quality and precision."
  },
  {
    icon: <Zap className="h-6 w-6 text-posh-green" />,
    title: "AI Insights",
    description: "Uncover patterns and trends with AI-powered analysis of location data."
  },
  {
    icon: <Share2 className="h-6 w-6 text-posh-green" />,
    title: "Seamless Sharing",
    description: "Collaborate easily by sharing maps, routes, and insights with your team or clients."
  },
  {
    icon: <Lock className="h-6 w-6 text-posh-green" />,
    title: "Enterprise Security",
    description: "Keep your location data secure with enterprise-grade encryption and compliance features."
  },
  {
    icon: <Map className="h-6 w-6 text-posh-green" />,
    title: "3D Visualization",
    description: "View terrain, buildings, and data in stunning 3D with intuitive controls."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
              <span className="text-sm font-medium text-posh-green">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Every Detail Designed for Excellence
            </h2>
            <p className="text-lg text-posh-dark/80">
              Discover the tools and capabilities that make PoshMaps the premier choice for location intelligence.
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
