import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

const NeoFlowDemo = () => {
  return (
    <section className="py-12 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-foreground">
          Demonstração Interactiva <span className="text-primary">(&lt;30s)</span>
        </h2>
        
        <div className="relative bg-card rounded-3xl p-4 md:p-8 shadow-2xl border border-border">
          <div className="aspect-video bg-gray-900 rounded-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Button size="lg" className="bg-background text-foreground hover:bg-muted border shadow-xl">
                <Play className="w-6 h-6 mr-2" />
                Ver Demonstração
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/80 backdrop-blur rounded-lg p-4 text-white">
                <p className="text-sm font-semibold">
                  "Tudo isto aconteceu em 7 segundos."
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span className="text-sm text-foreground">Lead preenche formulário</span>
            </div>
            <ArrowRight className="hidden lg:block w-6 h-6 text-muted-foreground mx-auto self-center" />
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span className="text-sm text-foreground">WhatsApp dispara</span>
            </div>
            <ArrowRight className="hidden lg:block w-6 h-6 text-muted-foreground mx-auto self-center" />
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span className="text-sm text-foreground">Registo no CRM</span>
            </div>
            <ArrowRight className="hidden lg:block w-6 h-6 text-muted-foreground mx-auto self-center" />
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span className="text-sm text-foreground">E-mail enviado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowDemo;