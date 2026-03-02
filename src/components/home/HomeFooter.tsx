import { ArrowRight, Instagram, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface HomeFooterProps {
  hideCTA?: boolean;
}

const HomeFooter = ({ hideCTA = false }: HomeFooterProps) => {
  const { ref, isIntersecting: isInView } = useIntersectionObserver({ threshold: 0.1 });

  const handleCTA = () => window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/senvia.pt/", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/senvia.pt", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/senvia-pt/", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-background relative overflow-hidden" ref={ref}>
      {!hideCTA && (
        <div className="border-t border-border relative">
          <div className="absolute inset-0 aurora-bg" />
          <div className="container mx-auto px-4 md:px-6 py-24 md:py-32 relative z-10">
            <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                A sua equipa de vendas
                <br />
                <span className="gradient-text-animated inline-block">agradece.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Vamos construir a sua infraestrutura de vendas inteligente?
              </p>
              <Button 
                onClick={handleCTA}
                size="lg"
                className="group text-base px-4 md:px-8 py-4 md:py-6 bg-primary hover:bg-primary/90 glow-pulse relative overflow-hidden max-w-full hover:scale-[1.02] transition-transform"
              >
                <span className="relative z-10 flex items-center justify-center text-center whitespace-normal">
                  <span>Agendar Consultoria de Implementação</span>
                  <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <a href="/" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="inline-flex items-center gap-3 mb-4 hover:scale-105 transition-transform">
                <img src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png" alt="SENVIA" className="h-8" width="32" height="32" />
                <span className="text-xl font-bold gradient-text-animated">SENVIA</span>
              </a>
              <p className="text-sm text-muted-foreground max-w-sm">
                Eliminamos o ruído das vendas. Infraestrutura e Inteligência para negócios que querem escalar.
              </p>
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:scale-110 transition-all">
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Soluções</h4>
              <ul className="space-y-3">
                {[
                  { label: "Sites & E-commerces", to: "/sites" },
                  { label: "Chatbots", to: "/chatbots" },
                  { label: "Softwares", to: "/softwares" },
                ].map((item, index) => (
                  <li key={index} className="hover:translate-x-1 transition-transform">
                    <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-3">
                <li className="hover:translate-x-1 transition-transform">
                  <Link to="/sobre-nos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link>
                </li>
                <li><span className="text-sm text-muted-foreground/50 cursor-default">Carreiras / Parceiros</span></li>
                <li className="hover:translate-x-1 transition-transform">
                  <a href="https://app.senvia.pt" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Área de Cliente</a>
                </li>
                <li className="hover:translate-x-1 transition-transform">
                  <button onClick={handleCTA} className="text-sm text-muted-foreground hover:text-primary transition-colors">Contacto</button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: "Termos de Uso", to: "/termos-servico" },
                  { label: "Política de Privacidade & RGPD", to: "/politica-privacidade" },
                  { label: "Política de Cookies", to: "/politica-cookies" },
                  { label: "Livro de Reclamações", href: "https://www.livroreclamacoes.pt/" },
                ].map((item, index) => (
                  <li key={index} className="hover:translate-x-1 transition-transform">
                    {item.to ? (
                      <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.label}</Link>
                    ) : (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-muted-foreground">© 2025 SENVIA. Todos os direitos reservados.</p>
              <span className="hidden md:inline text-muted-foreground/50">•</span>
              <p className="text-sm text-muted-foreground">Leiria, Portugal</p>
            </div>
            <button onClick={scrollToTop} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group hover:-translate-y-1">
              Voltar ao topo <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
