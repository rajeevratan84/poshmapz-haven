
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
                <div className="lg:w-1/3 p-8 bg-gradient-to-b from-posh-green/10 to-posh-green/5 flex flex-col items-center justify-center">
                  <Avatar className="h-36 w-36 mb-6 border-4 border-white shadow-lg">
                    <AvatarImage src="/placeholder.svg" alt="Rajeev Ratan" />
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
                      Rajeev Ratan is a Principal Data Scientist at BPP University, leading AI-driven initiatives in education, leveraging Large Language Models (LLMs), Natural Language Processing (NLP), and predictive analytics to enhance student engagement, academic performance, and operational efficiency. He has nearly a decade of experience in data science, machine learning, and AI applications across diverse industries, including education, telecommunications, and computer vision.
                    </p>
                    <p>
                      Before joining BPP University, Rajeev spent over six years working on deep learning and computer vision applications for various technology companies, including as a Senior Computer Vision Engineer at a U.S.-based AI startup. He has also worked extensively in the telecommunications sector, applying AI-driven solutions for network optimisation and anomaly detection.
                    </p>
                    <p>
                      Beyond industry roles, Rajeev is passionate about AI education and knowledge sharing. He has published eight data science courses on Udemy, amassing over 75,000 students, and has authored multiple research publications in computer vision and probabilistic statistics. He co-founded PyDataTT, Trinidad's leading Python and data science community, fostering AI talent in the Caribbean.
                    </p>
                    <p>
                      Rajeev holds an MSc in Artificial Intelligence from the University of Edinburgh and a BSc in Electrical and Computer Engineering.
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
