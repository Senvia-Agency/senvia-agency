import { TrendingUp, Calendar, Euro, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const PacCaseStudySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Case Study: Transformação Real
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Como uma empresa de SaaS B2B aumentou 131% sua conversão em apenas 17 dias
            </p>
          </div>

          {/* Case Study Card */}
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-muted/30">
            <CardHeader className="pb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    SaaS B2B - Gestão de Projetos
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Software de gestão para equipas de desenvolvimento • Ticket médio: €89/mês
                  </p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <span className="text-primary font-semibold text-sm">17 dias para resultado</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Antes */}
                <div className="text-center p-6 rounded-2xl bg-muted/50 border border-border">
                  <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Situação Anterior
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">1,9%</div>
                  <div className="text-muted-foreground">Taxa de conversão</div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-lg font-semibold text-foreground">127 leads/mês</div>
                    <div className="text-sm text-muted-foreground">de 6.700 visitantes</div>
                  </div>
                </div>

                {/* Seta */}
                <div className="flex items-center justify-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Depois */}
                <div className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                    Após PAC Growth
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">4,4%</div>
                  <div className="text-primary font-semibold">Taxa de conversão</div>
                  
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <div className="text-lg font-semibold text-primary">295 leads/mês</div>
                    <div className="text-sm text-primary/80">mesmo tráfego</div>
                  </div>
                </div>
              </div>

              {/* Resultado */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">+131%</div>
                    <div className="text-sm opacity-90">Aumento conversão</div>
                  </div>
                  
                  <div>
                    <Euro className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">+€14.952</div>
                    <div className="text-sm opacity-90">Receita adicional/mês</div>
                  </div>
                  
                  <div>
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">17 dias</div>
                    <div className="text-sm opacity-90">Payback total</div>
                  </div>
                </div>
              </div>

              {/* O que fizemos */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-foreground mb-4">O que implementámos:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Novo hero section focado em benefícios</li>
                    <li>✓ Prova social com case studies reais</li>
                    <li>✓ Calculadora ROI interativa</li>
                    <li>✓ Formulário multi-step qualificado</li>
                    <li>✓ Automação de email marketing</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-foreground mb-4">Timeline do projeto:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Dia 1: Auditoria e diagnóstico</li>
                    <li>• Dias 2-5: Wireframes e copywriting</li>
                    <li>• Dias 6-10: Design e desenvolvimento</li>
                    <li>• Dias 11-14: Testes e otimizações</li>
                    <li>• Dia 17: Primeiro resultado significativo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial */}
          <div className="mt-12 text-center">
            <blockquote className="text-xl italic text-muted-foreground mb-4 max-w-3xl mx-auto">
              "Não acreditávamos que fosse possível dobrar nossa conversão tão rapidamente. 
              O ROI foi imediato e agora temos um sistema que gera leads qualificados constantemente."
            </blockquote>
            <cite className="text-foreground font-semibold">
              João Silva, CEO da TechFlow
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PacCaseStudySection;