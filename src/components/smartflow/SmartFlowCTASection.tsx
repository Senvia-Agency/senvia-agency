import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Zap, 
  Clock, 
  Target, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const SmartFlowCTASection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    website: "",
    monthly_revenue: "",
    main_challenge: "",
    timeline: "",
    data_consent: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.data_consent) {
      toast({
        title: "Consentimento necessário",
        description: "Por favor, aceite o tratamento dos dados para continuar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('unified_leads')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company_name,
          website: formData.website,
          interest_type: 'smartflow',
          source_page: '/pac-growth',
          notes: `Receita mensal: ${formData.monthly_revenue} | Principal desafio: ${formData.main_challenge} | Timeline: ${formData.timeline}`,
          objective: 'Site + n8n SmartFlow - Infraestrutura de Aquisição',
          lead_status: 'new',
          priority: 5 // High priority for qualified leads
        });

      if (error) throw error;

      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Nossa equipe entrará em contato em até 2 horas para agendar sua análise gratuita.",
      });

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        website: "",
        monthly_revenue: "",
        main_challenge: "",
        timeline: "",
        data_consent: false
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar",
        description: "Houve um problema ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="cta-final" className="py-20 bg-gradient-to-b from-secondary/10 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="destructive" className="mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Apenas 10 Vagas Disponíveis
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Garanta sua <span className="text-primary">infraestrutura</span> em 15 dias
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Processo de qualificação para projetos B2B com faturamento mínimo de €20k/mês
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Benefits Summary */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  O que você recebe:
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Site Lightning + Copy CRO</h4>
                        <p className="text-sm text-muted-foreground">Core Web Vitals &gt; 90, headlines que convertem</p>
                      </div>
                    </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Automação n8n Completa</h4>
                      <p className="text-sm text-muted-foreground">Lead → CRM → Slack → Email em 60 segundos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Dashboard Looker Studio</h4>
                      <p className="text-sm text-muted-foreground">Métricas em tempo real, ROI transparente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Garantia +20% Conversões</h4>
                      <p className="text-sm text-muted-foreground">Ou otimizamos grátis até atingir</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Urgency Card */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  <h3 className="font-bold text-destructive">Vagas Limitadas</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Limitamos a 10 projetos por mês para garantir a qualidade de entrega em 15 dias. 
                  Próximas vagas disponíveis apenas em <strong>março 2025</strong>.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-destructive">3</div>
                    <div className="text-xs text-muted-foreground">Vagas restantes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">€897</div>
                    <div className="text-xs text-muted-foreground">Preço atual</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">15</div>
                    <div className="text-xs text-muted-foreground">Dias entrega</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Qualification Form */}
          <Card className="sticky top-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Análise de Qualificação</CardTitle>
              <p className="text-muted-foreground">
                Responda algumas perguntas para verificar se seu projeto se qualifica
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nome completo*</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email empresarial*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone/WhatsApp*</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_name">Nome da empresa*</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website atual (se houver)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.suaempresa.com"
                  />
                </div>

                <div>
                  <Label htmlFor="monthly_revenue">Faturamento mensal atual*</Label>
                  <Select onValueChange={(value) => handleInputChange('monthly_revenue', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-20k">€0 - €20k/mês</SelectItem>
                      <SelectItem value="20k-50k">€20k - €50k/mês</SelectItem>
                      <SelectItem value="50k-100k">€50k - €100k/mês</SelectItem>
                      <SelectItem value="100k+">€100k+/mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="main_challenge">Principal desafio atual*</Label>
                  <Textarea
                    id="main_challenge"
                    value={formData.main_challenge}
                    onChange={(e) => handleInputChange('main_challenge', e.target.value)}
                    placeholder="Ex: Leads não convertem, demora na resposta, site lento..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Urgência do projeto*</Label>
                  <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Quando precisa estar pronto?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">O mais rápido possível</SelectItem>
                      <SelectItem value="30-days">Próximos 30 dias</SelectItem>
                      <SelectItem value="60-days">Próximos 60 dias</SelectItem>
                      <SelectItem value="no-rush">Sem pressa específica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="data_consent"
                    checked={formData.data_consent}
                    onCheckedChange={(checked) => handleInputChange('data_consent', checked as boolean)}
                  />
                  <Label htmlFor="data_consent" className="text-xs text-muted-foreground leading-relaxed">
                    Concordo com o tratamento dos meus dados para análise de qualificação e contato comercial. 
                    Política de privacidade disponível no site.
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Solicitar Análise Gratuita
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  ⚡ Resposta em até 2 horas • 🔒 Dados 100% protegidos • 📞 Ligamos para você
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SmartFlowCTASection;