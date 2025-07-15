const NeoFlowFooter = () => {
  const complianceLinks = [
    { text: "Política de Privacidade", href: "/privacy-policy" },
    { text: "Cookies", href: "#" },
    { text: "Termos & Condições", href: "/termos-servico" },
    { text: "Acessar meus dados", href: "#" },
    { text: "Solicitar apagamento", href: "#" },
    { text: "Impressum", href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-primary glow mb-4">SENVIA</div>
          <p className="text-gray-400">
            Agência de Marketing Digital especializada em automação e alta conversão
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <div className="space-y-2 text-gray-400">
              <p>info@senvia.pt</p>
              <p>+351 91 234 5678</p>
              <p>Lisboa, Portugal</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Serviços</h3>
            <div className="space-y-2 text-gray-400">
              <p>Landing Pages</p>
              <p>CRM & Automação</p>
              <p>Marketing Digital</p>
              <p>Consultoria ROI</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Seguir</h3>
            <div className="space-y-2 text-gray-400">
              <p>LinkedIn</p>
              <p>Facebook</p>
              <p>Instagram</p>
              <p>YouTube</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="text-center mb-6">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {complianceLinks.map((link, index) => (
                <span key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.text}
                  </a>
                  {index < complianceLinks.length - 1 && (
                    <span className="text-gray-600 ml-4">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 SENVIA Agência de Marketing • NIF 123456789 • Lisboa, Portugal</p>
            <p className="mt-2">
              Todos os direitos reservados. RGPD Compliant • Dados processados na UE
            </p>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default NeoFlowFooter;