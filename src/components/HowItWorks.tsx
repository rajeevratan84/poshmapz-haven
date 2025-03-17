
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
    title: "Customize Your Maps",
    description: "Create beautiful, informative maps with our intuitive design tools.",
    benefits: [
      "Drag-and-drop interface",
      "Extensive styling options",
      "Save and reuse custom templates"
    ]
  },
  {
    number: "03",
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
    <section id="how-it-works" className="section-padding bg-black">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-posh-green/20 rounded-full">
              <span className="text-sm font-medium text-posh-green">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
              Getting Started is Effortless
            </h2>
            <p className="text-lg text-white/80">
              We've streamlined every step so you can focus on what matters — understanding your location data.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <FadeIn 
              key={index} 
              delay={index === 0 ? "delay-0" : 
                    index === 1 ? "delay-200" : 
                    "delay-400"}
            >
              <div className="relative bg-black/60 border border-white/10 p-6 rounded-xl">
                <div className="mb-6">
                  <span className="text-5xl font-display font-bold text-posh-green/20">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-white/70 mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span className="text-white/80">{benefit}</span>
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
