
import { Search, PenTool, Code, Rocket } from "lucide-react";

const ProcessSection = () => {
  const processSteps = [
    {
      number: "01",
      icon: Search,
      title: "Imersão e Diagnóstico",
      description: "Não abrimos o computador sem entender o seu negócio. Analisamos a sua oferta, o seu público e os seus concorrentes para definir a estratégia de ataque."
    },
    {
      number: "02",
      icon: PenTool,
      title: "Arquitetura e Copywriting",
      description: "Desenhamos o fluxo de vendas e escrevemos cada palavra com foco em conversão. Nada de 'lorem ipsum'. Aqui constrói-se a narrativa."
    },
    {
      number: "03",
      icon: Code,
      title: "Desenvolvimento e Integração (O Setup)",
      description: "Construímos a página e ligamos os 'cabos' digitais: CRM, Domínios, Pixels de Rastreio e Automações de Email/WhatsApp."
    },
    {
      number: "04",
      icon: Rocket,
      title: "Validação e Entrega",
      description: "Testamos a carga, a velocidade e o fluxo de dados. Entregamos-lhe a chave de uma Ferrari digital pronta a acelerar, com formação para a sua equipa."
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Do Diagnóstico à Escala: <span className="text-gradient">O Protocolo SENVIA</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Não improvisamos. Seguimos um processo militar para garantir que a sua estrutura esteja no ar e a faturar o mais rápido possível.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line - hidden on mobile, visible on larger screens */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-senvia-500/50 via-senvia-400/30 to-senvia-500/50 transform -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {processSteps.map((step, index) => (
              <div key={index} className={`relative lg:flex lg:items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Content */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left'}`}>
                  <div className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-senvia-500/20 hover:border-senvia-500/40 transition-all duration-300 ${index % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'} lg:max-w-md`}>
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="bg-senvia-500/10 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-6 w-6 md:h-7 md:w-7 text-senvia-400" />
                      </div>
                      <span className="text-3xl md:text-4xl font-bold text-senvia-500/40">{step.number}</span>
                    </div>
                    <h3 className={`text-lg md:text-xl font-bold mb-3 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>{step.title}</h3>
                    <p className={`text-sm md:text-base text-muted-foreground ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>{step.description}</p>
                  </div>
                </div>

                {/* Timeline dot - hidden on mobile */}
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                  <div className="w-4 h-4 bg-senvia-500 rounded-full border-4 border-background shadow-lg shadow-senvia-500/30" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block lg:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
