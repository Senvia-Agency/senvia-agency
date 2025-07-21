import { memo } from "react";
import { AnimatedTestimonials } from "./ui/animated-testimonials";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TestimonialsSection = memo(() => {
  const sectionRef = useScrollAnimation(100);

  const testimonials = [
    {
      quote: "A SENVIA transformou completamente a nossa presença online. Em apenas 3 meses, aumentámos as vendas em 150% e reduzimos o tempo gasto em tarefas administrativas.",
      name: "Miguel Santos",
      designation: "CEO, Distância Arrojada",
      src: "/lovable-uploads/1eb268ed-2dd6-49ab-8eff-d6bc955a2223.png",
    },
    {
      quote: "Profissionais excepcionais! Criaram uma landing page que converte muito bem e automatizaram todo o nosso processo de geração de leads. Recomendo vivamente.",
      name: "Ana Silva",
      designation: "Directora de Marketing, DASP Rent",
      src: "/lovable-uploads/040f5578-af33-41a8-9271-e8cfeda9dbac.png",
    },
    {
      quote: "O trabalho da SENVIA superou todas as nossas expectativas. O site ficou lindo e funcional, e o suporte é sempre rápido e eficiente.",
      name: "Thais Lorrayne",
      designation: "Maquiadora Profissional",
      src: "/lovable-uploads/3424b149-f302-4d53-89c7-332d69bfcf98.png",
    },
    {
      quote: "Graças à SENVIA, consegui digitalizar o meu negócio de consultoria de viagens. As ferramentas de automação poupam-me horas todos os dias.",
      name: "Daniel Freitas",
      designation: "Consultor de Viagens",
      src: "/lovable-uploads/a2455a7c-3f41-4cd3-aabf-a79473014089.png",
    },
  ];

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="py-24 bg-secondary/30"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            <span className="text-gradient">O Que Dizem os Nossos Clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            Conhece as experiências de quem já trabalhou connosco e descobriu como podemos transformar o teu negócio.
          </p>
        </div>

        <div className="animate-on-scroll">
          <AnimatedTestimonials 
            testimonials={testimonials} 
            autoplay={true}
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export default TestimonialsSection;