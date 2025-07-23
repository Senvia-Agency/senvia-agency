const BenefitsSection = () => {
  const benefits = [
    {
      icon: "📈",
      title: "Captação de leads profissional",
      description: "Landing page otimizada + CRM para organizar e acompanhar cada oportunidade"
    },
    {
      icon: "✉️",
      title: "E-mails automáticos inteligentes",
      description: "Notificações para você + boas-vindas personalizadas para cada novo lead"
    },
    {
      icon: "💬",
      title: "WhatsApp integrado ao CRM",
      description: "Atendimento direto com histórico completo do lead na palma da mão"
    },
    {
      icon: "⚖️",
      title: "100% em conformidade legal",
      description: "Páginas de termos, privacidade e cookies que protegem seu negócio"
    },
    {
      icon: "🎯",
      title: "Foco total em conversão",
      description: "Cada elemento pensado para transformar visitantes em clientes reais"
    },
    {
      icon: "📊",
      title: "Relatórios e métricas detalhadas",
      description: "Acompanhe performance, origem dos leads e taxa de conversão em tempo real"
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
            Resultados que você vai ver <span className="text-gradient">desde o primeiro dia</span>
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