
import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: ReactNode;
  type?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 500,
  className,
  once = true,
  threshold = 0.05,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize styles based on animation type
  const getInitialStyles = () => {
    switch (type) {
      case 'fade-up':
        return { opacity: 0, transform: 'translateY(20px)' };
      case 'fade-down':
        return { opacity: 0, transform: 'translateY(-20px)' };
      case 'fade-left':
        return { opacity: 0, transform: 'translateX(20px)' };
      case 'fade-right':
        return { opacity: 0, transform: 'translateX(-20px)' };
      case 'zoom-in':
        return { opacity: 0, transform: 'scale(0.95)' };
      case 'zoom-out':
        return { opacity: 0, transform: 'scale(1.05)' };
      default:
        return { opacity: 0 };
    }
  };

  // Animation styles when visible
  const getVisibleStyles = () => {
    return { opacity: 1, transform: 'translate(0, 0) scale(1)' };
  };

  // Transition styles
  const getTransitionStyles = () => {
    return {
      transition: `opacity ${duration / 1000}s ease-out, transform ${duration / 1000}s ease-out`,
      transitionDelay: `${delay / 1000}s`,
    };
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true); // Fallback for SSR or old browsers
      return;
    }

    // Create observer only once
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              if (once && observerRef.current) {
                observerRef.current.unobserve(element);
              }
            } else if (!once) {
              setIsVisible(false);
            }
          });
        },
        { 
          threshold,
          // Trigger animations sooner for a more responsive feel
          rootMargin: '150px 0px'
        }
      );

      observerRef.current.observe(element);
    }

    return () => {
      if (element && observerRef.current) {
        observerRef.current.unobserve(element);
        observerRef.current = null;
      }
    };
  }, [threshold, once]);

  return (
    <div
      ref={elementRef}
      className={cn('transition-gpu will-change-transform', className)}
      style={{
        ...getInitialStyles(),
        ...(isVisible ? getVisibleStyles() : {}),
        ...getTransitionStyles(),
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
