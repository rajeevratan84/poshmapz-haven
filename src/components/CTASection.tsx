
import React from 'react';
import { Button } from "@/components/ui/button";
import FadeIn from './animations/FadeIn';
import { MapPin, CheckCircle } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
                <span className="text-sm font-medium text-posh-green">Ready to Start?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Begin Your PoshMaps Journey Today
              </h2>
              <p className="text-lg text-posh-dark/80 max-w-2xl mx-auto">
                Join thousands of forward-thinking organizations already using PoshMaps to transform their location intelligence.
              </p>
            </div>
          </FadeIn>

          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="grid md:grid-cols-2">
              <FadeIn direction="left" className="p-8 md:p-12">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPin className="h-6 w-6 text-posh-green" />
                    <span className="font-display text-2xl font-semibold">PoshMaps</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Start for Free</h3>
                  <p className="text-posh-dark/70 mb-8">
                    Explore all features with our generous free tier. Upgrade anytime as your needs grow.
                  </p>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>Unlimited basic maps</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>Core AI features included</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>Up to 5 team members</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>Community support</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full bg-posh-green hover:bg-green-500 text-white rounded-full">
                    Get Started For Free
                  </Button>
                </div>
              </FadeIn>
              
              <FadeIn direction="right" className="bg-green-50 p-8 md:p-12">
                <form className="flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-6">Create Your Account</h3>
                  
                  <div className="space-y-4 flex-grow">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-posh-dark hover:bg-black text-white rounded-full mt-6">
                    Create Free Account
                  </Button>
                  
                  <p className="text-xs text-center text-posh-dark/60 mt-4">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
