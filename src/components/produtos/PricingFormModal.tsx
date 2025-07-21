import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface PricingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
}

const PricingFormModal = ({ open, onOpenChange, planName }: PricingFormModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    instagram_site: "",
    company_name: "",
    message: "",
    plan: planName,
    gdpr_consent: false,
    marketing_consent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track GTM form_submit event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_submit', {
          event_category: 'pricing_form',
          event_label: `${planName.toLowerCase()}_plan_interest`,
          value: planName === 'Starter' ? 397 : planName === 'Pro' ? 697 : 1197,
          currency: 'EUR'
        });
      }

      // Track Facebook Pixel event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: `${planName} Plan Interest`,
          content_category: 'Plan Interest',
          value: planName === 'Starter' ? 397 : planName === 'Pro' ? 697 : 1197,
          currency: 'EUR'
        });
      }

      // Inserir lead na tabela unified_leads
      const { error } = await supabase
        .from('unified_leads')
        .insert({
          full_name: formData.name,
          email: formData.email,
          phone: formData.whatsapp,
          company_name: formData.company_name,
          website: formData.instagram_site,
          source_page: `${planName.toLowerCase()}_plan_interest`,
          interest_type: `${planName.toLowerCase()}_plan`,
          plan: planName, // Nova coluna para identificar o plano
          notes: formData.message,
          lead_status: 'new',
          priority: planName === 'Premium' ? 3 : planName === 'Pro' ? 2 : 1,
          data_consent: formData.gdpr_consent,
          utm_source: 'pricing_form',
          utm_medium: 'website',
          utm_campaign: `${planName.toLowerCase()}_plan_interest`
        });

      if (error) {
        console.error('Error inserting lead:', error);
        throw error;
      }

      toast({
        title: "✅ Interesse registado com sucesso!",
        description: `Recebemos o seu interesse no plano ${planName}. Entraremos em contacto nas próximas 24h.`,
      });
      
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        instagram_site: "",
        company_name: "",
        message: "",
        plan: planName,
        gdpr_consent: false,
        marketing_consent: false
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Interesse no Plano {planName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+351 123 456 789"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange("whatsapp", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_site">Instagram/Site (opcional)</Label>
            <Input
              id="instagram_site"
              type="text"
              placeholder="@instagram ou www.seusite.com"
              value={formData.instagram_site}
              onChange={(e) => handleInputChange("instagram_site", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Nome da Empresa/Projeto (opcional)</Label>
            <Input
              id="company_name"
              type="text"
              placeholder="Nome da sua empresa ou projeto"
              value={formData.company_name}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Conte-nos mais sobre suas necessidades..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={3}
            />
          </div>

          {/* RGPD Compliance Section */}
          <div className="space-y-4 border-t border-muted pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="gdpr_consent"
                checked={formData.gdpr_consent}
                onCheckedChange={(checked) => handleInputChange("gdpr_consent", checked as boolean)}
                required
              />
              <div className="space-y-1 leading-none">
                <Label 
                  htmlFor="gdpr_consent" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Aceito a recolha e processamento dos meus dados pessoais *
                </Label>
                <p className="text-xs text-muted-foreground">
                  Os seus dados serão utilizados para processar o seu pedido e entrar em contacto consigo. 
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
                checked={formData.marketing_consent}
                onCheckedChange={(checked) => handleInputChange("marketing_consent", checked as boolean)}
              />
              <div className="space-y-1 leading-none">
                <Label 
                  htmlFor="marketing_consent" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Aceito receber comunicações de marketing (opcional)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pode cancelar a subscrição a qualquer momento através dos links de cancelamento 
                  ou entrando em contacto connosco.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              id="pricing-form-submit-button"
              disabled={isSubmitting || !formData.gdpr_consent}
              className="flex-1 bg-senvia-500 hover:bg-senvia-600 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar Interesse"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PricingFormModal;