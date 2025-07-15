import { Quote, TrendingUp, Clock } from "lucide-react";

const NeoFlowCaseStudy = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border">
          <div className="text-center mb-8">
            <Quote className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">Case Study Flash</h2>
          </div>
          
          <blockquote className="text-center space-y-6">
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              "Com o NeoFlow™ subimos de <span className="text-red-500 font-bold">2,1%</span> → <span className="text-primary font-bold">4,6%</span> de conversão e poupámos <span className="font-bold">540 horas/ano</span> em tarefas manuais."
            </p>
            
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <div className="h-px bg-gray-300 flex-1"></div>
              <div className="text-center">
                <p className="font-bold text-lg">Joana Saraiva</p>
                <p className="text-sm">CEO ViridisTech</p>
              </div>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <div className="bg-accent/10 rounded-2xl p-6 inline-block">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-accent" />
                <span className="text-xl font-bold text-accent">Pay-back: 14 dias</span>
              </div>
            </div>
          </blockquote>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-500">Conversão</p>
              <p className="text-2xl font-bold text-primary">+119%</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-gray-500">Tempo poupado</p>
              <p className="text-2xl font-bold text-accent">540h/ano</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">€</div>
              <p className="text-sm text-gray-500">ROI</p>
              <p className="text-2xl font-bold text-green-600">26×</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowCaseStudy;