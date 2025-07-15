import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const NeoFlowCookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o utilizador já aceitou cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-xl p-4 text-sm z-50 max-w-md mx-auto md:left-4 md:right-auto">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-white mb-3">
            Utilizamos cookies para melhorar a sua experiência. Ao continuar, aceita a nossa política de cookies.
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={acceptCookies}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              Aceitar
            </Button>
            <Button 
              onClick={declineCookies}
              size="sm"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              Recusar
            </Button>
          </div>
        </div>
        
        <button 
          onClick={declineCookies}
          className="text-gray-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NeoFlowCookieBanner;