import { memo } from "react";
import { CheckCircle, Users, Target, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AboutSection = memo(() => {
  const sectionRef = useScrollAnimation(100);

  const stats = [
    { number: "200+", label: "Projetos Entregues", icon: Target },
    { number: "150+", label: "Clientes Satisfeitos", icon: Users },
    { number: "5+", label: "Anos de Experiência", icon: Award },
    { number: "98%", label: "Taxa de Satisfação", icon: CheckCircle }
  ];

  const values = [
    {
      title: "Inovação Constante",
      description: "Estamos sempre na vanguarda das tecnologias digitais, implementando soluções inovadoras que fazem a diferença."
    },
    {
      title: "Resultados Comprovados",
      description: "Focamos em métricas e resultados tangíveis, garantindo que cada investimento gere o retorno esperado."
    },
    {
      title: "Parceria de Confiança",
      description: "Construímos relacionamentos duradouros, sendo o parceiro estratégico que o teu negócio precisa."
    },
    {
      title: "Transparência Total",
      description: "Comunicação clara e transparente em todas as etapas, mantendo-te sempre informado sobre o progresso."
    }
  ];

  return (
    <section id="sobre" ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            <span className="text-gradient">Sobre a SENVIA</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-on-scroll">
            Somos uma agência de marketing digital e tecnologia que transforma ideias em experiências digitais impactantes. 
            Com foco em resultados e inovação, ajudamos empresas a crescer no mundo digital.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 animate-on-scroll"
            >
              <div className="bg-senvia-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-senvia-400" />
              </div>
              <div className="text-3xl font-bold text-senvia-500 mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission and Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              A Nossa <span className="text-gradient">Missão</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Democratizar o acesso a tecnologias digitais avançadas, permitindo que empresas de todos os tamanhos 
              possam competir no mercado digital com ferramentas profissionais e estratégias eficazes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que cada negócio tem potencial único e merece soluções personalizadas que reflitam 
              a sua identidade e objetivos. É por isso que trabalhamos lado a lado com os nossos clientes, 
              entendendo as suas necessidades específicas e criando estratégias sob medida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-senvia-500/50 transition-all duration-300"
              >
                <h4 className="font-semibold text-foreground mb-3">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;