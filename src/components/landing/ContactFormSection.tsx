import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactFormSection = () => {
  const handleOpenForm = () => {
    window.open("https://app.senvia.pt/c/senvia-agency/formulario-lp", "_blank");
  };

  return (
    <section id="form" className="py-16 md:py-24 px-4 bg-gradient-to-br from-senvia-500/5 via-transparent to-senvia-400/5">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
          O seu tráfego merece um{" "}
          <span className="text-gradient">destino melhor.</span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2 leading-relaxed mb-10 md:mb-14">
          Pare de deixar dinheiro na mesa com sites estáticos. Tenha hoje uma estrutura que trabalha 24/7 para encher a agenda da sua equipa comercial.
        </p>

        <Button 
          size="lg"
          onClick={handleOpenForm}
          className="text-lg md:text-xl px-10 md:px-14 py-6 md:py-8 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ color: '#000000' }}
        >
          <span className="flex items-center gap-3 font-semibold">
            Agendar Sessão de Diagnóstico Gratuito
            <ArrowRight className="h-6 w-6" />
          </span>
        </Button>

        <p 
          className="text-sm text-muted-foreground/70 italic mt-8 cursor-pointer hover:text-muted-foreground transition-colors"
          onClick={handleOpenForm}
        >
          Prefiro continuar com a minha página atual e arriscar perder leads.
        </p>
      </div>
    </section>
  );
};

export default ContactFormSection;
