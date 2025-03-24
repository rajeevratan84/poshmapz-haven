
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Github, ExternalLink } from 'lucide-react';
import ScrollAnimation from './animations/ScrollAnimation';

const TeamSection: React.FC = () => {
  return (
    <section id="team" className="section-padding bg-black/80 overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimation type="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4 px-3 py-1 bg-coral/20 rounded-full">
            <span className="text-sm font-medium text-coral">Our Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
            Meet the Minds Behind Posh Maps
          </h2>
          <p className="text-lg text-white/80">
            We're a team of data scientists, engineers, and property experts dedicated to transforming how you discover and evaluate neighborhoods.
          </p>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <ScrollAnimation type="fade-up" delay={300}>
            <div className="bg-black/60 border border-white/10 rounded-2xl shadow-card overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 p-8 bg-gradient-to-b from-coral/10 to-black/20 flex flex-col items-center justify-center">
                  <Avatar className="h-36 w-36 mb-6 border-4 border-black/30 shadow-lg">
                    <AvatarImage src="/lovable-uploads/cf066783-275d-4b56-82f3-996162b2bbfb.png" alt="Rajeev Ratan" />
                    <AvatarFallback className="bg-coral text-white text-3xl">RR</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-2xl font-display font-semibold mb-1 text-center text-white">Rajeev Ratan</h3>
                  <p className="text-coral font-medium mb-4 text-center">Principal Data Scientist</p>
                  
                  <div className="flex space-x-3">
                    <a href="https://linkedin.com" className="bg-black/40 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <Linkedin className="h-5 w-5 text-white/70" />
                    </a>
                    <a href="https://github.com" className="bg-black/40 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <Github className="h-5 w-5 text-white/70" />
                    </a>
                    <a href="#" className="bg-black/40 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <ExternalLink className="h-5 w-5 text-white/70" />
                    </a>
                  </div>
                </div>
                
                <div className="lg:w-2/3 p-8">
                  <h4 className="text-xl font-semibold mb-4 text-white">About Rajeev</h4>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/80">
                      Rajeev Ratan is a Principal Data Scientist at BPP University, leading AI-driven initiatives in education using LLMs, NLP, and predictive analytics to enhance student engagement and performance. A lifelong map enthusiast, he founded Posh Maps to simplify London property searches after struggling to find the right area himself. Passionate about AI education, he has published eight Udemy courses with over 75,000 students and has authored multiple research publications in computer vision, probabilistic statistics, and AI-driven education analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
