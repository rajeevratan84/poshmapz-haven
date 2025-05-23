
import React from 'react';
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface FooterColumnProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <div>
    <h3 className="font-semibold text-sm text-white mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <a 
            href={link.href} 
            className="text-sm text-white/70 hover:text-coral transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 text-white mb-4">
              <MapPin className="h-5 w-5 text-coral" />
              <span className="font-display text-lg font-semibold">PoshMaps</span>
            </div>
            <p className="text-sm text-white/70 mb-6 max-w-xs">
              Transforming location intelligence with elegant, powerful mapping solutions powered by AI.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href={`#${social}`} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-coral hover:text-white transition-colors"
                  aria-label={social}
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          
          <FooterColumn 
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Case Studies", href: "#" },
              { label: "Documentation", href: "#" },
              { label: "Release Notes", href: "#" },
            ]}
          />
          
          <FooterColumn 
            title="Company"
            links={[
              { label: "About Us", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Press", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />
          
          <FooterColumn 
            title="Resources"
            links={[
              { label: "Support Center", href: "#" },
              { label: "Community", href: "#" },
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Status Page", href: "#" },
            ]}
          />
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <div className="mb-4 md:mb-0">
            © {currentYear} PoshMaps. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-coral transition-colors">Privacy</a>
            <a href="#" className="hover:text-coral transition-colors">Terms</a>
            <a href="#" className="hover:text-coral transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
