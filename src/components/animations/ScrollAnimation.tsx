
import React, { useEffect, useRef, ReactNode, useState, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'sticky';

interface ScrollAnimationProps {
  children: ReactNode;
  type: AnimationType;
  className?: string;
  delay?: number;
  threshold?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  stickyUntil?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  type,
  className,
  delay = 0,
  threshold = 0.1,
  duration = 600,
  distance = 30,
  once = true,
  stickyUntil
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [initialTop, setInitialTop] = useState(0);
  
  useEffect(() => {
    // Skip animations during SSR
    if (typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }
    
    const element = ref.current;
    if (!element) return;

    // Store initial top position for sticky elements
    if (type === 'sticky') {
      setInitialTop(element.getBoundingClientRect().top + window.scrollY);
    }
    
    // Create IntersectionObserver for triggering animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && type !== 'sticky') {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { 
        threshold,
        rootMargin: '100px 0px' // Trigger animations sooner
      }
    );
    
    observer.observe(element);
    
    // Scroll handler for progress-based animations
    const handleScroll = () => {
      if (type === 'sticky' && stickyUntil) {
        const scrollTop = window.scrollY;
        const start = initialTop - window.innerHeight / 2;
        const end = initialTop + stickyUntil;
        
        // Calculate how far through the section we've scrolled (0-1)
        const progress = Math.max(0, Math.min(1, (scrollTop - start) / (end - start)));
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      observer.unobserve(element);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, once, type, initialTop, stickyUntil]);
  
  // Generate styles based on animation type
  const getStyles = (): React.CSSProperties => {
    if (!isVisible && type !== 'sticky') {
      // Initial hidden state
      switch (type) {
        case 'fade-up':
          return { 
            opacity: 0, 
            transform: `translateY(${distance}px)`,
            transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay}ms`
          };
        case 'fade-down':
          return { 
            opacity: 0, 
            transform: `translateY(-${distance}px)`,
            transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay}ms`
          };
        case 'fade-left':
          return { 
            opacity: 0, 
            transform: `translateX(${distance}px)`,
            transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay}ms`
          };
        case 'fade-right':
          return { 
            opacity: 0, 
            transform: `translateX(-${distance}px)`,
            transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay}ms`
          };
        case 'zoom-in':
          return { 
            opacity: 0, 
            transform: 'scale(0.9)',
            transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay}ms`
          };
        case 'zoom-out':
          return { 
            opacity: 0, 
            transform: 'scale(1.1)',
            transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay}ms`
          };
        default:
          return {};
      }
    } else if (type === 'sticky') {
      // For sticky elements, apply progress-based styles
      const sticky = scrollProgress > 0 && scrollProgress < 1;
      
      return {
        position: sticky ? 'sticky' as const : 'relative' as const,
        top: sticky ? '20%' : 'auto',
        opacity: isVisible ? 1 - (scrollProgress > 0.8 ? (scrollProgress - 0.8) * 5 : 0) : 0,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`
      };
    }
    
    // Visible state
    return { 
      opacity: 1, 
      transform: 'translate(0, 0) scale(1)',
      transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      transitionDelay: `${delay}ms`
    };
  };
  
  return (
    <div 
      ref={ref}
      className={cn(className)}
      style={getStyles()}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
