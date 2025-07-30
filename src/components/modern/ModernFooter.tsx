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
    <footer className="relative bg-gradient-to-b from-background to-muted/20 border-t border-muted/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-r from-senvia-400 to-primary">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">SENVIA</h3>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              Transformamos ideias em soluções digitais inovadoras. Nossa missão é impulsionar 
              o crescimento dos nossos clientes através de tecnologia de ponta e estratégias 
              digitais eficazes.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-senvia-400" />
                <span>contato@senvia.com.br</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-senvia-400" />
                <span>+55 (11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-senvia-400" />
                <span>São Paulo, Brasil</span>
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
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-senvia-400 transition-colors duration-200 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Serviços</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.href}
                    className="text-muted-foreground hover:text-senvia-400 transition-colors duration-200 block"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="py-8 border-t border-muted/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Fique por dentro das novidades</h4>
              <p className="text-muted-foreground">
                Receba insights sobre tecnologia e tendências digitais
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-muted/50 border border-muted/20 focus:border-senvia-400/50 focus:outline-none focus:ring-2 focus:ring-senvia-400/20 transition-colors"
              />
              <Button className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-semibold">
                Inscrever
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-8 border-t border-muted/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>© 2024 SENVIA. Feito com</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>em São Paulo</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-muted/30 hover:bg-senvia-400/20 text-muted-foreground hover:text-senvia-400 transition-all duration-200 hover:scale-110"
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
                className="border-senvia-400/30 text-senvia-400 hover:bg-senvia-400/10 group"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-senvia-400/20 to-transparent"></div>
    </footer>
  );
};

export default ModernFooter;