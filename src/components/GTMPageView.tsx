import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GTMPageView = () => {
  const location = useLocation();

  useEffect(() => {
    // Enviar pageview para o GTM quando a rota mudar
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GTM-KL72LGGS', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }

    // Também enviar evento personalizado para o dataLayer
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        'event': 'page_view',
        'page_path': location.pathname + location.search,
        'page_title': document.title,
      });
    }
  }, [location]);

  return null;
};

export default GTMPageView;