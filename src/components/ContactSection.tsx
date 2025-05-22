
import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  Send,
  Check
} from "lucide-react";

const ContactSection = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            <span className="text-gradient">Entre em Contacto</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            Estamos ansiosos para responder às suas perguntas e ajudar a transformar as suas ideias em realidade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-senvia-50 p-8 rounded-2xl shadow-lg animate-on-scroll">
            <h3 className="text-2xl font-semibold mb-6 text-senvia-800">Informações de Contacto</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-senvia-500 p-3 rounded-full text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-senvia-800">Telefone</h4>
                  <a href="tel:+351939135114" className="text-muted-foreground hover:text-senvia-500 transition-colors">
                    +351 939 135 114
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-senvia-500 p-3 rounded-full text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-senvia-800">Email</h4>
                  <a href="mailto:geral@senvia.pt" className="text-muted-foreground hover:text-senvia-500 transition-colors">
                    geral@senvia.pt
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-senvia-500 p-3 rounded-full text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-senvia-800">Localização</h4>
                  <p className="text-muted-foreground">Portugal</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold mt-12 mb-6 text-senvia-800">Siga-nos</h3>
            
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/senvia_agency/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-full text-senvia-500 hover:bg-senvia-500 hover:text-white shadow-md transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/senvia.agency"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-full text-senvia-500 hover:bg-senvia-500 hover:text-white shadow-md transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/Senvia_Agency"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-full text-senvia-500 hover:bg-senvia-500 hover:text-white shadow-md transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-on-scroll">
            <h3 className="text-2xl font-semibold mb-6 text-senvia-800">Envie-nos uma Mensagem</h3>
            
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="bg-green-100 p-3 rounded-full text-green-500 mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Mensagem Enviada!</h4>
                <p className="text-muted-foreground">Obrigado pelo seu contacto. Responderemos o mais breve possível.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-senvia-500 focus:border-senvia-500 outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-senvia-500 focus:border-senvia-500 outline-none transition-all"
                    placeholder="seu-email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-senvia-500 focus:border-senvia-500 outline-none transition-all"
                    placeholder="+351 XXX XXX XXX"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-senvia-500 focus:border-senvia-500 outline-none transition-all resize-none"
                    placeholder="Como podemos ajudar?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 bg-senvia-500 hover:bg-senvia-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>A enviar...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
