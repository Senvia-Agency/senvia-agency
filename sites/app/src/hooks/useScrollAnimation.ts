import { useIntersectionObserver } from './useIntersectionObserver';
import { useEffect } from 'react';

export const useScrollAnimation = (delay: number = 150) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (isIntersecting && ref.current) {
      const elements = ref.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, index * delay);
      });
    }
  }, [isIntersecting, delay]);

  return ref;
};