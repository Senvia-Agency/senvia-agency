
import { useEffect } from "react";

const ScrollAnimator = () => {
  useEffect(() => {
    // Function to check if an element is in viewport and animate it
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Check if element is in viewport
        if (elementTop < window.innerHeight - 50 && elementBottom > 0) {
          element.classList.add('visible');
        }
      });
    };
    
    // Add parallax effect to elements with parallax class
    const handleParallax = () => {
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const scrollPosition = window.pageYOffset;
        const elemPosition = (element as HTMLElement).offsetTop;
        const distance = elemPosition - scrollPosition;
        const speed = parseFloat((element as HTMLElement).dataset.speed || '0.1');
        
        if ((element as HTMLElement).dataset.direction === 'up') {
          (element as HTMLElement).style.transform = `translateY(${distance * speed}px)`;
        } else {
          (element as HTMLElement).style.transform = `translateY(-${distance * speed}px)`;
        }
      });
    };
    
    // Run animateOnScroll on load
    animateOnScroll();
    
    // Add event listener for scroll
    window.addEventListener('scroll', () => {
      animateOnScroll();
      handleParallax();
    });
    
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
      window.removeEventListener('scroll', handleParallax);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default ScrollAnimator;
