
import { useEffect } from 'react';

// Extend Window interface to include Facebook Pixel properties
declare global {
  interface Window {
    fbq: any;
    _fbq?: any;
  }
}

const MetaPixel = () => {
  useEffect(() => {
    // Initialize Facebook Pixel with correct TypeScript syntax
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      }
    })(
      window as any, 
      document, 
      'script', 
      'https://connect.facebook.net/en_US/fbevents.js',
      undefined,
      undefined,
      document.getElementsByTagName('script')[0]
    );
    
    // Initialize with your pixel ID
    window.fbq('init', '2027821837745963');
    window.fbq('track', 'PageView');
    
    // No cleanup needed for Meta Pixel
  }, []);

  return null; // This component doesn't render anything
};

export default MetaPixel;
