
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// List of tools logos shown in the carousel
const tools = [
  { name: "Photoshop", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
  { name: "Illustrator", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "WordPress", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { name: "Google Ads", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Ads_logo.svg/512px-Google_Ads_logo.svg.png" },
  { name: "Facebook Ads", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/512px-Facebook_icon_2013.svg.png" },
  { name: "Shopify", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg" },
  { name: "WooCommerce", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg" },
  { name: "Adobe XD", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg" },
  { name: "TailwindCSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
];

const ToolsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".animate-on-scroll");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("visible");
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tools.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle carousel navigation
  const navigate = (direction: "next" | "prev") => {
    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % tools.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + tools.length) % tools.length);
    }
  };

  return (
    <section
      id="ferramentas"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-blue-50 to-white overflow-hidden"
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-300"
            onClick={() => navigate("prev")}
          >
            <ChevronLeft className="h-6 w-6 text-senvia-500" />
          </button>
          
          <div className="overflow-hidden px-12" ref={containerRef}>
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
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xs md:max-w-md mx-auto flex flex-col items-center glow-box">
                      <img 
                        src={tool.logo} 
                        alt={tool.name} 
                        className="h-20 md:h-28 w-auto object-contain mb-4"
                      />
                      <h3 className="text-xl font-semibold text-senvia-700">{tool.name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-300"
            onClick={() => navigate("next")}
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsCarousel;
