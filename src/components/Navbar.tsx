
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { MapPin, Menu, X, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

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
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-white"
          aria-label="PoshMaps"
        >
          <MapPin className="h-6 w-6 text-coral" />
          <span className="font-display text-xl font-semibold">PoshMaps</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-sm text-white/90 font-medium hover:text-coral transition-colors"
          >
            Features
          </a>
          <a 
            href="#search-demo" 
            className="text-sm text-white/90 font-medium hover:text-coral transition-colors"
          >
            See It In Action
          </a>
          <a 
            href="#problem" 
            className="text-sm text-white/90 font-medium hover:text-coral transition-colors"
          >
            Our Solution
          </a>
          <Link to="/demo">
            <Button variant="highlight" size="lg" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Try Demo</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
            </Button>
          </Link>
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
          <Link 
            to="/demo" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <Button variant="highlight" size="mobile" className="w-full flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Try Demo</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
