import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, Clock, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const UltraModernContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const benefits = [
    "Análise gratuita do seu negócio",
    "Estratégia personalizada sem custo", 
    "Demonstração ao vivo da tecnologia",
    "ROI projetado para seu caso específico"
  ];

  return (
    <section id="contato" className="py-32 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            <span className="text-foreground">ATIVE SUA</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MÁQUINA AGORA
            </span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
            Consultoria <span className="text-primary font-bold">100% gratuita</span> • 
            Análise completa do seu negócio • Estratégia personalizada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="p-10 rounded-3xl bg-card border border-border shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <Zap className="w-8 h-8 text-primary" />
                <h3 className="text-3xl font-black text-foreground">
                  CONSULTORIA GRATUITA
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3">
                      NOME COMPLETO *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3">
                      EMAIL PROFISSIONAL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-3">
                    EMPRESA *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-3">
                    DESAFIO ATUAL
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-6 py-4 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                    placeholder="Conte-nos qual o maior desafio do seu negócio..."
                  />
                </div>

                <Button
                  type="submit"
                  className="group w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-3">
                    AGENDAR CONSULTORIA GRATUITA
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </span>
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  ✅ Sem compromisso • ✅ 100% gratuito • ✅ Resposta em 2 horas
                </div>
              </form>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-foreground mb-6">
                O QUE VOCÊ RECEBE GRATUITAMENTE:
              </h4>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="p-10 rounded-3xl bg-card border border-border">
              <h3 className="text-3xl font-black text-foreground mb-8">
                CONTACTO DIRETO
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">EMAIL</div>
                    <a href="mailto:geral@senvia.pt" className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                      geral@senvia.pt
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">TELEFONE</div>
                    <a href="tel:+351939135114" className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                      +351 939 135 114
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">LOCALIZAÇÃO</div>
                    <div className="text-lg font-bold text-foreground">Leiria, Portugal</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">HORÁRIO</div>
                    <div className="text-lg font-bold text-foreground">24/7 Disponível</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency Box */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30">
              <h4 className="text-2xl font-black text-foreground mb-4">
                🚀 AÇÃO LIMITADA
              </h4>
              <p className="text-foreground mb-4">
                Estamos oferecendo consultoria gratuita apenas para os 
                <span className="text-primary font-bold"> primeiros 50 empresários</span> 
                sérios sobre crescer em 2024.
              </p>
              <div className="text-sm text-muted-foreground">
                ⏰ Restam apenas 12 vagas este mês
              </div>
            </div>

            {/* Guarantee */}
            <div className="p-8 rounded-2xl bg-card border border-border text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h4 className="text-xl font-black text-foreground mb-2">
                GARANTIA TOTAL
              </h4>
              <p className="text-muted-foreground">
                Se não conseguirmos aumentar seus resultados em 90 dias, 
                devolvemos 100% do investimento.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UltraModernContactSection;