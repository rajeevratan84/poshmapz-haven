
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          className="flex items-center space-x-2 text-posh-dark"
          aria-label="PoshMaps"
        >
          <MapPin className="h-6 w-6 text-posh-green" />
          <span className="font-display text-xl font-semibold">PoshMaps</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-sm text-posh-dark/80 font-medium hover:text-posh-green transition-colors"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm text-posh-dark/80 font-medium hover:text-posh-green transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#testimonials" 
            className="text-sm text-posh-dark/80 font-medium hover:text-posh-green transition-colors"
          >
            Testimonials
          </a>
          <a 
            href="#pricing" 
            className="text-sm text-posh-dark/80 font-medium hover:text-posh-green transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Call to Action */}
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="#" 
            className="text-sm text-posh-dark/80 font-medium hover:text-posh-green transition-colors"
          >
            Log in
          </a>
          <Button className="bg-posh-green hover:bg-green-500 text-white rounded-full">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-posh-dark"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[72px] bg-white shadow-lg md:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
          <a 
            href="#features" 
            className="text-lg text-posh-dark font-medium hover:text-posh-green transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-lg text-posh-dark font-medium hover:text-posh-green transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="#testimonials" 
            className="text-lg text-posh-dark font-medium hover:text-posh-green transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Testimonials
          </a>
          <a 
            href="#pricing" 
            className="text-lg text-posh-dark font-medium hover:text-posh-green transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </a>
          <div className="pt-4 flex flex-col space-y-4">
            <a 
              href="#" 
              className="text-lg text-posh-dark font-medium hover:text-posh-green transition-colors"
            >
              Log in
            </a>
            <Button className="w-full bg-posh-green hover:bg-green-500 text-white rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
