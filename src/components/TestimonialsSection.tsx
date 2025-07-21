import { memo } from "react";
import { AnimatedTestimonials } from "./ui/animated-testimonials";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TestimonialsSection = memo(() => {
  const sectionRef = useScrollAnimation(100);

  const testimonials = [
    {
      quote: "A SENVIA transformou completamente a nossa presença online. Em apenas 3 meses, aumentámos as vendas em 150% e reduzimos o tempo gasto em tarefas administrativas. Recomendo vivamente!",
      name: "Miguel Santos",
      designation: "",
      src: "",
    },
    {
      quote: "Profissionais excepcionais! Criaram uma landing page que converte muito bem e automatizaram todo o nosso processo de geração de leads. O suporte é sempre rápido e eficiente.",
      name: "Ana Silva",
      designation: "",
      src: "",
    },
    {
      quote: "O trabalho da SENVIA superou todas as nossas expectativas. O site ficou lindo e funcional, e conseguimos finalmente digitalizar o nosso negócio de forma eficaz.",
      name: "Thais Lorrayne",
      designation: "",
      src: "",
    },
    {
      quote: "Graças à SENVIA, consegui automatizar processos que me poupam horas todos os dias. A equipa é muito profissional e entende realmente as necessidades dos clientes.",
      name: "Daniel Freitas",
      designation: "",
      src: "",
    },
    {
      quote: "Excelente trabalho! A nossa nova estratégia digital resultou num aumento significativo de leads qualificados. A SENVIA sabe mesmo o que faz.",
      name: "Sofia Costa",
      designation: "",
      src: "",
    },
    {
      quote: "Trabalhar com a SENVIA foi uma das melhores decisões que tomámos. Eles não só entregaram o que prometeram, como superaram as nossas expectativas.",
      name: "João Pereira",
      designation: "",
      src: "",
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