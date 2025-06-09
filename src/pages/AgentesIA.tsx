import { ArrowRight, Bot, MessageSquare, Zap, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AgentesIA = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Agentes de IA</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolucione o seu atendimento ao cliente com agentes de inteligência artificial avançados. 
              Atendimento 24/7, respostas instantâneas e experiência personalizada para cada cliente.
            </p>
            <Link 
              to="/#contacto" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300"
            >
              Implementar IA Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Bot className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Chatbots Inteligentes</h3>
              <p className="text-muted-foreground">Agentes virtuais que compreendem e respondem naturalmente às questões dos clientes.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <MessageSquare className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Atendimento 24/7</h3>
              <p className="text-muted-foreground">Suporte contínuo aos seus clientes, mesmo fora do horário comercial.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Zap className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Automatização</h3>
              <p className="text-muted-foreground">Automatize processos repetitivos e liberte a sua equipa para tarefas estratégicas.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Brain className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Aprendizagem Contínua</h3>
              <p className="text-muted-foreground">IA que evolui e melhora constantemente com cada interação.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Benefícios dos Agentes de IA</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Redução de Custos</h4>
                    <p className="text-muted-foreground">Diminua os custos operacionais de atendimento em até 60%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Resposta Instantânea</h4>
                    <p className="text-muted-foreground">Tempos de resposta de segundos, melhorando a experiência do cliente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Escalabilidade</h4>
                    <p className="text-muted-foreground">Atenda milhares de clientes simultaneamente sem limitações</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Personalização</h4>
                    <p className="text-muted-foreground">Respostas personalizadas baseadas no histórico e preferências</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Integração Completa</h4>
                    <p className="text-muted-foreground">Conecta-se aos seus sistemas existentes e bases de dados</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Analytics Avançado</h4>
                    <p className="text-muted-foreground">Relatórios detalhados sobre interações e satisfação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              <span className="text-gradient">Casos de Uso</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <h4 className="font-semibold mb-4">E-commerce</h4>
                <p className="text-muted-foreground">Assistente de vendas virtual, recomendações de produtos e suporte pós-venda.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <h4 className="font-semibold mb-4">Serviços</h4>
                <p className="text-muted-foreground">Agendamento automático, FAQ inteligente e qualificação de leads.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <h4 className="font-semibold mb-4">Suporte Técnico</h4>
                <p className="text-muted-foreground">Diagnóstico automático, guias de resolução e escalamento inteligente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgentesIA;