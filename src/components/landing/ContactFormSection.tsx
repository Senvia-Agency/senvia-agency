
import { Card, CardContent } from "@/components/ui/card";
import LandingPageForm from "./LandingPageForm";

const ContactFormSection = () => {
  return (
    <section id="form" className="py-8 md:py-16 px-2 sm:px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-6 px-2">
            Sua estrutura profissional <span className="text-gradient">começa com um passo</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Dê adeus aos formulários soltos, páginas genéricas e atendimento desorganizado.
            Construa a base digital do seu negócio com inteligência e performance.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-1 sm:px-2">
          <Card className="bg-card/50 backdrop-blur-sm border border-senvia-500/20">
            <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
              <LandingPageForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
