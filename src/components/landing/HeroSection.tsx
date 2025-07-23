
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 bg-gradient-to-br from-senvia-500/10 via-transparent to-senvia-400/10">
      <div className="container mx-auto text-center max-w-6xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Landing Pages de alta conversão{" "}
            <span className="text-gradient">+ CRM profissional</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A estrutura completa para captar e gerir leads: Landing page estratégica + CRM integrado + 
            automação de e-mails para o seu negócio crescer com previsibilidade.
          </p>
          
          <Button 
            size="lg" 
            className="text-sm md:text-base px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 mb-8 md:mb-12 w-full sm:w-auto h-auto min-h-[48px] md:min-h-[56px]"
            style={{ color: '#000000' }}
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center leading-tight">
              <span className="text-xs sm:text-sm md:text-base font-medium">
                Quero a minha estrutura
              </span>
              <span className="flex items-center gap-1">
                <span className="text-xs sm:text-sm md:text-base font-medium">inteligente</span>
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </span>
            </span>
          </Button>

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-senvia-500/20 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              "Mais de 200 empresas já usam nossas landing pages + CRM para captar e gerir leads profissionalmente todos os dias."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
