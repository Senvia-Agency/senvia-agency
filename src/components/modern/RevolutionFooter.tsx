import { motion } from "framer-motion";
import { ArrowUp, Mail, Phone, MapPin, Zap, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const RevolutionFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-background border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <Zap className="w-10 h-10 text-primary" />
                <div className="absolute inset-0 w-10 h-10 text-primary animate-ping opacity-20" />
              </div>
              <span className="text-4xl font-black text-foreground">SENVIA</span>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-md">
              A máquina que transforma visitantes em clientes automaticamente. 
              <span className="text-primary font-bold"> 847% ROI médio</span> comprovado.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:geral@senvia.pt" className="text-foreground hover:text-primary transition-colors font-medium">
                  geral@senvia.pt
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+351939135114" className="text-foreground hover:text-primary transition-colors font-medium">
                  +351 939 135 114
                </a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">Leiria, Portugal</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-black text-foreground mb-6">NAVEGAÇÃO</h3>
            <div className="space-y-3">
              {[
                { label: 'Revolução', id: 'revolução' },
                { label: 'Processo', id: 'processo' },
                { label: 'Provas', id: 'provas' },
                { label: 'Contato', id: 'contato' }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl font-black text-foreground mb-6">AÇÃO RÁPIDA</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Consultoria gratuita disponível apenas para os primeiros 50 empresários.
              </p>
              <Button
                onClick={() => scrollToSection('contato')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg"
              >
                AGENDAR AGORA
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2024 SENVIA. Todos os direitos reservados. | Leiria, Portugal
          </div>

          <div className="flex items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Scroll to Top */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="icon"
              className="rounded-full border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
    </footer>
  );
};

export default RevolutionFooter;