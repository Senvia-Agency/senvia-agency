import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp } from "lucide-react";

const NeoFlowROI = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border mb-6">
            <Calculator className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary">Calculadora ROI</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Calcule o seu Retorno de Investimento
          </h2>
          <p className="text-xl text-gray-600">
            Descubra quanto pode poupar com o NeoFlow™
          </p>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-2xl border">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tráfego mensal do site
                </label>
                <input 
                  type="number" 
                  placeholder="ex: 5000"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Taxa de conversão actual (%)
                </label>
                <input 
                  type="number" 
                  placeholder="ex: 2.1"
                  step="0.1"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valor médio por cliente (€)
                </label>
                <input 
                  type="number" 
                  placeholder="ex: 150"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none"
                />
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6 text-center">Resultados Estimados</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border">
                  <p className="text-sm text-gray-600">Receita actual/mês</p>
                  <p className="text-2xl font-bold text-gray-900">€ ---</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 border">
                  <p className="text-sm text-gray-600">Receita com NeoFlow™</p>
                  <p className="text-2xl font-bold text-primary">€ ---</p>
                </div>
                
                <div className="bg-primary rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Receita adicional/mês</p>
                  <p className="text-2xl font-bold">€ ---</p>
                </div>
                
                <div className="bg-accent rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Pay-back em</p>
                  <p className="text-2xl font-bold">--- dias</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
              <TrendingUp className="w-5 h-5 mr-2" />
              Reservar consulta de 15 min
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Resultados baseados na média dos nossos clientes (conversão de 2,1% → 4,7%)
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-xl">↗</span>
            </div>
            <p className="font-bold text-lg text-green-600">+119%</p>
            <p className="text-sm text-gray-600">Aumento médio de conversão</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">⏱</span>
            </div>
            <p className="font-bold text-lg text-blue-600">540h</p>
            <p className="text-sm text-gray-600">Horas poupadas por ano</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">€</span>
            </div>
            <p className="font-bold text-lg text-primary">4.8×</p>
            <p className="text-sm text-gray-600">ROI médio dos clientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowROI;