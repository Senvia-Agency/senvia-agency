import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateIALead } from "@/hooks/useIALeads";
import { Check } from "lucide-react";

interface AIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIModal = ({ open, onOpenChange }: AIModalProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    company_name: ''
  });
  
  const createLead = useCreateIALead();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createLead.mutateAsync({
        ...formData,
        lead_status: 'new',
        source_page: 'ai_landing'
      });
      
      // Reset form and close modal
      setFormData({
        full_name: '',
        whatsapp: '',
        email: '',
        company_name: ''
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
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
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] w-full mx-2 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3 px-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white px-1">
            Diagnóstico de IA Empresarial
          </DialogTitle>
          <p className="text-sm sm:text-base px-2 leading-relaxed">
            Descubra como a inteligência artificial pode automatizar processos, 
            reduzir custos e aumentar a eficiência do seu negócio.
          </p>
        </DialogHeader>

        {/* Benefits */}
        <div className="space-y-2 sm:space-y-3 my-4 sm:my-6 px-2">
          <div className="flex items-center gap-2 sm:gap-3 text-green-400">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Diagnóstico: Identificamos as oportunidades</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-green-400">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Implementação: Desenvolvemos e integramos tudo</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-green-400">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Resultado: Você foca no negócio, nós na tecnologia</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 text-center mb-4 sm:mb-6 mx-2">
          <p className="text-slate-300 text-xs sm:text-sm">
            <span className="text-white font-semibold">Da análise ao sistema rodando:</span> 60 dias em média.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 sm:p-3 mb-4 sm:mb-6 mx-2">
          <p className="text-orange-300 text-xs sm:text-sm text-center">
            <span className="font-semibold">Vagas limitadas:</span> Fechamos apenas 3 novos projetos por semana.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 px-2">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="name" className="text-white text-sm">Nome</Label>
            <Input
              id="name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 h-10 sm:h-11 text-sm"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="whatsapp" className="text-white text-sm">WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              required
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 h-10 sm:h-11 text-sm"
              placeholder="+351 9XX XXX XXX"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="email" className="text-white text-sm">Email Empresarial</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 h-10 sm:h-11 text-sm"
              placeholder="seu@empresa.com"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="company" className="text-white text-sm">Empresa (Opcional)</Label>
            <Input
              id="company"
              type="text"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 h-10 sm:h-11 text-sm"
              placeholder="Nome da sua empresa"
            />
          </div>

          <Button
            id="button-ia"
            type="submit"
            disabled={createLead.isPending}
            className="w-full h-11 sm:h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base mt-4 sm:mt-6"
          >
            {createLead.isPending ? 'Enviando...' : 'Agendar Consultoria'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIModal;