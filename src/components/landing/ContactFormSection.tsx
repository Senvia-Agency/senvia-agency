
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LandingPageForm from "./LandingPageForm";

const ContactFormSection = () => {
  return (
    <section id="form" className="py-12 md:py-20 px-4 bg-gradient-to-br from-senvia-500/5 via-transparent to-senvia-400/5">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
            O seu tráfego merece um{" "}
            <span className="text-gradient">destino melhor.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2 leading-relaxed">
            Pare de deixar dinheiro na mesa com sites estáticos. Tenha hoje uma estrutura que trabalha 24/7 para encher a agenda da sua equipa comercial.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-1 sm:px-2">
          <Card className="bg-card/50 backdrop-blur-sm border border-senvia-500/20">
            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="text-center mb-6 md:mb-8">
                <Button 
                  size="lg"
                  className="text-base md:text-lg px-8 md:px-10 py-5 md:py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 h-auto pointer-events-none"
                  style={{ color: '#000000' }}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    Agendar Sessão de Diagnóstico Gratuito
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
                <p className="text-xs md:text-sm text-muted-foreground mt-3">
                  Preencha o formulário abaixo para agendar
                </p>
              </div>
              
              <LandingPageForm />
              
              <div className="text-center mt-6 md:mt-8">
                <p className="text-xs md:text-sm text-muted-foreground/70 italic cursor-pointer hover:text-muted-foreground transition-colors">
                  Prefiro continuar com a minha página atual e arriscar perder leads.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
