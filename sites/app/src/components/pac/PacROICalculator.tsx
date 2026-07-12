import { useState } from "react";
import { Calculator, TrendingUp, Euro } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const PacROICalculator = () => {
  const [traffic, setTraffic] = useState("");
  const [currentCR, setCurrentCR] = useState("");
  const [ticketMedio, setTicketMedio] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    if (!traffic || !currentCR || !ticketMedio) return;
    setShowResults(true);
  };

  const trafficNum = parseInt(traffic) || 0;
  const currentCRNum = parseFloat(currentCR) || 0;
  const ticketNum = parseFloat(ticketMedio) || 0;

  // Cálculos
  const currentLeads = Math.round((trafficNum * currentCRNum) / 100);
  const currentRevenue = currentLeads * ticketNum;
  
  // Com 100% de aumento (dobrar)
  const newCR = currentCRNum * 2;
  const newLeads = Math.round((trafficNum * newCR) / 100);
  const newRevenue = newLeads * ticketNum;
  const additionalRevenue = newRevenue - currentRevenue;
  
  // ROI calculation (investimento de €1200)
  const investment = 1200;
  const roi = ((additionalRevenue - investment) / investment) * 100;
  const paybackDays = Math.round((investment / (additionalRevenue / 30)));

  return (
    <section id="roi-calculator" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Calculator className="w-4 h-4 mr-2" />
              Calculadora ROI
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Calcule seu potencial de crescimento
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Veja quanto você pode ganhar dobrando sua taxa de conversão em 30 dias
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Insira seus dados atuais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="traffic" className="text-sm font-semibold">
                    Visitantes únicos/mês
                  </Label>
                  <Input
                    id="traffic"
                    type="number"
                    placeholder="Ex: 5000"
                    value={traffic}
                    onChange={(e) => setTraffic(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="conversion" className="text-sm font-semibold">
                    Taxa de conversão atual (%)
                  </Label>
                  <Input
                    id="conversion"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 2.5"
                    value={currentCR}
                    onChange={(e) => setCurrentCR(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="ticket" className="text-sm font-semibold">
                    Ticket médio (€)
                  </Label>
                  <Input
                    id="ticket"
                    type="number"
                    placeholder="Ex: 500"
                    value={ticketMedio}
                    onChange={(e) => setTicketMedio(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button 
                  onClick={calculateROI}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!traffic || !currentCR || !ticketMedio}
                >
                  Calcular Meu ROI
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {showResults ? (
                <>
                  <Card className="p-6 bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-primary flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Situação Atual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Leads/mês:</span>
                        <span className="font-bold">{currentLeads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Faturamento/mês:</span>
                        <span className="font-bold">€{currentRevenue.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 bg-secondary/5 border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-secondary flex items-center">
                        <Euro className="w-5 h-5 mr-2" />
                        Com PAC Growth (2x conversão)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Nova taxa conversão:</span>
                        <span className="font-bold">{newCR.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Novos leads/mês:</span>
                        <span className="font-bold">{newLeads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Novo faturamento/mês:</span>
                        <span className="font-bold">€{newRevenue.toLocaleString()}</span>
                      </div>
                      <hr className="border-secondary/20" />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Receita adicional/mês:</span>
                        <span className="font-bold text-secondary">€{additionalRevenue.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 bg-gradient-to-r from-primary to-secondary text-white">
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          {roi > 0 ? `${roi.toFixed(0)}%` : 'N/A'}
                        </div>
                        <div className="text-sm opacity-90">ROI em 30 dias</div>
                      </div>
                      
                      {paybackDays > 0 && paybackDays < 90 && (
                        <div className="text-center">
                          <div className="text-xl font-bold">
                            {paybackDays} dias
                          </div>
                          <div className="text-sm opacity-90">Payback do investimento</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="p-8 text-center border-dashed border-2 border-border">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Preencha os campos ao lado
                  </h3>
                  <p className="text-muted-foreground">
                    Para ver o potencial de crescimento do seu negócio
                  </p>
                </Card>
              )}
            </div>
          </div>

          {showResults && additionalRevenue > 0 && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                🚀 Agora veja como podemos implementar isso para você
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PacROICalculator;