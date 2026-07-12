
import { useEffect, useState, memo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import OptimizedImage from "./OptimizedImage";

// Usando imagens locais para melhor performance
const tools = [
  { name: "Photoshop", logo: "/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" },
  { name: "Illustrator", logo: "/lovable-uploads/d810e16f-1ebf-4288-9a52-9bf0fa5586c2.png" },
  { name: "Figma", logo: "/lovable-uploads/e29257f0-dc8b-4672-accb-c98d9b83e84e.png" },
  { name: "WordPress", logo: "/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" },
  { name: "React", logo: "/lovable-uploads/d810e16f-1ebf-4288-9a52-9bf0fa5586c2.png" },
  { name: "Vue.js", logo: "/lovable-uploads/e29257f0-dc8b-4672-accb-c98d9b83e84e.png" },
  { name: "Google Ads", logo: "/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" },
  { name: "Google Ads", logo: "/lovable-uploads/d810e16f-1ebf-4288-9a52-9bf0fa5586c2.png" },
  { name: "Shopify", logo: "/lovable-uploads/e29257f0-dc8b-4672-accb-c98d9b83e84e.png" },
  { name: "WooCommerce", logo: "/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" },
  { name: "Adobe XD", logo: "/lovable-uploads/d810e16f-1ebf-4288-9a52-9bf0fa5586c2.png" },
  { name: "TailwindCSS", logo: "/lovable-uploads/e29257f0-dc8b-4672-accb-c98d9b83e84e.png" },
];

const ToolsCarousel = memo(() => {
  const sectionRef = useScrollAnimation(100);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageError = useCallback((toolName: string) => {
    console.log(`Error loading image for ${toolName}`);
  }, []);

  // Auto-rotate carousel com performance otimizada
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tools.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle carousel navigation com useCallback
  const navigate = useCallback((direction: "next" | "prev") => {
    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % tools.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + tools.length) % tools.length);
    }
  }, []);

  return (
    <section
      id="ferramentas"
      ref={sectionRef}
      className="py-24 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            <span className="text-gradient">Ferramentas & Tecnologias</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            Utilizamos as melhores e mais modernas ferramentas do mercado para oferecer soluções de alta qualidade.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 p-2 rounded-full shadow-md hover:bg-card transition-all duration-300 border border-border"
            onClick={() => navigate("prev")}
            aria-label="Previous tool"
          >
            <ChevronLeft className="h-6 w-6 text-senvia-500" />
          </button>
          
          <div className="overflow-hidden px-12">
            <div className="relative h-64 md:h-80">
              {tools.map((tool, index) => {
                const isActive = index === activeIndex;
                const prevIndex = (activeIndex - 1 + tools.length) % tools.length;
                const nextIndex = (activeIndex + 1) % tools.length;
                
                let position = "opacity-0 scale-75";
                
                if (isActive) {
                  position = "opacity-100 scale-100 z-20";
                } else if (index === prevIndex) {
                  position = "opacity-60 scale-75 -translate-x-1/2 z-10";
                } else if (index === nextIndex) {
                  position = "opacity-60 scale-75 translate-x-1/2 z-10";
                }
                
                return (
                  <div
                    key={tool.name}
                    className={`absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center transition-all duration-500 transform ${position}`}
                  >
                    <div className="bg-card p-8 rounded-2xl shadow-lg w-full max-w-xs md:max-w-md mx-auto flex flex-col items-center glow-box border border-border">
                      <OptimizedImage 
                        src={tool.logo} 
                        alt={`${tool.name} logo`}
                        onError={() => handleImageError(tool.name)}
                        loading="lazy"
                        className="h-20 md:h-28 w-auto object-contain mb-4"
                      />
                      <h3 className="text-xl font-semibold text-foreground">{tool.name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 p-2 rounded-full shadow-md hover:bg-card transition-all duration-300 border border-border"
            onClick={() => navigate("next")}
            aria-label="Next tool"
          >
            <ChevronRight className="h-6 w-6 text-senvia-500" />
          </button>
          
          <div className="flex justify-center mt-6 space-x-2">
            {tools.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-senvia-500 w-4"
                    : "bg-senvia-200"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ToolsCarousel.displayName = 'ToolsCarousel';

export default ToolsCarousel;
