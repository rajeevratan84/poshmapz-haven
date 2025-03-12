
import React from 'react';
import FadeIn from './animations/FadeIn';
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up in seconds and access the full suite of PoshMaps features immediately.",
    benefits: [
      "No credit card required to start",
      "Instant access to all features",
      "Personalized onboarding experience"
    ]
  },
  {
    number: "02",
    title: "Import Your Data",
    description: "Easily upload your location data or connect to your existing services.",
    benefits: [
      "Support for all major file formats",
      "Direct integration with popular services",
      "Automatic data cleaning and processing"
    ]
  },
  {
    number: "03",
    title: "Customize Your Maps",
    description: "Create beautiful, informative maps with our intuitive design tools.",
    benefits: [
      "Drag-and-drop interface",
      "Extensive styling options",
      "Save and reuse custom templates"
    ]
  },
  {
    number: "04",
    title: "Share & Collaborate",
    description: "Invite team members to view and edit your maps in real-time.",
    benefits: [
      "Granular permission controls",
      "Real-time collaboration features",
      "Easy sharing via link or embed"
    ]
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="section-padding bg-green-50">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-green-100 rounded-full">
              <span className="text-sm font-medium text-posh-green">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Getting Started is Effortless
            </h2>
            <p className="text-lg text-posh-dark/80">
              We've streamlined every step so you can focus on what matters — understanding your location data.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <FadeIn 
              key={index} 
              delay={index === 0 ? "delay-0" : 
                    index === 1 ? "delay-200" : 
                    index === 2 ? "delay-400" : 
                    "delay-600"}
            >
              <div className="relative">
                <div className="mb-6">
                  <span className="text-5xl font-display font-bold text-posh-green/10">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-posh-dark/70 mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span className="text-sm text-posh-dark/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
