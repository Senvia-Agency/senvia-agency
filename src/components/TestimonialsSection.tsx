import { memo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TestimonialsSection = memo(() => {
  const sectionRef = useScrollAnimation(100);
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "A SENVIA transformou completamente a nossa presença online. Em apenas 3 meses, aumentámos as vendas em 150% e reduzimos o tempo gasto em tarefas administrativas. Recomendo vivamente!",
      name: "Miguel Santos",
    },
    {
      quote: "Profissionais excepcionais! Criaram uma landing page que converte muito bem e automatizaram todo o nosso processo de geração de leads. O suporte é sempre rápido e eficiente.",
      name: "Ana Silva",
    },
    {
      quote: "O trabalho da SENVIA superou todas as nossas expectativas. O site ficou lindo e funcional, e conseguimos finalmente digitalizar o nosso negócio de forma eficaz.",
      name: "Thais Lorrayne",
    },
    {
      quote: "Graças à SENVIA, consegui automatizar processos que me poupam horas todos os dias. A equipa é muito profissional e entende realmente as necessidades dos clientes.",
      name: "Daniel Freitas",
    },
    {
      quote: "Excelente trabalho! A nossa nova estratégia digital resultou num aumento significativo de leads qualificados. A SENVIA sabe mesmo o que faz.",
      name: "Sofia Costa",
    },
    {
      quote: "Trabalhar com a SENVIA foi uma das melhores decisões que tomámos. Eles não só entregaram o que prometeram, como superaram as nossas expectativas.",
      name: "João Pereira",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, []);

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

        <div className="max-w-4xl mx-auto animate-on-scroll">
          <div className="relative">
            {/* Main testimonial card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl">
              <div className="flex flex-col items-center text-center">
                {/* Quote icon */}
                <div className="bg-senvia-500/10 rounded-full p-4 mb-6">
                  <Quote className="h-8 w-8 text-senvia-400" />
                </div>
                
                {/* Quote text */}
                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 font-medium">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                {/* Author name */}
                <div className="flex flex-col items-center">
                  <h4 className="text-xl font-bold text-senvia-400 mb-2">
                    {testimonials[currentIndex].name}
                  </h4>
                  <div className="w-12 h-0.5 bg-senvia-500"></div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={prevTestimonial}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-full p-3 hover:bg-senvia-500/10 hover:border-senvia-500/50 transition-all duration-300 group"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-senvia-400 transition-colors" />
              </button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-senvia-500 w-8' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-full p-3 hover:bg-senvia-500/10 hover:border-senvia-500/50 transition-all duration-300 group"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-senvia-400 transition-colors" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="w-full bg-muted/30 rounded-full h-1">
                <div 
                  className="bg-senvia-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Secondary testimonials preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {testimonials.map((testimonial, index) => {
              if (index === currentIndex) return null;
              const isNext = index === (currentIndex + 1) % testimonials.length;
              const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
              
              if (!isNext && !isPrev) return null;

              return (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border/30 cursor-pointer hover:bg-card/50 hover:border-senvia-500/30 transition-all duration-300 group"
                >
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 group-hover:text-foreground transition-colors">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm font-medium text-senvia-400">
                    {testimonial.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export default TestimonialsSection;