import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Instagram,
  ArrowUp,
  Code,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ModernFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  const quickLinks = [
    { label: "Sobre", href: "#about" },
    { label: "Serviços", href: "#services" },
    { label: "Portfólio", href: "#portfolio" },
    { label: "Contato", href: "#contact" }
  ];

  const services = [
    { label: "Desenvolvimento Web", href: "#" },
    { label: "Apps Mobile", href: "#" },
    { label: "Automação & IA", href: "#" },
    { label: "Marketing Digital", href: "#" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/10 border-t border-senvia-500/10">
      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="mb-8">
              <img 
                src="/lovable-uploads/060d279c-2d0e-4502-8e2d-32d806f8f902.png" 
                alt="SENVIA Logo" 
                className="h-12 w-auto mb-6"
              />
            </div>
            
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-md font-light text-lg">
              Especialistas em Landing Pages de alta conversão, Funis de Vendas otimizados 
              e Automações Empresariais que transformam visitantes em clientes.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <Mail className="w-5 h-5 text-senvia-400" />
                <span className="font-light">geral@senvia.pt</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Phone className="w-5 h-5 text-senvia-400" />
                <span className="font-light">+351 939 135 114</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <MapPin className="w-5 h-5 text-senvia-400" />
                <span className="font-light">Lisboa, Portugal</span>
              </div>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-medium mb-8">Serviços</h4>
            <ul className="space-y-4">
              {[
                "Landing Pages",
                "Funis de Vendas", 
                "Automações",
                "Consultoria Digital"
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#services"
                    className="text-muted-foreground hover:text-senvia-400 transition-colors duration-200 block font-light"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-medium mb-8">Links</h4>
            <ul className="space-y-4">
              {[
                { label: "Sobre", href: "#about" },
                { label: "Tecnologia", href: "#tech" },
                { label: "Contato", href: "#contact" },
                { label: "Portfolio", href: "#portfolio" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-senvia-400 transition-colors duration-200 block font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-8 border-t border-senvia-500/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-muted-foreground font-light">
              <span>© 2024 SENVIA. Desenvolvido em Lisboa, Portugal</span>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Social links */}
              <div className="flex items-center gap-4">
                {[
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Instagram, href: "#", label: "Instagram" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-card/30 hover:bg-senvia-400/10 text-muted-foreground hover:text-senvia-400 transition-all duration-200 hover:scale-110 border border-senvia-500/10"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              
              {/* Scroll to top */}
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToTop}
                className="border-senvia-400/20 text-senvia-400 hover:bg-senvia-400/5 group font-light"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-senvia-400/30 to-transparent"></div>
    </footer>
  );
};

export default ModernFooter;