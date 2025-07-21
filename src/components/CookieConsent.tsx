import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Sempre true, não pode ser desativado
    analytics: false,
    marketing: false
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    } else {
      // Carregar preferências salvas
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      applyCookieSettings(savedPreferences);
    }
  }, []);

  const applyCookieSettings = (settings: typeof preferences) => {
    // Aplicar configurações de cookies
    if (settings.analytics && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }

    if (settings.marketing && typeof window !== 'undefined' && (window as any).fbq) {
      // Facebook Pixel já está carregado, apenas ativar se consentimento dado
      (window as any).fbq('consent', 'grant');
    }
  };

  const acceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
      marketing: true
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    applyCookieSettings(newPreferences);
    setIsVisible(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    applyCookieSettings(preferences);
    setIsVisible(false);
  };

  const rejectAll = () => {
    const newPreferences = {
      essential: true,
      analytics: false,
      marketing: false
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 p-4 shadow-lg">
      <div className="container mx-auto max-w-6xl">
        {!showPreferences ? (
          // Banner simples
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-senvia-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Este website utiliza cookies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Utilizamos cookies essenciais para o funcionamento do site e cookies opcionais para análise e marketing. 
                  Pode gerir as suas preferências ou consultar a nossa{" "}
                  <Link 
                    to="/privacy-policy" 
                    className="text-senvia-500 hover:underline"
                    target="_blank"
                  >
                    Política de Privacidade
                  </Link>.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 min-w-0 sm:min-w-fit">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(true)}
                className="whitespace-nowrap"
              >
                Gerir Preferências
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
                className="whitespace-nowrap"
              >
                Rejeitar Opcionais
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-senvia-500 hover:bg-senvia-600 text-white whitespace-nowrap"
              >
                Aceitar Todos
              </Button>
            </div>
          </div>
        ) : (
          // Painel de preferências detalhado
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preferências de Cookies</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreferences(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              {/* Cookies Essenciais */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Cookies Essenciais</h4>
                  <p className="text-sm text-muted-foreground">
                    Necessários para o funcionamento básico do website. Não podem ser desativados.
                  </p>
                </div>
                <div className="text-sm text-green-600 font-medium ml-4">
                  Sempre ativo
                </div>
              </div>

              {/* Cookies de Análise */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Cookies de Análise</h4>
                  <p className="text-sm text-muted-foreground">
                    Google Analytics - Ajudam-nos a compreender como os visitantes interagem com o website.
                  </p>
                </div>
                <label className="flex items-center space-x-2 ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      analytics: e.target.checked
                    }))}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Ativar</span>
                </label>
              </div>

              {/* Cookies de Marketing */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Cookies de Marketing</h4>
                  <p className="text-sm text-muted-foreground">
                    Meta Pixel - Utilizados para personalizar anúncios e medir a eficácia das campanhas.
                  </p>
                </div>
                <label className="flex items-center space-x-2 ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      marketing: e.target.checked
                    }))}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Ativar</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
                className="flex-1"
              >
                Rejeitar Opcionais
              </Button>
              <Button
                size="sm"
                onClick={acceptSelected}
                className="flex-1 bg-senvia-500 hover:bg-senvia-600 text-white"
              >
                Confirmar Seleção
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;