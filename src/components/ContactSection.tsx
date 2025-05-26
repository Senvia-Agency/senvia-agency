
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import SocialLinks from "./SocialLinks";

const ContactSection = () => {
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
            <ContactInfo />
            <SocialLinks />
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-on-scroll">
            <h3 className="text-2xl font-semibold mb-6 text-senvia-800">Envie-nos uma Mensagem</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
