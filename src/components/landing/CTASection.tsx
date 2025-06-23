
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-senvia-500/20 via-transparent to-senvia-400/20">
      <div className="container mx-auto text-center">
        <Button 
          size="lg" 
          className="text-xl px-10 py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300"
          style={{ color: '#000000' }}
          onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Solicitar minha estrutura personalizada
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
