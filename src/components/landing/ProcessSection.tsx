
const ProcessSection = () => {
  const processSteps = [
    {
      number: "01",
      title: "Briefing detalhado",
      description: "Analisamos seu negócio e definimos a estratégia da landing page + CRM"
    },
    {
      number: "02",
      title: "Criação da landing page",
      description: "Desenvolvemos página com copy estratégica e design de alta conversão"
    },
    {
      number: "03",
      title: "Configuração do CRM",
      description: "Criamos e integramos o sistema completo de gestão de leads e automação"
    },
    {
      number: "04",
      title: "Entrega e treinamento",
      description: "Ativamos tudo e ensinamos você a gerir leads como um profissional"
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Como funciona o <span className="text-gradient">nosso processo</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-senvia-500/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-lg md:text-2xl font-bold text-senvia-400">{step.number}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{step.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
