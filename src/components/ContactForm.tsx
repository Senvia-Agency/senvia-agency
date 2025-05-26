
import { useState } from "react";
import { Send, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm = () => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = {
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      message: formState.message,
      timestamp: new Date().toISOString(),
      source: "website_contact_form"
    };
    
    console.log("Dados do formulário a serem enviados:", formData);
    
    try {
      console.log("Enviando para webhook:", "http://158.220.122.62:5678/webhook/lovable-lead");
      
      const response = await fetch("http://158.220.122.62:5678/webhook/lovable-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      try {
        const responseText = await response.text();
        console.log("Response body:", responseText);
      } catch (readError) {
        console.log("Não foi possível ler o body da resposta:", readError);
      }
      
      if (response.ok || response.status === 0) {
        console.log("Webhook chamado com sucesso");
        
        setIsSubmitted(true);
        setFormState({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
        
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Obrigado pelo seu contacto. Responderemos o mais breve possível.",
        });
        
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    } catch (error) {
      console.error("Erro detalhado ao enviar form:", error);
      console.error("Tipo do erro:", typeof error);
      console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
      
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar a sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="bg-green-100 p-3 rounded-full text-green-500 mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h4 className="text-xl font-semibold mb-2">Mensagem Enviada!</h4>
        <p className="text-muted-foreground">Obrigado pelo seu contacto. Responderemos o mais breve possível.</p>
      </div>
    );
  }

  return (
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
  );
};

export default ContactForm;
