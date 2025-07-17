import { ArrowRight, Zap, Bot, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";

const ProductsHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-60 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur-xl opacity-60 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full blur-xl opacity-60 animate-pulse delay-500" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">Tecnologia de Ponta • Automação Inteligente</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Revolucione Seu
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Negócio Digital
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Não é apenas uma página. É um <strong>sistema inteligente</strong> que captura leads, 
            automatiza processos e <strong>multiplica seus resultados</strong> enquanto você dorme.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <Bot className="w-8 h-8 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold">Automação Total</div>
                <div className="text-sm text-gray-300">Zero trabalho manual</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="text-left">
                <div className="font-semibold">ROI Garantido</div>
                <div className="text-sm text-gray-300">Resultados em 7 dias</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div className="text-left">
                <div className="font-semibold">Tecnologia IA</div>
                <div className="text-sm text-gray-300">Inovação que funciona</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Soluções Disponíveis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl"
              onClick={() => document.getElementById('automation')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Como Funciona
            </Button>
          </div>

          {/* Trust Indicator */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-sm mb-4">Já revolucionou mais de 200+ negócios</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold">⭐⭐⭐⭐⭐</div>
              <div className="text-sm">Avaliação 5.0/5.0</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsHero;