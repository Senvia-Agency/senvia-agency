
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center space-x-2">
          <div className="text-3xl font-bold text-senvia-500 glow">SENVIA</div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#servicos"
            className="text-foreground hover:text-senvia-500 font-medium transition-colors"
          >
            Serviços
          </a>
          <a
            href="#portfolio"
            className="text-foreground hover:text-senvia-500 font-medium transition-colors"
          >
            Portfólio
          </a>
          <a
            href="#ferramentas"
            className="text-foreground hover:text-senvia-500 font-medium transition-colors"
          >
            Ferramentas
          </a>
          <a
            href="#contacto"
            className="text-foreground hover:text-senvia-500 font-medium transition-colors"
          >
            Contacto
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-md py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <a
              href="#servicos"
              className="text-foreground hover:text-senvia-500 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </a>
            <a
              href="#portfolio"
              className="text-foreground hover:text-senvia-500 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfólio
            </a>
            <a
              href="#ferramentas"
              className="text-foreground hover:text-senvia-500 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Ferramentas
            </a>
            <a
              href="#contacto"
              className="text-foreground hover:text-senvia-500 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
