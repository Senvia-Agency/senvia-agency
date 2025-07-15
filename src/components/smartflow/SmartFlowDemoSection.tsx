import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  FormInput, 
  Workflow, 
  Gauge,
  Play,
  ExternalLink
} from "lucide-react";

const SmartFlowDemoSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Play className="w-4 h-4 mr-2" />
            Demonstrações Visuais
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Veja a <span className="text-primary">tecnologia</span> em ação
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Cada componente foi testado e otimizado para máxima performance e conversão
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Core Web Vitals Demo */}
          <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gauge className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle>Performance Lightning</CardTitle>
                  <p className="text-sm text-muted-foreground">Core Web Vitals &gt; 90</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/20 rounded-lg p-6 mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">98</div>
                    <div className="text-xs text-muted-foreground">Performance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">95</div>
                    <div className="text-xs text-muted-foreground">SEO</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">92</div>
                    <div className="text-xs text-muted-foreground">Accessibility</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    Carregamento: 0.8s
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Antes:</span>
                  <span className="text-destructive">3.2s</span>
                </div>
                <div className="flex justify-between">
                  <span>Depois:</span>
                  <span className="text-green-500">0.8s</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Melhoria:</span>
                  <span className="text-primary">75% mais rápido</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Form Demo */}
          <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FormInput className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle>Formulário Smart</CardTitle>
                  <p className="text-sm text-muted-foreground">Validação + UX otimizada</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Validação em tempo real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">reCAPTCHA invisível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Campos dinâmicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Qualificação automática</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Taxa abandono:</span>
                  <span className="text-green-500">-45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Leads qualificados:</span>
                  <span className="text-green-500">+68%</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Spam bloqueado:</span>
                  <span className="text-primary">99.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* n8n Flow Visualization */}
        <Card className="mb-16 overflow-hidden">
          <CardHeader className="text-center">
            <div className="inline-flex items-center gap-3 mx-auto mb-4">
              <Workflow className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Fluxo n8n em 60 Segundos</CardTitle>
            </div>
            <p className="text-muted-foreground">Da captura do lead até a resposta automática</p>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/20 rounded-lg p-8">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    1
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Lead Submete</h4>
                  <p className="text-xs text-muted-foreground">Formulário preenchido</p>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-full h-0.5 bg-primary/20"></div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    2
                  </div>
                  <h4 className="font-semibold text-sm mb-2">n8n Processa</h4>
                  <p className="text-xs text-muted-foreground">Dados validados</p>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-full h-0.5 bg-primary/20"></div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    3
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Múltiplas Ações</h4>
                  <p className="text-xs text-muted-foreground">CRM + Slack + Email</p>
                </div>
              </div>
              
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 text-center">
                  <h5 className="font-semibold text-sm mb-2">→ CRM</h5>
                  <p className="text-xs text-muted-foreground">Lead adicionado automaticamente</p>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <h5 className="font-semibold text-sm mb-2">→ Slack/WhatsApp</h5>
                  <p className="text-xs text-muted-foreground">Notificação instantânea</p>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <h5 className="font-semibold text-sm mb-2">→ Email</h5>
                  <p className="text-xs text-muted-foreground">Resposta personalizada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Preview */}
        <Card className="overflow-hidden">
          <CardHeader className="text-center">
            <div className="inline-flex items-center gap-3 mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Dashboard Looker Studio</CardTitle>
            </div>
            <p className="text-muted-foreground">Transparência total das suas métricas</p>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/20 rounded-lg p-6">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">24.5%</div>
                  <div className="text-xs text-muted-foreground">Taxa Conversão</div>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">47s</div>
                  <div className="text-xs text-muted-foreground">Tempo Resposta</div>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">156</div>
                  <div className="text-xs text-muted-foreground">Leads este mês</div>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">€8.4k</div>
                  <div className="text-xs text-muted-foreground">ROI gerado</div>
                </div>
              </div>
              
              <div className="text-center">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview do Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SmartFlowDemoSection;