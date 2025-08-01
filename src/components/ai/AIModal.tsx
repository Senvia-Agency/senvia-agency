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
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-bold text-white">
            Diagnóstico de IA Empresarial
          </DialogTitle>
          <p className="text-slate-300 text-base">
            Descubra como a inteligência artificial pode automatizar processos, 
            reduzir custos e aumentar a eficiência do seu negócio.
          </p>
        </DialogHeader>

        {/* Benefits */}
        <div className="space-y-3 my-6">
          <div className="flex items-center gap-3 text-green-400">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Diagnóstico: Identificamos as oportunidades</span>
          </div>
          <div className="flex items-center gap-3 text-green-400">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Implementação: Desenvolvemos e integramos tudo</span>
          </div>
          <div className="flex items-center gap-3 text-green-400">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Resultado: Você foca no negócio, nós na tecnologia</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-800/50 rounded-lg p-4 text-center mb-6">
          <p className="text-slate-300 text-sm">
            <span className="text-white font-semibold">Da análise ao sistema rodando:</span> 60 dias em média.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-6">
          <p className="text-orange-300 text-sm text-center">
            <span className="font-semibold">Vagas limitadas:</span> Fechamos apenas 3 novos projetos por semana.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome</Label>
            <Input
              id="name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              required
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="+351 9XX XXX XXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Empresarial</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="seu@empresa.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">Empresa (Opcional)</Label>
            <Input
              id="company"
              type="text"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="Nome da sua empresa"
            />
          </div>

          <Button
            type="submit"
            disabled={createLead.isPending}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {createLead.isPending ? 'Enviando...' : 'Agendar Consultoria'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIModal;