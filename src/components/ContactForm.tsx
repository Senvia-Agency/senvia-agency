import { useState } from "react";
import { Send, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  gdprConsent: boolean;
  marketingConsent: boolean;
}

const ContactForm = () => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    gdprConsent: false,
    marketingConsent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormState(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCheckboxChange = (name: string, value: boolean) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.gdprConsent) {
      toast({
        title: "Consentimento obrigatório",
        description: "Deve aceitar o tratamento dos seus dados pessoais para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Track Facebook Pixel event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Contact Form Submission',
          content_category: 'Contact',
          value: 1.00,
          currency: 'EUR'
        });
      }

      // Insert lead into unified_leads table
      const { error } = await supabase
        .from('unified_leads')
        .insert({
          full_name: formState.name,
          email: formState.email,
          phone: formState.phone,
          source_page: 'contact_form_consultoria',
          interest_type: 'agendar_consultoria',
          plan: 'Agendar Consultoria',
          objective: 'Agendar uma consultoria gratuita com a SENVIA',
          notes: formState.message,
          lead_status: 'new',
          priority: 1,
          data_consent: formState.gdprConsent,
          utm_source: 'contact_form',
          utm_medium: 'website',
          utm_campaign: 'agendar_consultoria'
        });

      if (error) {
        console.error('Error inserting lead:', error);
        throw error;
      }
      
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        phone: "",
        message: "",
        gdprConsent: false,
        marketingConsent: false
      });
      
      toast({
        title: "✅ Mensagem enviada com sucesso!",
        description: "Obrigado pelo seu contacto. Responderemos nas próximas 24h.",
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar a sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="bg-green-100 p-3 rounded-full text-green-500 mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h4 className="text-xl font-semibold mb-2">Mensagem Enviada!</h4>
        <p className="text-muted-foreground">Obrigado pelo seu contacto. Responderemos o mais breve possível.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all text-foreground"
          placeholder="Seu nome"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all text-foreground"
          placeholder="seu-email@exemplo.com"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formState.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all text-foreground"
          placeholder="+351 XXX XXX XXX"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all resize-none text-foreground"
          placeholder="Conte-nos sobre o teu projeto ou que tipo de consultoria precisas..."
          ></textarea>
        </div>
        
        {/* RGPD Compliance Section */}
        <div className="space-y-4 border-t border-muted pt-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="gdpr_consent"
              checked={formState.gdprConsent}
              onCheckedChange={(checked) => handleCheckboxChange("gdprConsent", checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1 leading-none">
              <label 
                htmlFor="gdpr_consent" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aceito o tratamento dos meus dados pessoais *
              </label>
              <p className="text-xs text-muted-foreground">
                Os seus dados serão utilizados para processar este pedido e entrar em contacto consigo. 
                Consulte a nossa{" "}
                <Link 
                  to="/privacy-policy" 
                  className="text-senvia-500 hover:underline"
                  target="_blank"
                >
                  Política de Privacidade
                </Link>{" "}
                para mais informações.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing_consent"
              checked={formState.marketingConsent}
              onCheckedChange={(checked) => handleCheckboxChange("marketingConsent", checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1 leading-none">
              <label 
                htmlFor="marketing_consent" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aceito receber comunicações de marketing (opcional)
              </label>
              <p className="text-xs text-muted-foreground">
                Pode cancelar a subscrição a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      
        <button
          type="submit"
          disabled={isSubmitting || !formState.gdprConsent}
          className={`w-full px-6 py-3 bg-senvia-500 hover:bg-senvia-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
            isSubmitting || !formState.gdprConsent ? "opacity-70 cursor-not-allowed" : ""
          }`}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>A enviar...</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span>Enviar Mensagem</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
