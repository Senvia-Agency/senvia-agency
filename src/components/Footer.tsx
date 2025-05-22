import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-3xl font-bold text-senvia-500 glow mb-4">SENVIA</div>
            <p className="text-muted-foreground mb-4">
              Transformando ideias em experiências digitais impactantes.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/senvia_agency/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-senvia-500 transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/senvia.agency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-senvia-500 transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://x.com/Senvia_Agency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-senvia-500 transition-colors"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">Websites & Páginas Web</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">E-commerce</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">Social Media</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">Tráfego Pago</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">Agentes de IA</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">Projetos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">Ferramentas</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-senvia-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                <a href="tel:+351939135114" className="hover:text-senvia-500 transition-colors">
                  +351 939 135 114
                </a>
              </li>
              <li className="text-muted-foreground">
                <a href="mailto:geral@senvia.pt" className="hover:text-senvia-500 transition-colors">
                  geral@senvia.pt
                </a>
              </li>
              <li className="text-muted-foreground">Portugal</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {currentYear} SENVIA Agency. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://www.livroreclamacoes.pt/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-senvia-500 transition-colors"
            >
              <Shield className="h-4 w-4 mr-1" />
              Livro de Reclamações
            </a>
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-senvia-500 transition-colors">Política de Privacidade</Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-senvia-500 transition-colors">Termos de Serviço</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
