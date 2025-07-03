
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MetaPixel from "@/components/MetaPixel";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Obrigado - SENVIA";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MetaPixel />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-senvia-500/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-senvia-400" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Obrigado!</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Recebemos o seu pedido de proposta para a criação da sua estrutura inteligente de captação de clientes.
            </p>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-senvia-500/20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">O que acontece agora?</h2>
              
              <div className="space-y-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="bg-senvia-500/10 rounded-full w-8 h-8 flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-senvia-400">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Análise do seu projeto</h3>
                    <p className="text-muted-foreground">
                      Nossa equipa irá analisar as suas necessidades e objetivos para criar uma proposta personalizada.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-senvia-500/10 rounded-full w-8 h-8 flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-senvia-400">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Contacto em 24h</h3>
                    <p className="text-muted-foreground">
                      Entraremos em contacto consigo nas próximas 24 horas úteis via WhatsApp ou e-mail.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-senvia-500/10 rounded-full w-8 h-8 flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-senvia-400">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Proposta detalhada</h3>
                    <p className="text-muted-foreground">
                      Apresentaremos uma proposta completa com cronograma, investimento e estrutura personalizada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300"
                style={{ color: '#000000' }}
              >
                Voltar ao início
              </Button>
              
              <Button 
                onClick={() => navigate('/landing-pages')}
                variant="outline"
                className="px-8 py-3 border-senvia-500 text-senvia-500 hover:bg-senvia-500/10"
              >
                Saber mais sobre o serviço
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
