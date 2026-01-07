
import { AlertTriangle, Clock, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProblemSection = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "O Buraco Negro dos Leads",
      description: "Formulários que enviam dados para um email que ninguém lê a tempo. Se não responder em 5 minutos, o lead arrefece."
    },
    {
      icon: Clock,
      title: "A Lentidão que Mata",
      description: "Cada segundo de carregamento custa-lhe 20% de conversão. Páginas pesadas são ignoradas pelo Google e fechadas pelo utilizador."
    },
    {
      icon: Palette,
      title: "Design sem Estratégia",
      description: "Beleza sem psicologia de vendas é apenas arte. Arte não paga contas."
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
            O <span className="text-destructive">"Custo Invisível"</span> de uma Landing Page Amadora
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
            Você investe centenas de euros em tráfego (Google, Meta, TikTok), o cliente clica, e depois… <strong className="text-foreground">silêncio.</strong>
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            O problema não está nos seus anúncios. <strong className="text-foreground">Está no destino deles.</strong> No mercado atual, ter uma "página bonita" é irrelevante se ela não for uma máquina de engenharia persuasiva.
          </p>
        </div>

        <div className="mb-8 md:mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-destructive/90">
            Os 3 Pilares da Falência Digital
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {problems.map((problem, index) => (
              <Card key={index} className="bg-destructive/5 border-destructive/20 hover:border-destructive/40 transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="bg-destructive/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6">
                    <problem.icon className="h-6 w-6 md:h-8 md:w-8 text-destructive" />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{problem.title}</h4>
                  <p className="text-sm md:text-base text-muted-foreground">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed border-l-4 border-destructive/50 pl-4 md:pl-6 text-left italic">
            Se a sua página não captura, nutre e converte automaticamente, você está apenas a <strong className="text-foreground">enriquecer as plataformas de anúncios.</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
