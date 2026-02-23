import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
      const offset = 80;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: "SENVIA OS", id: "senvia-os" },
    { label: "Planos", id: "pricing" },
    { label: "Nichos", id: "nichos" },
  ];

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
          <motion.a href="/" className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
            <motion.img
              src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png"
              alt="SENVIA"
              className="h-8 md:h-10"
              animate={{ filter: ['drop-shadow(0 0 0px hsl(var(--primary)))', 'drop-shadow(0 0 8px hsl(var(--primary)))', 'drop-shadow(0 0 0px hsl(var(--primary)))'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <span className="text-xl font-bold gradient-text-animated">SENVIA</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <motion.span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
              </motion.button>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => scrollToSection('pricing')} size="sm" className="bg-primary hover:bg-primary/90 relative overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Começar Teste Grátis
                </span>
              </Button>
            </motion.div>
          </div>

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

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
              <div className="py-4 border-t border-border/20 space-y-1">
                {navItems.map((item, i) => (
                  <motion.button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 py-3 px-4 rounded-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                    {item.label}
                  </motion.button>
                ))}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-2">
                  <Button onClick={() => scrollToSection('pricing')} className="w-full glow-pulse">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Começar Teste Grátis
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Home2Navbar;
