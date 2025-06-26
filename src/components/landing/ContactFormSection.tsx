
import { Card, CardContent } from "@/components/ui/card";
import LandingPageForm from "./LandingPageForm";

const ContactFormSection = () => {
  return (
    <section id="form" className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 px-4">
            Sua estrutura profissional <span className="text-gradient">começa com um passo</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Dê adeus aos formulários soltos, páginas genéricas e atendimento desorganizado.
            Construa a base digital do seu negócio com inteligência e performance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-card/50 backdrop-blur-sm border border-senvia-500/20">
            <CardContent className="p-6 md:p-10 lg:p-12">
              <LandingPageForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
