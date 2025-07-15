import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const SmartFlowGuaranteeSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Garantias Sem Precedentes
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Risco <span className="text-primary">zero</span> para você
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Confiamos tanto na nossa metodologia que oferecemos garantias que nenhum concorrente oferece
          </p>
        </div>

        {/* Main Guarantees */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* 15 Days Guarantee */}
          <Card className="text-center group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Entrega em 15 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Se não entregarmos em 15 dias úteis, você recebe 100% do dinheiro de volta.
              </p>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Reembolso garantido</div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Guarantee */}
          <Card className="text-center group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">+20% Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Se não aumentarmos suas conversões em 20% nos primeiros 60 dias, otimizamos grátis.
              </p>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary mb-1">60</div>
                <div className="text-sm text-muted-foreground">dias para garantia</div>
              </div>
            </CardContent>
          </Card>

          {/* Response Time Guarantee */}
          <Card className="text-center group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Resposta em 60s</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Garantimos resposta automática em menos de 60 segundos ou ajustamos o sistema.
              </p>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary mb-1">&lt; 60s</div>
                <div className="text-sm text-muted-foreground">Resposta garantida</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Guarantees */}
        <Card className="mb-16 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Garantias Adicionais</CardTitle>
            <p className="text-muted-foreground">Porque queremos que você tenha certeza absoluta</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Suporte 30 Dias</h4>
                    <p className="text-sm text-muted-foreground">
                      Suporte técnico completo por 30 dias após a entrega, incluindo ajustes e otimizações.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Documentação Completa</h4>
                    <p className="text-sm text-muted-foreground">
                      Manual de uso, vídeos de treinamento e documentação técnica para sua equipe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Atualizações de Segurança</h4>
                    <p className="text-sm text-muted-foreground">
                      Manutenção de segurança e atualizações críticas por 90 dias sem custo adicional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Backup Automático</h4>
                    <p className="text-sm text-muted-foreground">
                      Sistema de backup automático configurado para proteger seus dados e configurações.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Transferência de Propriedade</h4>
                    <p className="text-sm text-muted-foreground">
                      Todos os códigos, acessos e propriedade intelectual são transferidos 100% para você.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Monitoramento Inicial</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitoramento 24/7 dos primeiros 30 dias para garantir estabilidade total.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Reversal */}
        <Card className="bg-gradient-to-r from-green-500/10 to-primary/10 border-green-500/20">
          <CardContent className="p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                Reversão Completa de Risco
              </h3>
              
              <p className="text-lg text-muted-foreground mb-6">
                O risco é 100% nosso. Se não cumprirmos qualquer uma das garantias acima, 
                você não paga nada e ainda pode ficar com todo o trabalho já desenvolvido.
              </p>

              <div className="bg-card rounded-lg p-6 border border-green-500/20">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold">Aviso Importante</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta oferta é limitada a <strong>10 projetos por mês</strong> devido à nossa capacidade de entrega 
                  com qualidade. Garantimos essas condições apenas enquanto temos vagas disponíveis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SmartFlowGuaranteeSection;