import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleCTA = () => {
    window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png" 
              alt="SENVIA" 
              className="h-8 md:h-10"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
              SENVIA
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('metodo')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              O Nosso Método
            </button>
            <button
              onClick={() => scrollToSection('tecnologia')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              SENVIA OS
            </button>
            <a
              href="https://app.senvia.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </a>
            <Button onClick={handleCTA} size="sm" className="bg-primary hover:bg-primary/90">
              Agendar Consultoria
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/20">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('metodo')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                O Nosso Método
              </button>
              <button
                onClick={() => scrollToSection('tecnologia')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                SENVIA OS
              </button>
              <a
                href="https://app.senvia.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Login
              </a>
              <Button onClick={handleCTA} className="w-full mt-2">
                Agendar Consultoria
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;
