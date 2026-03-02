import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const Home2Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Como Funciona", id: "como-funciona" },
    { label: "Benefícios", id: "beneficios" },
    { label: "FAQ", id: "faq" },
  ];

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
          <a href="/" className="flex items-center gap-3">
            <img
              src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png"
              alt="SENVIA"
              className="h-8 md:h-10"
            />
            <span className="text-xl font-bold gradient-text-animated">SENVIA</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://app.senvia.pt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Começar Teste Grátis
            </a>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/20 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <a
                href="https://app.senvia.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-md bg-primary text-primary-foreground font-medium px-4 py-3 hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Começar Teste Grátis
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Home2Navbar;
