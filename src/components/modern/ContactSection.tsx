import { motion } from "framer-motion";
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      value: "+351 939 135 114",
      description: "Seg - Sex, 9h às 18h"
    },
    {
      icon: Mail,
      title: "Email",
      value: "geral@senvia.pt",
      description: "Resposta em até 2h"
    },
    {
      icon: MapPin,
      title: "Localização",
      value: "Leiria, Portugal",
      description: "Atendimento presencial"
    },
    {
      icon: Clock,
      title: "Horário",
      value: "9h às 18h",
      description: "Segunda a Sexta"
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-gradient-to-r from-senvia-400/20 to-primary/20 blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-pulse delay-1000"></div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Vamos{" "}
            <span className="bg-gradient-to-r from-senvia-400 to-primary bg-clip-text text-transparent">
              Conversar
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Pronto para transformar sua ideia em realidade? Entre em contato conosco 
            e vamos discutir como podemos ajudar seu negócio a crescer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-8 rounded-3xl bg-card/50 border border-muted/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-senvia-400 to-primary">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Envie sua mensagem</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-muted/20 focus:border-senvia-400/50 focus:outline-none focus:ring-2 focus:ring-senvia-400/20 transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-muted/20 focus:border-senvia-400/50 focus:outline-none focus:ring-2 focus:ring-senvia-400/20 transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Empresa</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-muted/20 focus:border-senvia-400/50 focus:outline-none focus:ring-2 focus:ring-senvia-400/20 transition-colors"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-muted/20 focus:border-senvia-400/50 focus:outline-none focus:ring-2 focus:ring-senvia-400/20 transition-colors resize-none"
                    placeholder="Conte-nos sobre seu projeto..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-semibold py-3 text-lg group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar mensagem
                      <Send className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-card/30 border border-muted/20 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-senvia-400/20 to-primary/20 group-hover:from-senvia-400/30 group-hover:to-primary/30 transition-colors">
                      <info.icon className="w-6 h-6 text-senvia-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{info.title}</h4>
                      <p className="text-foreground font-medium mb-1">{info.value}</p>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-senvia-500/10 to-primary/10 border border-senvia-400/20 backdrop-blur-sm">
              <h4 className="text-xl font-bold mb-6">Por que escolher a SENVIA?</h4>
              <div className="space-y-4">
                {[
                  "Resposta em até 2 horas",
                  "Consultoria gratuita inicial",
                  "Equipe especializada",
                  "Suporte contínuo"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-senvia-400 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency contact */}
            <div className="p-6 rounded-2xl bg-card/50 border border-orange-400/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                <h4 className="font-semibold text-orange-400">Urgência?</h4>
              </div>
              <p className="text-muted-foreground mb-2">
                Para questões urgentes, entre em contato via WhatsApp:
              </p>
              <Button 
                variant="outline" 
                className="border-orange-400/30 text-orange-400 hover:bg-orange-400/10 w-full"
              >
                +351 939 135 114
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;