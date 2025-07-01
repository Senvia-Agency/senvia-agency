
import { useState } from "react";
import { ArrowRight, Target, TrendingUp, Users, Euro, Eye, MousePointer, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CampaignPresentation = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Dados de performance da campanha
  const performanceData = [
    { day: "Sem 1", leads: 25, custo: 22.5, cpl: 0.90 },
    { day: "Sem 2", leads: 30, custo: 24.0, cpl: 0.80 },
    { day: "Sem 3", leads: 28, custo: 23.8, cpl: 0.85 },
    { day: "Sem 4", leads: 35, custo: 28.0, cpl: 0.80 },
  ];

  const metricsData = [
    { metric: "CPC", value: 0.28, target: 0.30, status: "success" },
    { metric: "CPL", value: 0.84, target: 0.90, status: "success" },
    { metric: "CTR", value: 4.2, target: 3.5, status: "success" },
    { metric: "CPM", value: 5.80, target: 6.00, status: "success" },
  ];

  const audienceData = [
    { name: "Mulheres 25-35", value: 35, color: "#00c3ff" },
    { name: "Mulheres 36-45", value: 28, color: "#0099cc" },
    { name: "Homens 25-35", value: 20, color: "#007599" },
    { name: "Homens 36-45", value: 17, color: "#004e66" },
  ];

  const campaignData = [
    { name: "Quero Viajar", leads: 78, custo: 66.72, cpl: 0.86 },
    { name: "Top Destinos 2025", leads: 22, custo: 20.68, cpl: 0.94 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-senvia-500/5">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Relatório de Campanha</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Filipa e Tiago Viagens - Resultados Setembro 2024
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-lg py-2 px-4">
                <Target className="w-4 h-4 mr-2" />
                100 Leads Alcançados
              </Badge>
              <Badge variant="outline" className="text-lg py-2 px-4">
                <Euro className="w-4 h-4 mr-2" />
                CPL: €0,84
              </Badge>
              <Badge variant="outline" className="text-lg py-2 px-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                ROI: 420%
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="audience">Audiência</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                    <Users className="h-4 w-4 text-senvia-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-senvia-500">118</div>
                    <p className="text-xs text-muted-foreground">
                      +18% vs objetivo (100)
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                    <Euro className="h-4 w-4 text-senvia-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-senvia-500">€99,40</div>
                    <p className="text-xs text-muted-foreground">
                      €3,31/dia em média
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Custo por Lead</CardTitle>
                    <Target className="h-4 w-4 text-senvia-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-senvia-500">€0,84</div>
                    <p className="text-xs text-muted-foreground">
                      7% abaixo do objetivo (€0,90)
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                    <MousePointer className="h-4 w-4 text-senvia-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-senvia-500">24,3%</div>
                    <p className="text-xs text-muted-foreground">
                      +4,3% vs objetivo (20%)
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                <CardHeader>
                  <CardTitle>Evolução Semanal dos Leads</CardTitle>
                  <CardDescription>
                    Performance das campanhas ao longo do mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      leads: {
                        label: "Leads",
                        color: "hsl(var(--senvia-500))",
                      },
                      custo: {
                        label: "Custo",
                        color: "hsl(var(--muted-foreground))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="leads" 
                          stroke="#00c3ff" 
                          strokeWidth={3}
                          dot={{ fill: "#00c3ff", strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricsData.map((metric) => (
                  <Card key={metric.metric} className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-senvia-500">
                        {metric.metric === "CTR" ? `${metric.value}%` : `€${metric.value}`}
                      </div>
                      <div className="flex items-center mt-2">
                        <Badge variant={metric.status === "success" ? "default" : "destructive"}>
                          {metric.status === "success" ? "✓ Objetivo alcançado" : "⚠ Abaixo do objetivo"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Campaign Performance */}
              <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                <CardHeader>
                  <CardTitle>Performance por Campanha</CardTitle>
                  <CardDescription>
                    Comparação entre as duas campanhas ativas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      leads: {
                        label: "Leads",
                        color: "hsl(var(--senvia-500))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={campaignData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="leads" fill="#00c3ff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
              {/* Audience Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader>
                    <CardTitle>Distribuição por Género e Idade</CardTitle>
                    <CardDescription>
                      Segmentação do público que mais converteu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        audience: {
                          label: "Audiência",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={audienceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {audienceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader>
                    <CardTitle>Insights da Audiência</CardTitle>
                    <CardDescription>
                      Principais descobertas sobre o público-alvo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-senvia-500/10 rounded-lg">
                      <h4 className="font-semibold text-senvia-500 mb-2">🎯 Público Principal</h4>
                      <p className="text-sm text-muted-foreground">
                        Mulheres de 25-35 anos representam 35% dos leads, com maior taxa de conversão em Lisboa e Porto.
                      </p>
                    </div>
                    <div className="p-4 bg-senvia-500/10 rounded-lg">
                      <h4 className="font-semibold text-senvia-500 mb-2">📱 Dispositivos</h4>
                      <p className="text-sm text-muted-foreground">
                        78% dos leads vieram de dispositivos móveis, principalmente durante o horário noturno (19h-22h).
                      </p>
                    </div>
                    <div className="p-4 bg-senvia-500/10 rounded-lg">
                      <h4 className="font-semibold text-senvia-500 mb-2">🌍 Interesses</h4>
                      <p className="text-sm text-muted-foreground">
                        Maior interesse em destinos exóticos (Maldivas, Tailândia) e viagens em grupo para Marrocos.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader>
                    <CardTitle className="text-senvia-500">🚀 Próximos Passos</CardTitle>
                    <CardDescription>
                      Recomendações para otimizar ainda mais os resultados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-senvia-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Aumentar Budget</h4>
                        <p className="text-sm text-muted-foreground">
                          Expandir para €5/dia devido aos excelentes resultados (CPL abaixo do objetivo).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-senvia-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Campanhas por Destino</h4>
                        <p className="text-sm text-muted-foreground">
                          Criar campanhas específicas para Marrocos, Maldivas e Tailândia.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-senvia-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Automação WhatsApp</h4>
                        <p className="text-sm text-muted-foreground">
                          Implementar chatbot para qualificação automática dos leads.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-senvia-500/20">
                  <CardHeader>
                    <CardTitle className="text-senvia-500">📅 Plano Próximo Mês</CardTitle>
                    <CardDescription>
                      Calendário estratégico para outubro 2024
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-senvia-500" />
                        <span className="font-semibold">Semana 1</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Lançar campanha "Marrocos Outubro" com foco em grupos
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-senvia-500" />
                        <span className="font-semibold">Semana 2</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Teste A/B: Vídeos vs. Imagens para destinos exóticos
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-senvia-500" />
                        <span className="font-semibold">Semana 3-4</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Otimização baseada em dados + preparação Novembro
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Meta Goals */}
              <Card className="bg-gradient-to-r from-senvia-500/20 to-senvia-400/20 border-senvia-500/30">
                <CardHeader>
                  <CardTitle className="text-senvia-500">🎯 Objetivos Outubro 2024</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-senvia-500 mb-2">150</div>
                      <p className="text-sm text-muted-foreground">Leads Qualificados</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-senvia-500 mb-2">€0,75</div>
                      <p className="text-sm text-muted-foreground">CPL Objetivo</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-senvia-500 mb-2">€150</div>
                      <p className="text-sm text-muted-foreground">Budget Mensal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CampaignPresentation;
