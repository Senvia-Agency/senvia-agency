import { useState } from "react";
import { Calculator, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../../hooks/use-toast";
import { supabase } from "../../integrations/supabase/client";

const PacCTASection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    monthlyRevenue: "",
    currentTraffic: "",
    currentCR: "",
    objective: "Dobrar conversão landing page",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track Facebook Pixel event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'PAC Growth Lead',
          content_category: 'Landing Page Premium',
          value: 1200,
          currency: 'EUR'
        });
      }

      // Insert lead into database
      const { error } = await supabase
        .from('unified_leads')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.companyName,
          website: formData.website,
          objective: formData.objective,
          notes: `Revenue: ${formData.monthlyRevenue} | Traffic: ${formData.currentTraffic} | CR: ${formData.currentCR}% | Notes: ${formData.notes}`,
          interest_type: 'PAC Growth',
          source_page: '/pac-growth',
          lead_status: 'qualified'
        });

      if (error) throw error;

      // Track success event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'CompleteRegistration', {
          content_name: 'PAC Growth Qualified Lead',
          value: 1200,
          currency: 'EUR'
        });
      }

      toast({
        title: "✅ Pedido enviado com sucesso!",
        description: "Entraremos em contato nas próximas 24h para agendar sua análise gratuita.",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        website: "",
        monthlyRevenue: "",
        currentTraffic: "",
        currentCR: "",
        objective: "Dobrar conversão landing page",
        notes: ""
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contato diretamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cta-final" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Comece Agora Sua Transformação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Preencha o formulário abaixo e receba sua análise personalizada gratuita nas próximas 24h
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-muted/30">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center">
                <Calculator className="w-6 h-6 mr-2 text-primary" />
                Análise Gratuita PAC Growth
              </CardTitle>
              <p className="text-muted-foreground">
                Preencha os dados para calcularmos seu potencial de crescimento
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-semibold">
                      Nome completo *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="mt-2"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email empresarial *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2"
                      placeholder="nome@empresa.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold">
                      Telefone/WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-2"
                      placeholder="+351 xxx xxx xxx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-sm font-semibold">
                      Nome da empresa *
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="mt-2"
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-sm font-semibold">
                      Website atual
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="mt-2"
                      placeholder="https://www.exemplo.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyRevenue" className="text-sm font-semibold">
                      Faturamento mensal *
                    </Label>
                    <select
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                      value={formData.monthlyRevenue}
                      onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                      required
                    >
                      <option value="">Selecione o faturamento</option>
                      <option value="10k-20k">€10k - €20k</option>
                      <option value="20k-50k">€20k - €50k</option>
                      <option value="50k-100k">€50k - €100k</option>
                      <option value="100k+">€100k+</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="currentTraffic" className="text-sm font-semibold">
                      Visitantes/mês atual
                    </Label>
                    <Input
                      id="currentTraffic"
                      type="number"
                      value={formData.currentTraffic}
                      onChange={(e) => handleInputChange('currentTraffic', e.target.value)}
                      className="mt-2"
                      placeholder="Ex: 5000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentCR" className="text-sm font-semibold">
                      Taxa conversão atual (%)
                    </Label>
                    <Input
                      id="currentCR"
                      type="number"
                      step="0.1"
                      value={formData.currentCR}
                      onChange={(e) => handleInputChange('currentCR', e.target.value)}
                      className="mt-2"
                      placeholder="Ex: 2.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    Desafio atual ou objetivo específico
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="mt-2"
                    placeholder="Conte-nos qual é seu maior desafio em conversão ou que resultado específico quer alcançar..."
                    rows={4}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Ao enviar, você concorda em receber comunicações da SENVIA sobre o PAC Growth. 
                    Não compartilhamos seus dados e você pode cancelar a qualquer momento.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Solicitar Análise Gratuita
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    ✓ Resposta em 24h • ✓ Análise personalizada • ✓ Sem compromisso
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Final Trust Elements */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Consulta gratuita</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Sem compromisso</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Garantia de resultado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PacCTASection;