
import { Card, CardContent } from "@/components/ui/card";
import LandingPageForm from "./LandingPageForm";

const ContactFormSection = () => {
  return (
    <section id="form" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sua estrutura profissional <span className="text-gradient">começa com um passo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dê adeus aos formulários soltos, páginas genéricas e atendimento desorganizado.
            Construa a base digital do seu negócio com inteligência e performance.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border border-senvia-500/20">
            <CardContent className="p-8">
              <LandingPageForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
