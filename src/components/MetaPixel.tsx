
import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
  }
}

const MetaPixel = () => {
  useEffect(() => {
    // Initialize Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    // Initialize with your pixel ID
    window.fbq('init', '2027821837745963');
    window.fbq('track', 'PageView');
    
    return () => {
      // Clean up if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default MetaPixel;
