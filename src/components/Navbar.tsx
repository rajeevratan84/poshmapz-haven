
import React, { useState, useEffect } from 'react';
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
        scrolled ? "bg-black/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          className="flex items-center space-x-2 text-white"
          aria-label="PoshMaps"
        >
          <MapPin className="h-6 w-6 text-coral" />
          <span className="font-display text-xl font-semibold">PoshMaps</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-sm text-white/80 font-medium hover:text-coral transition-colors"
          >
            Features
          </a>
          <a 
            href="#search-demo" 
            className="text-sm text-white/80 font-medium hover:text-coral transition-colors"
          >
            See It In Action
          </a>
          <a 
            href="#problem" 
            className="text-sm text-white/80 font-medium hover:text-coral transition-colors"
          >
            Our Solution
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[72px] bg-black/90 shadow-lg md:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
          <a 
            href="#features" 
            className="text-lg text-white font-medium hover:text-coral transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#search-demo" 
            className="text-lg text-white font-medium hover:text-coral transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            See It In Action
          </a>
          <a 
            href="#problem" 
            className="text-lg text-white font-medium hover:text-coral transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Our Solution
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
