
import { useEffect } from 'react';

// Extend Window interface to include Facebook Pixel properties
declare global {
  interface Window {
    fbq: any;
    _fbq?: any; // Add optional _fbq property
  }
}

const MetaPixel = () => {
  useEffect(() => {
    // Initialize Facebook Pixel with correct TypeScript syntax
    (function(f: Window, b: Document, e: string, v: string, n: any, t: HTMLScriptElement, s: HTMLElement | null) {
      if (f.fbq) return;
      n = f.fbq = function() {
        (n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments));
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    // Initialize with your pixel ID
    window.fbq('init', '2027821837745963');
    window.fbq('track', 'PageView');
    
    // No cleanup needed for Meta Pixel
  }, []);

  return null; // This component doesn't render anything
};

export default MetaPixel;
