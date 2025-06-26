
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 bg-gradient-to-br from-senvia-500/10 via-transparent to-senvia-400/10">
      <div className="container mx-auto text-center max-w-6xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Transforme sua presença digital em uma{" "}
            <span className="text-gradient">máquina de captação de clientes</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A estrutura completa, profissional e automatizada para quem quer atrair, 
            nutrir e converter clientes — sem depender de plataformas complicadas.
          </p>
          
          <Button 
            size="lg" 
            className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 mb-8 md:mb-12 w-full sm:w-auto"
            style={{ color: '#000000' }}
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Quero a minha estrutura inteligente
            <ArrowRight className="ml-2 h-5 w-5" />
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
              "Empreendedores em Portugal e no Brasil já estão usando nossas estruturas para captar leads todos os dias com previsibilidade."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
