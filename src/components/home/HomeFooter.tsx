import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Instagram, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomeFooter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleCTA = () => {
    window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/senvia.pt/", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/senvia.pt", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/senvia-pt/", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-background relative overflow-hidden" ref={ref}>
      {/* CTA Section */}
      <div className="border-t border-border relative">
        {/* Aurora effect */}
        <div className="absolute inset-0 aurora-bg" />
        
        <div className="container mx-auto px-4 md:px-6 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A sua equipa de vendas
              <br />
              <motion.span 
                className="gradient-text-animated inline-block"
                animate={{ 
                  textShadow: [
                    '0 0 0px hsl(var(--primary))',
                    '0 0 20px hsl(var(--primary))',
                    '0 0 0px hsl(var(--primary))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                agradece.
              </motion.span>
            </motion.h2>

            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Vamos construir a sua infraestrutura de vendas inteligente?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleCTA}
                size="lg"
                className="group text-base px-4 md:px-8 py-4 md:py-6 bg-primary hover:bg-primary/90 glow-pulse relative overflow-hidden max-w-full"
              >
                <span className="relative z-10 flex items-center justify-center text-center whitespace-normal">
                  <span>Agendar Consultoria de Implementação</span>
                  <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <motion.a 
                href="/" 
                onClick={(e) => { e.preventDefault(); scrollToTop(); }} 
                className="inline-flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png" 
                  alt="SENVIA" 
                  className="h-8"
                />
                <span className="text-xl font-bold gradient-text-animated">
                  SENVIA
                </span>
              </motion.a>
              <p className="text-sm text-muted-foreground max-w-sm">
                Eliminamos o ruído das vendas. Infraestrutura e Inteligência para negócios que querem escalar.
              </p>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Soluções */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Soluções</h4>
              <ul className="space-y-3">
                {[
                  { label: "Landing Pages & Funis", action: () => document.getElementById('metodo')?.scrollIntoView({ behavior: 'smooth' }) },
                  { label: "SENVIA OS", action: () => document.getElementById('tecnologia')?.scrollIntoView({ behavior: 'smooth' }) },
                  { label: "Agentes de IA", to: "/ia" },
                  { label: "Psicólogos", to: "/ia-psicologos" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={item.action}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }}>
                  <Link
                    to="/sobre-nos"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sobre Nós
                  </Link>
                </motion.li>
                <li>
                  <span className="text-sm text-muted-foreground/50 cursor-default">
                    Carreiras / Parceiros
                  </span>
                </li>
                <motion.li whileHover={{ x: 5 }}>
                  <a
                    href="https://app.senvia.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Área de Cliente
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <button
                    onClick={handleCTA}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contacto
                  </button>
                </motion.li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: "Termos de Uso", to: "/termos-servico" },
                  { label: "Política de Privacidade & RGPD", to: "/politica-privacidade" },
                  { label: "Política de Cookies", to: "/politica-cookies" },
                  { label: "Livro de Reclamações", href: "https://www.livroreclamacoes.pt/" },
                ].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 SENVIA. Todos os direitos reservados.
              </p>
              <span className="hidden md:inline text-muted-foreground/50">•</span>
              <p className="text-sm text-muted-foreground">
                Leiria, Portugal
              </p>
            </div>
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              whileHover={{ y: -3 }}
            >
              Voltar ao topo 
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowUp className="h-4 w-4" />
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
