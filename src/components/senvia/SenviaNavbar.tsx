import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAppUrl } from '@/utils/getSignupUrl';

const BLOG_URL = import.meta.env.DEV
  ? "http://localhost:4321"
  : "https://blog.senvia.pt";

const serviceSubmenus = [
  { label: "Sites & E-commerces", href: "/sites" },
  { label: "Chatbots", href: "/chatbots" },
  { label: "Softwares", href: "/softwares" },
];

const SenviaNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <img
              src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png"
              alt="SENVIA"
              className="h-8 md:h-10"
              width="40"
              height="40"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold gradient-text-animated">SENVIA</span>
              <span className="text-[10px] md:text-xs text-muted-foreground tracking-wider">IA Software House</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/senvia-os" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
              SENVIA OS
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            {/* Serviços Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
                Serviços
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
              <div
                className={`absolute top-full left-0 mt-1 w-48 rounded-xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top ${
                  isServicesOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                }`}
              >
                <div className="py-2">
                  {serviceSubmenus.map((item) => (
                    <Link key={item.label} to={item.href} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/sobre-nos" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
              Sobre Nós
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
              Blog
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>

            <button onClick={() => document.getElementById('contactos')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
              Contactos
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>

            <button onClick={() => window.open(getAppUrl('/c/senvia-agency/formulario-lp'), '_blank')} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform">
              Agendar Consultoria
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden overflow-hidden">
            <div className="py-4 border-t border-border/20 space-y-1">
              <Link to="/senvia-os" onClick={closeMobile} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                SENVIA OS
              </Link>

              <div>
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex items-center justify-between w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg"
                >
                  Serviços
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileServicesOpen && (
                  <div className="pl-6 space-y-1">
                    {serviceSubmenus.map((item) => (
                      <Link key={item.label} to={item.href} onClick={closeMobile} className="block text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 py-2.5 px-4 rounded-lg">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/sobre-nos" onClick={closeMobile} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                Sobre Nós
              </Link>
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" onClick={closeMobile} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                Blog ↗
              </a>
              <button onClick={() => { document.getElementById('contactos')?.scrollIntoView({ behavior: 'smooth' }); closeMobile(); }} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                Contactos
              </button>

              <div className="pt-2">
                <button onClick={() => window.open(getAppUrl('/c/senvia-agency/formulario-lp'), '_blank')} className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse">
                  Agendar Consultoria
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SenviaNavbar;
