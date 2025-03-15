
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Github, ExternalLink } from 'lucide-react';
import ScrollAnimation from './animations/ScrollAnimation';

const TeamSection: React.FC = () => {
  return (
    <section id="team" className="section-padding bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimation type="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
            <span className="text-sm font-medium text-posh-green">Our Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Meet the Minds Behind Posh Maps
          </h2>
          <p className="text-lg text-posh-dark/80">
            We're a team of data scientists, engineers, and property experts dedicated to transforming how you discover and evaluate neighborhoods.
          </p>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <ScrollAnimation type="fade-up" delay={300}>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 p-8 bg-gradient-to-b from-posh-green/10 to-posh-gray/10 flex flex-col items-center justify-center">
                  <Avatar className="h-36 w-36 mb-6 border-4 border-white shadow-lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" alt="Rajeev Ratan" />
                    <AvatarFallback className="bg-posh-green text-white text-3xl">RR</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-2xl font-display font-semibold mb-1 text-center">Rajeev Ratan</h3>
                  <p className="text-posh-green font-medium mb-4 text-center">Principal Data Scientist</p>
                  
                  <div className="flex space-x-3">
                    <a href="https://linkedin.com" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <Linkedin className="h-5 w-5 text-posh-dark/70" />
                    </a>
                    <a href="https://github.com" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <Github className="h-5 w-5 text-posh-dark/70" />
                    </a>
                    <a href="#" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <ExternalLink className="h-5 w-5 text-posh-dark/70" />
                    </a>
                  </div>
                </div>
                
                <div className="lg:w-2/3 p-8">
                  <h4 className="text-xl font-semibold mb-4">About Rajeev</h4>
                  <div className="prose prose-green max-w-none">
                    <p>
                      Rajeev Ratan is a Principal Data Scientist at BPP University, leading AI-driven initiatives in education, leveraging Large Language Models (LLMs), Natural Language Processing (NLP), and predictive analytics to enhance student engagement, academic performance, and operational efficiency.
                    </p>
                    <p>
                      Rajeev has been obsessed with maps since childhood, spending hours poring over atlases and creating his own imaginary maps. This lifelong passion led him to create Posh Maps after experiencing firsthand the challenge of finding the perfect area to buy a flat in London.
                    </p>
                    <p>
                      "When I was looking to buy a flat in London, I was completely overwhelmed by the choices. I found myself spending countless hours researching different neighborhoods, trying to piece together information from various sources. I wanted a tool that could understand my specific needs and recommend areas that truly matched my lifestyle," says Rajeev.
                    </p>
                    <p>
                      Beyond industry roles, Rajeev is passionate about AI education and knowledge sharing. He has published eight data science courses on Udemy, amassing over 75,000 students, and has authored multiple research publications in computer vision and probabilistic statistics.
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
