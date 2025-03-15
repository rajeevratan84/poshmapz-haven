
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import FadeIn from './animations/FadeIn';
import { MapPin, CheckCircle, Mail } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call - in a real app, this would send data to a server
    setTimeout(() => {
      // This email would be sent to mail@rajeevratan.com in a production environment
      console.log(`Waitlist signup: ${name} (${email})`);
      toast({
        title: "You've joined the waitlist!",
        description: "We'll notify you when Posh Maps launches.",
      });
      setIsSubmitting(false);
      setEmail('');
      setName('');
    }, 1000);
  };

  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
                <span className="text-sm font-medium text-posh-green">Coming Soon!</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Join Our Waitlist Today
              </h2>
              <p className="text-lg text-posh-dark/80 max-w-2xl mx-auto">
                Be among the first to access Posh Maps when we launch. Sign up now to get early access and special offers.
              </p>
            </div>
          </FadeIn>

          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="grid md:grid-cols-2">
              <FadeIn direction="left" className="p-8 md:p-12">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPin className="h-6 w-6 text-posh-green" />
                    <span className="font-display text-2xl font-semibold">Posh Maps</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
                  <p className="text-posh-dark/70 mb-8">
                    We're currently in development. Join our waitlist to be notified when we launch.
                  </p>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>AI-powered neighborhood matching</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>Custom area ratings based on your preferences</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>Comprehensive local insights</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-posh-green shrink-0 mt-0.5" />
                      <span>Early access for waitlist members</span>
                    </li>
                  </ul>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-posh-green" />
                    <a href="mailto:mail@rajeevratan.com" className="text-posh-green hover:underline">
                      Contact us
                    </a>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn direction="right" className="bg-green-50 p-8 md:p-12">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-6">Join the Waitlist</h3>
                  
                  <div className="space-y-4 flex-grow">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-posh-dark hover:bg-black text-white rounded-full mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                  
                  <p className="text-xs text-center text-posh-dark/60 mt-4">
                    By joining, you agree to receive updates about our launch. We respect your privacy.
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
