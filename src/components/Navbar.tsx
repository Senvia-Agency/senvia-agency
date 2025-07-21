import { useState, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isScrolled = useOptimizedScroll(10);

  const handleSignOut = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    navigate("/");
  }, [signOut, navigate]);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  }, []);

  const handleScheduleConsultation = useCallback(() => {
    scrollToSection('contacto');
  }, [scrollToSection]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-background/90 backdrop-blur-sm"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-senvia-500 glow" onClick={handleLinkClick}>
            SENVIA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('sobre')}
              className="text-foreground hover:text-senvia-500 transition-colors cursor-pointer"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('servicos')}
              className="text-foreground hover:text-senvia-500 transition-colors cursor-pointer"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('beneficios')}
              className="text-foreground hover:text-senvia-500 transition-colors cursor-pointer"
            >
              Benefícios
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="text-foreground hover:text-senvia-500 transition-colors cursor-pointer"
            >
              Depoimentos
            </button>
            <Link 
              to="/faq" 
              className="text-foreground hover:text-senvia-500 transition-colors"
              onClick={handleLinkClick}
            >
              FAQ
            </Link>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-foreground hover:text-senvia-500 transition-colors cursor-pointer"
            >
              Contacto
            </button>
            
            {/* Consultation Button */}
            <Button 
              onClick={handleScheduleConsultation}
              className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-medium px-6 py-2 rounded-full"
            >
              Agendar Consultoria
            </Button>

            {/* User Area (only show if logged in) */}
            {user && (
              <div className="relative ml-4 pl-4 border-l border-border">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="text-sm text-muted-foreground hover:text-senvia-500 transition-colors"
                    onClick={handleLinkClick}
                  >
                    Admin ({user.email})
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-sm text-muted-foreground hover:text-senvia-500 transition-colors"
                    onClick={handleLinkClick}
                  >
                    Dashboard ({user.email})
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="ml-2 text-sm text-muted-foreground hover:text-senvia-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-senvia-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-b border-border">
              <button
                onClick={() => scrollToSection('sobre')}
                className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors w-full text-left"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection('servicos')}
                className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors w-full text-left"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollToSection('beneficios')}
                className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors w-full text-left"
              >
                Benefícios
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors w-full text-left"
              >
                Depoimentos
              </button>
              <Link
                to="/faq"
                className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors"
                onClick={handleLinkClick}
              >
                FAQ
              </Link>
              <button
                onClick={() => scrollToSection('contacto')}
                className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors w-full text-left"
              >
                Contacto
              </button>
              
              <div className="px-3 py-2">
                <Button 
                  onClick={handleScheduleConsultation}
                  className="w-full bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-medium"
                >
                  Agendar Consultoria
                </Button>
              </div>

              {/* User Area Mobile */}
              {user && (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors"
                      onClick={handleLinkClick}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors"
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-foreground hover:text-senvia-500 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;