
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { MapPin, Menu, X, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import LoginButton from './auth/LoginButton';
import { useTheme } from '@/context/ThemeContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        scrolled 
          ? isDark 
            ? "bg-black/90 backdrop-blur-md shadow-sm" 
            : "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className={`flex items-center space-x-2 ${isDark ? 'text-white' : 'text-black'}`}
          aria-label="PoshMaps"
        >
          <MapPin className="h-6 w-6 text-coral" />
          <span className="font-display text-xl font-semibold">PoshMaps</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/maps" 
            className={`text-sm font-medium hover:text-coral transition-colors ${
              isDark ? 'text-white/90' : 'text-black/90'
            }`}
          >
            AI Maps
          </Link>
          <a 
            href="#features" 
            className={`text-sm font-medium hover:text-coral transition-colors ${
              isDark ? 'text-white/90' : 'text-black/90'
            }`}
          >
            Features
          </a>
          <a 
            href="#search-demo" 
            className={`text-sm font-medium hover:text-coral transition-colors ${
              isDark ? 'text-white/90' : 'text-black/90'
            }`}
          >
            See It In Action
          </a>
          <a 
            href="#problem" 
            className={`text-sm font-medium hover:text-coral transition-colors ${
              isDark ? 'text-white/90' : 'text-black/90'
            }`}
          >
            Our Solution
          </a>
          <LoginButton />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LoginButton />
          <button 
            className={isDark ? "text-white" : "text-black"}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[72px] shadow-lg md:hidden transition-transform duration-300 ease-in-out",
          isDark ? "bg-black/90" : "bg-white/90",
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
          <Link 
            to="/maps" 
            className={`text-lg font-medium hover:text-coral transition-colors ${
              isDark ? 'text-white' : 'text-black'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            AI Maps
          </Link>
          <a 
            href="#features" 
            className={`text-lg font-medium hover:text-coral transition-colors ${
              isDark ? 'text-white' : 'text-black'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#search-demo" 
            className={`text-lg font-medium hover:text-coral transition-colors ${
              isDark ? 'text-white' : 'text-black'
            }`}
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
