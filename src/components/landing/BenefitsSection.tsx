
const BenefitsSection = () => {
  const benefits = [
    {
      icon: "📈",
      title: "Mais leads organizados e convertidos",
      description: "Sistema completo de captação e conversão"
    },
    {
      icon: "⏱",
      title: "Economia de tempo com automações",
      description: "Fluxos automáticos que trabalham 24/7"
    },
    {
      icon: "💬",
      title: "Comunicação inteligente via WhatsApp",
      description: "Conexão direta e imediata com clientes"
    },
    {
      icon: "✅",
      title: "Conformidade legal com páginas obrigatórias",
      description: "RGPD, termos e políticas incluídos"
    },
    {
      icon: "💡",
      title: "Profissionalismo que gera confiança",
      description: "Design e copy que transmitem credibilidade"
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
            Seu negócio com presença, <span className="text-gradient">performance e previsibilidade</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-card/20 transition-colors">
              <div className="text-2xl md:text-3xl flex-shrink-0">{benefit.icon}</div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
