import { useEffect, useState, useCallback } from 'react';

export const useOptimizedScroll = (threshold: number = 10) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > threshold;
    setIsScrolled(prevScrolled => {
      if (prevScrolled !== scrolled) {
        return scrolled;
      }
      return prevScrolled;
    });
  }, [threshold]);

  useEffect(() => {
    let ticking = false;

    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', optimizedScrollHandler);
  }, [handleScroll]);

  return isScrolled;
};