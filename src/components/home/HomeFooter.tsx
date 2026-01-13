import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Instagram, Facebook, Linkedin } from 'lucide-react';
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

  return (
    <footer className="bg-background relative overflow-hidden" ref={ref}>
      {/* CTA Section */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              A sua equipa de vendas
              <br />
              <span className="text-primary">agradece.</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Vamos construir a sua infraestrutura de vendas inteligente?
            </p>

            <Button 
              onClick={handleCTA}
              size="lg"
              className="group text-base px-8 py-6 bg-primary hover:bg-primary/90"
            >
              Agendar Consultoria de Implementação
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <a href="/" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="inline-flex items-center gap-3 mb-4">
                <img 
                  src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png" 
                  alt="SENVIA" 
                  className="h-8"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                  SENVIA
                </span>
              </a>
              <p className="text-sm text-muted-foreground max-w-sm">
                Eliminamos o ruído das vendas. Infraestrutura e Inteligência para negócios que querem escalar.
              </p>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://www.instagram.com/senvia.pt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/senvia.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/senvia-pt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Soluções */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Soluções</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => document.getElementById('metodo')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Landing Pages & Funis
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('tecnologia')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    SENVIA OS
                  </button>
                </li>
                <li>
                  <Link
                    to="/ia"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Agentes de IA
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ia-psicologos"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Psicólogos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground/50 cursor-default">
                    Carreiras / Parceiros
                  </span>
                </li>
                <li>
                  <a
                    href="https://app.senvia.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Área de Cliente
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleCTA}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contacto
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/termos-servico"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    to="/politica-privacidade"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Política de Privacidade & RGPD
                  </Link>
                </li>
                <li>
                  <Link
                    to="/politica-cookies"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.livroreclamacoes.pt/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Livro de Reclamações
                  </a>
                </li>
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
            <button
              onClick={scrollToTop}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Voltar ao topo ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
