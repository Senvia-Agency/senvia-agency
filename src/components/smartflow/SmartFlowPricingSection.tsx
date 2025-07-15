import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Star, 
  Euro, 
  Calendar,
  Shield,
  Zap
} from "lucide-react";

const SmartFlowPricingSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('cta-final');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Euro className="w-4 h-4 mr-2" />
            Investimento & ROI
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Infraestrutura que se <span className="text-primary">paga sozinha</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Não é um gasto, é um investimento com ROI comprovado e garantia de performance
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
            {/* Popular Badge */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-primary text-primary-foreground px-6 py-2">
                <Star className="w-4 h-4 mr-2" />
                Mais Escolhido
              </Badge>
            </div>

            <CardHeader className="text-center pt-12 pb-8">
              <CardTitle className="text-3xl mb-4">Site + n8n SmartFlow</CardTitle>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl text-muted-foreground line-through">€1.200</span>
                  <span className="text-5xl font-bold text-primary">€897</span>
                </div>
                <p className="text-muted-foreground">Oferta de lançamento limitada</p>
                <Badge variant="destructive" className="mx-auto">
                  Apenas 10 vagas disponíveis
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {/* What's Included */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-center">O que está incluído:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Site Lightning (Core Web Vitals &gt; 90)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Copy CRO orientado a conversão</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Formulário Smart anti-spam</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Automação n8n completa</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Dashboard Looker Studio</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Treinamento da equipe</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-card/50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Garantias incluídas:
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">15</div>
                    <div>dias para entrega ou reembolso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">60s</div>
                    <div>resposta automática garantida</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">+20%</div>
                    <div>conversões ou otimizamos grátis</div>
                  </div>
                </div>
              </div>

              {/* ROI Calculation */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8">
                <h4 className="font-semibold mb-4 text-center">Cálculo do ROI:</h4>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-muted-foreground">Investimento</div>
                    <div className="text-2xl font-bold text-primary">€897</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-muted-foreground">ROI estimado (30 dias)</div>
                    <div className="text-2xl font-bold text-green-600">€2.400+</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-muted-foreground">Payback</div>
                    <div className="text-2xl font-bold text-accent">11 dias</div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="text-center mb-8">
                <h4 className="font-semibold mb-4">Opções de pagamento:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <h5 className="font-semibold mb-2">À Vista</h5>
                    <div className="text-2xl font-bold text-primary mb-1">€897</div>
                    <div className="text-sm text-muted-foreground">Desconto de €303</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <h5 className="font-semibold mb-2">Parcelado</h5>
                    <div className="text-2xl font-bold text-primary mb-1">2x €600</div>
                    <div className="text-sm text-muted-foreground">Sem juros</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  size="lg"
                  onClick={scrollToContact}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Garantir Minha Vaga
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Processo de qualificação • Apenas projetos B2B €20k+/mês
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why This Price */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Por que este preço?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Se fosse contratar separadamente:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Desenvolvedor web (40h)</span>
                      <span>€2.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Copywriter CRO (15h)</span>
                      <span>€750</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Especialista n8n (20h)</span>
                      <span>€1.200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Setup analytics (10h)</span>
                      <span>€500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gestão de projeto</span>
                      <span>€300</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total separadamente:</span>
                      <span>€4.750</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Com o SmartFlow:</h4>
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary mb-2">€897</div>
                      <div className="text-sm text-muted-foreground">
                        Economia de <span className="text-primary font-semibold">€3.853</span> vs. mercado
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        <span>Equipe integrada e processo otimizado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        <span>15 dias vs. 2-3 meses no mercado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        <span>Garantias que ninguém oferece</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        <span>ROI comprovado em 30 dias</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SmartFlowPricingSection;