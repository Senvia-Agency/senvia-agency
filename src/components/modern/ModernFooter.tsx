import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Instagram,
  ArrowUp,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ModernFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-950 to-black border-t border-cyan-500/20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                  SENVIA
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed max-w-md text-lg">
              Especialistas em sistemas de conversão que transformam visitantes em clientes. 
              Landing Pages, Funis de Vendas e Automações de alta performance.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-300">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>geral@senvia.pt</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>+351 939 135 114</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Leiria, Portugal</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-8 text-white">Serviços</h4>
            <ul className="space-y-4">
              {[
                "Landing Pages",
                "Funis de Vendas", 
                "Automações",
                "Consultoria Digital"
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#sistemas"
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-8 text-white">Links</h4>
            <ul className="space-y-4">
              {[
                { label: "Sistemas", href: "#sistemas" },
                { label: "Processo", href: "#processo" },
                { label: "Resultados", href: "#resultados" },
                { label: "Contato", href: "#contact" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-8 border-t border-cyan-500/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-gray-400">
              <span>© 2024 SENVIA. Desenvolvido em Leiria, Portugal</span>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Social links */}
              <div className="flex items-center gap-4">
                {[
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Instagram, href: "#", label: "Instagram" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-cyan-400/10 text-gray-400 hover:text-cyan-400 transition-all duration-200 hover:scale-110 border border-cyan-500/20"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              
              {/* Scroll to top */}
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToTop}
                className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 group"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
    </footer>
  );
};

export default ModernFooter;