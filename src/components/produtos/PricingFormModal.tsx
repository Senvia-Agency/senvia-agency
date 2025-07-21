import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
    plan: planName
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aqui você implementará a lógica para salvar no banco
      console.log("Form data:", formData);
      
      toast({
        title: "Interesse registrado!",
        description: `Recebemos seu interesse no plano ${planName}. Entraremos em contato em breve.`,
      });
      
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        instagram_site: "",
        company_name: "",
        message: "",
        plan: planName
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
              disabled={isSubmitting}
              className="flex-1 bg-senvia-500 hover:bg-senvia-600"
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