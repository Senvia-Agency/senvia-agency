import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const serviceSubmenus = [
  { label: "Sites & E-commerces", href: "/sites" },
  { label: "Chatbots", href: "/chatbots" },
  { label: "Softwares", href: "#" },
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="flex items-center gap-3">
              <motion.img
                src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png"
                alt="SENVIA"
                className="h-8 md:h-10"
                animate={{ filter: ['drop-shadow(0 0 0px hsl(var(--primary)))', 'drop-shadow(0 0 8px hsl(var(--primary)))', 'drop-shadow(0 0 0px hsl(var(--primary)))'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold gradient-text-animated">SENVIA</span>
                <span className="text-[10px] md:text-xs text-muted-foreground tracking-wider">IA Software House</span>
              </div>
            </Link>
          </motion.div>

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
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-48 rounded-xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="py-2">
                      {serviceSubmenus.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/sobre-nos" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
              Sobre Nós
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
              Blog
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            <button onClick={() => document.getElementById('contactos')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 relative group">
              Contactos
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank')} size="sm" className="bg-primary hover:bg-primary/90">
                Agendar Consultoria
              </Button>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <motion.button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} whileTap={{ scale: 0.9 }}>
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="h-6 w-6 text-foreground" /></motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu className="h-6 w-6 text-foreground" /></motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
              <div className="py-4 border-t border-border/20 space-y-1">
                <Link to="/senvia-os" onClick={closeMobile} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                  SENVIA OS
                </Link>

                {/* Serviços Accordion */}
                <div>
                  <button
                    onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                    className="flex items-center justify-between w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg"
                  >
                    Serviços
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isMobileServicesOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="pl-6 space-y-1">
                          {serviceSubmenus.map((item) => (
                            <Link key={item.label} to={item.href} onClick={closeMobile} className="block text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 py-2.5 px-4 rounded-lg">
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/sobre-nos" onClick={closeMobile} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                  Sobre Nós
                </Link>
                <Link to="#" onClick={closeMobile} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                  Blog
                </Link>
                <button onClick={() => { document.getElementById('contactos')?.scrollIntoView({ behavior: 'smooth' }); closeMobile(); }} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg">
                  Contactos
                </button>

                <div className="pt-2">
                  <Button onClick={() => window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank')} className="w-full glow-pulse">
                    Agendar Consultoria
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default SenviaNavbar;
