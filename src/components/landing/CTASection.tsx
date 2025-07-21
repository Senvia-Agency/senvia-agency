
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const handleCTAClick = () => {
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-senvia-500/20 via-transparent to-senvia-400/20">
      <div className="container mx-auto text-center max-w-4xl">
        <Button 
          size="lg" 
          className="text-sm md:text-base px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 w-full sm:w-auto h-auto min-h-[48px] md:min-h-[56px] max-w-md mx-auto text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all"
          onClick={handleCTAClick}
          data-fb-no-track="true"
        >
          <span className="flex flex-col sm:flex-row items-center justify-center gap-1 text-center leading-tight">
            <span className="text-xs sm:text-sm md:text-base font-medium">
              Falar com especialista
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
          </span>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
