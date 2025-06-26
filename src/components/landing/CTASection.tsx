
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-senvia-500/20 via-transparent to-senvia-400/20">
      <div className="container mx-auto text-center max-w-4xl">
        <Button 
          size="lg" 
          className="text-base md:text-lg px-8 md:px-10 py-4 md:py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 w-full sm:w-auto min-h-[56px] md:min-h-[64px]"
          style={{ color: '#000000' }}
          onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="flex items-center justify-center gap-2 px-2">
            Solicitar minha estrutura personalizada
            <ArrowRight className="h-5 w-5 flex-shrink-0" />
          </span>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
