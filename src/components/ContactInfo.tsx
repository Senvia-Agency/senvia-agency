
import { Phone, Mail, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div>
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
    </div>
  );
};

export default ContactInfo;
