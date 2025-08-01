import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const AIContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Pronto para
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-1 sm:mt-2">
              Revolucionar o Seu Negócio?
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Fale connosco e descubra como a nossa IA pode transformar a sua empresa
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Solicitar Consultoria Gratuita
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        name="name"
                        placeholder="O seu nome"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="O seu e-mail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        name="company"
                        placeholder="A sua empresa"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="O seu telefone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Conte-nos sobre o seu projecto e objectivos..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                  >
                    Enviar Pedido
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">E-mail</h4>
                    <p className="text-slate-300">contacto@senvia.pt</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Telefone</h4>
                    <p className="text-slate-300">+351 XXX XXX XXX</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Localização</h4>
                    <p className="text-slate-300">Lisboa, Portugal</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Response Promise */}
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-400/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <h4 className="text-white font-bold text-lg mb-2">Resposta Garantida</h4>
                <p className="text-slate-300 mb-4">
                  Respondemos a todos os pedidos em menos de 2 horas
                </p>
                <div className="text-cyan-400 font-semibold">
                  Disponível 24/7 para emergências
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIContactSection;