
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showClientMenu, setShowClientMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setShowClientMenu(false);
  };

  const navLinks = [
    { to: "/websites", label: "Websites" },
    { to: "/ecommerce", label: "E-commerce" },
    { to: "/social-media", label: "Social Media" },
    { to: "/trafego-pago", label: "Tráfego Pago" },
    { to: "/agentes-ia", label: "Agentes IA" },
    { to: "/projetos", label: "Projetos" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-senvia-500 glow">
            SENVIA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-foreground hover:text-senvia-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowClientMenu(!showClientMenu)}
                  className="flex items-center gap-2 text-foreground hover:text-senvia-500 transition-colors"
                >
                  Área do Cliente ({user.email})
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showClientMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                      onClick={() => setShowClientMenu(false)}
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/crm"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setShowClientMenu(false)}
                      >
                        CRM
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-senvia-500 hover:bg-senvia-400 text-black">
                  Área do Cliente
                </Button>
              </Link>
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
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <div className="border-t border-border pt-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/crm"
                      className="block px-3 py-2 text-foreground hover:text-senvia-500 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      CRM
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-foreground hover:text-senvia-500 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="border-t border-border pt-2">
                  <Link
                    to="/auth"
                    className="block px-3 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full bg-senvia-500 hover:bg-senvia-400 text-black">
                      Área do Cliente
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
