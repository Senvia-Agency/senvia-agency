import { ArrowRight, Instagram, Users, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SocialMedia = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Social Media</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transformamos a presença digital da sua marca nas redes sociais. 
              Estratégias criativas que geram engagement, aumentam seguidores e convertem audiência em clientes.
            </p>
            <Link 
              to="/#contacto" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300"
            >
              Impulsionar Redes Sociais
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Instagram className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Criação de Conteúdo</h3>
              <p className="text-muted-foreground">Posts criativos, stories e vídeos que cativam a sua audiência.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Users className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Gestão de Comunidade</h3>
              <p className="text-muted-foreground">Interação ativa com seguidores e gestão de comentários e mensagens.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Estratégia Digital</h3>
              <p className="text-muted-foreground">Planeamento estratégico para crescimento orgânico e engagement.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Calendar className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Agendamento</h3>
              <p className="text-muted-foreground">Publicações programadas e calendário editorial otimizado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Plataformas que Gerimos</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold">Instagram</h4>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <h4 className="font-semibold">Twitter</h4>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h4 className="font-semibold">Facebook</h4>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h4 className="font-semibold">LinkedIn</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialMedia;