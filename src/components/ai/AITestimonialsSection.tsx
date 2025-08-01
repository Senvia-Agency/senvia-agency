import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const AITestimonialsSection = () => {
  const testimonials = [
    {
      name: "Carlos Mendes",
      company: "TechFlow Solutions",
      role: "CEO",
      content: "A IA da SENVIA transformou completamente a nossa operação. Aumentámos as vendas em 200% nos primeiros 3 meses e reduzimos custos operacionais drasticamente.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      name: "Ana Silva",
      company: "Digital Commerce Pro",
      role: "Directora de Marketing",
      content: "Impressionante como a automação inteligente consegue qualificar leads melhor que a nossa equipa anterior. O ROI foi imediato.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      name: "Miguel Santos",
      company: "Inovação Empresarial",
      role: "Founder",
      content: "Finalmente uma solução de IA que funciona de verdade. O atendimento 24/7 fez-nos capturar leads que perdíamos antes. Revolucionário!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Clientes que Já
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Revolucionaram os Negócios
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Resultados reais de empresas que escolheram o futuro
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-700/30 border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-cyan-400" />
                </div>
                
                {/* Rating */}
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-slate-300 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-8">Empresas que confiam na nossa tecnologia:</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-slate-500">TECH•CORP</div>
            <div className="text-2xl font-bold text-slate-500">DIGITAL•PRO</div>
            <div className="text-2xl font-bold text-slate-500">INNOVATE•NOW</div>
            <div className="text-2xl font-bold text-slate-500">FUTURE•TECH</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITestimonialsSection;