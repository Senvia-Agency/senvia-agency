import { CheckCircle, Clock, Code, Settings, Rocket } from "lucide-react";

const NeoFlowTimeline = () => {
  const timeline = [
    {
      day: "Dia 0",
      title: "Brief & objetivos",
      icon: CheckCircle,
      description: "Definição de requisitos e objetivos"
    },
    {
      day: "Dia 5", 
      title: "Copy & wireframe aprovados",
      icon: Clock,
      description: "Conteúdo e estrutura finalizados"
    },
    {
      day: "Dia 10",
      title: "Design & dev concluídos", 
      icon: Code,
      description: "Site desenvolvido e testado"
    },
    {
      day: "Dia 12",
      title: "Integrações n8n/WA/E-mail",
      icon: Settings, 
      description: "Automações configuradas e testadas"
    },
    {
      day: "Dia 15",
      title: "Go-Live + vídeo-handover",
      icon: Rocket,
      description: "Lançamento e entrega ao cliente"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Deployment <span className="text-primary">15 Days</span>
          </h2>
          <p className="text-xl text-gray-600">
            Linha temporal garantida do briefing ao go-live
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {timeline.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-3">
                      {item.day}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs lg:text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Connection arrow for mobile */}
                {index < timeline.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-primary/30"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-primary/5 rounded-2xl p-6 inline-block">
            <p className="text-lg font-semibold text-primary">
              ✓ Garantia de entrega em 15 dias ou reembolso total
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowTimeline;