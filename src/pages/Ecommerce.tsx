import { ArrowRight, ShoppingCart, CreditCard, Truck, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Ecommerce = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">E-commerce</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Desenvolvemos lojas online completas e otimizadas para maximizar as suas vendas. 
              Plataformas seguras, integradas e preparadas para escalar o seu negócio digital.
            </p>
            <Link 
              to="/#contacto" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300"
            >
              Criar Loja Online
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
              <ShoppingCart className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Loja Completa</h3>
              <p className="text-muted-foreground">Sistema completo de e-commerce com gestão de produtos, stock e pedidos.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <CreditCard className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Pagamentos Seguros</h3>
              <p className="text-muted-foreground">Integração com múltiplos métodos de pagamento e certificação SSL.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Truck className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Gestão de Envios</h3>
              <p className="text-muted-foreground">Sistema automatizado de envios com tracking e múltiplas transportadoras.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <BarChart3 className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Analytics Avançado</h3>
              <p className="text-muted-foreground">Relatórios detalhados de vendas, conversões e comportamento dos clientes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Funcionalidades Incluídas</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Catálogo de Produtos</h4>
                    <p className="text-muted-foreground">Gestão completa de produtos com variações e stock</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Carrinho de Compras</h4>
                    <p className="text-muted-foreground">Experiência de compra otimizada e intuitiva</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Gestão de Clientes</h4>
                    <p className="text-muted-foreground">CRM integrado com histórico de compras</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Marketing Integrado</h4>
                    <p className="text-muted-foreground">Campanhas de email, cupões e promoções</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Mobile First</h4>
                    <p className="text-muted-foreground">Otimizado para vendas em dispositivos móveis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">SEO E-commerce</h4>
                    <p className="text-muted-foreground">Otimização específica para lojas online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ecommerce;