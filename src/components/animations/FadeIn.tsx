
import React, { useEffect, useRef, useState, ReactNode, memo } from 'react';
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: 'delay-0' | 'delay-200' | 'delay-400' | 'delay-600' | 'delay-800';
  duration?: string;
  threshold?: number;
  once?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = memo(({
  children,
  className,
  direction = 'up',
  delay = 'delay-0',
  duration = 'duration-700',
  threshold = 0.1,
  once = true,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
          // Add rootMargin to trigger animations slightly before they come into view
          rootMargin: '50px 0px'
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

  const getAnimationClass = () => {
    switch (direction) {
      case 'up':
        return 'animate-fade-in-up';
      case 'down':
        return 'animate-fade-in-down';
      case 'left':
        return 'animate-slide-in-left';
      case 'right':
        return 'animate-slide-in-right';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'opacity-0',
        isVisible && `${getAnimationClass()} ${delay} ${duration}`,
        className
      )}
    >
      {children}
    </div>
  );
});

export default FadeIn;
