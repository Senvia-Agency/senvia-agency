import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Clock, 
  Euro, 
  Target,
  Quote,
  Star
} from "lucide-react";

const SmartFlowCaseStudySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Target className="w-4 h-4 mr-2" />
            Case Study Real
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Como a <span className="text-primary">TechFlow B2B</span> aumentou 127% suas conversões
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Projeto B2B de gestão, implementado em 14 dias, com resultados mensuráveis em 30 dias
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Before */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                Antes da Implementação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Taxa de conversão:</span>
                <span className="font-semibold text-destructive">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tempo de resposta:</span>
                <span className="font-semibold text-destructive">6-24 horas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Leads qualificados/mês:</span>
                <span className="font-semibold text-destructive">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Velocidade do site:</span>
                <span className="font-semibold text-destructive">3.8s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ROI mensal:</span>
                <span className="font-semibold text-destructive">€1.2k</span>
              </div>
            </CardContent>
          </Card>

          {/* After */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Após SmartFlow (30 dias)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Taxa de conversão:</span>
                <span className="font-semibold text-green-600">4.8% (+127%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tempo de resposta:</span>
                <span className="font-semibold text-green-600">52 segundos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Leads qualificados/mês:</span>
                <span className="font-semibold text-green-600">61 (+165%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Velocidade do site:</span>
                <span className="font-semibold text-green-600">0.9s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ROI mensal:</span>
                <span className="font-semibold text-green-600">€3.8k (+217%)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Results */}
        <Card className="mb-16 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Resultados em Números</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-primary">127%</span>
                </div>
                <p className="text-sm text-muted-foreground">Aumento na conversão</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Euro className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-primary">€31k</span>
                </div>
                <p className="text-sm text-muted-foreground">Receita adicional (3 meses)</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-primary">14</span>
                </div>
                <p className="text-sm text-muted-foreground">Dias para implementar</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-primary">2.8x</span>
                </div>
                <p className="text-sm text-muted-foreground">ROI em 90 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>O que foi implementado</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Site Lightning:</strong> Next.js com Core Web Vitals 94/100
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Copy CRO:</strong> Headlines focadas em dor-ganho B2B
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Formulário Smart:</strong> Qualificação automática por empresa size
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>n8n Automation:</strong> HubSpot + Slack + email personalizado
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Dashboard:</strong> Looker Studio com métricas em tempo real
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline do projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Dias 1-3: Pesquisa</h4>
                    <p className="text-sm text-muted-foreground">Análise B2B, personas, concorrência</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Dias 4-8: Desenvolvimento</h4>
                    <p className="text-sm text-muted-foreground">Site + copy + formulário</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Dias 9-12: Automação</h4>
                    <p className="text-sm text-muted-foreground">n8n flows + integrações</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Dias 13-14: Deploy</h4>
                    <p className="text-sm text-muted-foreground">Testes finais + go-live</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Quote className="w-8 h-8 text-primary/40 flex-shrink-0" />
              <div>
                <blockquote className="text-lg mb-4 font-medium">
                  "Em 14 dias tínhamos uma infraestrutura que funciona 24/7. O ROI foi imediato - já no primeiro mês recuperámos o investimento. A automação n8n é um game-changer, os leads não ficam mais perdidos."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-semibold">Miguel Santos</div>
                    <div className="text-sm text-muted-foreground">CEO, TechFlow B2B</div>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SmartFlowCaseStudySection;