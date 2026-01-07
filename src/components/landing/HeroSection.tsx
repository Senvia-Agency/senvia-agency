
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 bg-gradient-to-br from-senvia-500/10 via-transparent to-senvia-400/10">
      <div className="container mx-auto text-center max-w-6xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Não construímos apenas páginas. Implementamos{" "}
            <span className="text-gradient">Ecossistemas de Vendas</span> que imprimem dinheiro.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A maioria das agências entrega design. A SENVIA entrega infraestrutura. Transforme o seu tráfego pago em receita previsível com Landing Pages Inteligentes integradas com IA, CRM e Automação de elite.
          </p>
          
          <Button 
            size="lg" 
            className="text-sm md:text-base px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 mb-4 w-full sm:w-auto h-auto min-h-[56px] md:min-h-[64px]"
            style={{ color: '#000000' }}
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="flex items-center justify-center gap-2 text-center font-semibold">
              Quero a minha Estrutura de Vendas
              <ArrowRight className="h-5 w-5 flex-shrink-0" />
            </span>
          </Button>

          <p className="text-sm md:text-base text-muted-foreground">
            <span className="text-senvia-400">Setup completo</span> • <span className="text-senvia-400">Foco em ROI</span> • <span className="text-senvia-400">Tecnologia Proprietária</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
