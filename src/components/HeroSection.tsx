
import { useEffect, useRef } from "react";
import { renderCanvas, TypeWriter, ShineBorder } from "@/components/ui/hero-designali";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const elements = heroRef.current.querySelectorAll(".parallax");
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      elements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || "0.1");
        const x = mouseX * speed * 50;
        const y = mouseY * speed * 50;
        (el as HTMLElement).style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    // Initialize the canvas effect
    renderCanvas();
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const services = [
    "Marketing Digital",
    "Web Design",
    "Social Media",
    "Desenvolvimento de Sites",
    "Tráfego Pago",
    "Agentes de IA",
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-secondary pt-20"
    >
      {/* Background geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-senvia-100 rounded-full opacity-30 animate-pulse-glow parallax" data-speed="0.03"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-senvia-200 rounded-full opacity-20 animate-pulse-glow parallax" data-speed="0.05"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-senvia-300 rounded-full opacity-25 animate-pulse-glow parallax" data-speed="0.07"></div>
        
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-senvia-500 rounded-lg opacity-30 animate-float parallax" data-speed="0.06"></div>
        <div className="absolute bottom-1/4 right-1/2 w-20 h-20 border-2 border-senvia-400 rounded-lg opacity-25 animate-float parallax" data-speed="0.04" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 border-2 border-senvia-600 rounded-lg opacity-30 animate-float parallax" data-speed="0.08" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="mb-6 mt-10">
            <div className="relative flex items-center justify-center rounded-full border bg-popover px-3 py-1 text-xs text-primary/60">
              Transformando ideias em experiências digitais
            </div>
          </div>
          
          <div className="inline-block mb-6">
            <div className="flex flex-col items-center">
              <div className="flex space-x-1 mb-2">
                <div className="w-6 h-6 bg-senvia-500 rounded transform rotate-45 animate-pulse-glow"></div>
                <div className="w-6 h-6 bg-senvia-500 rounded transform rotate-45 animate-pulse-glow" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-6 h-6 bg-senvia-500 rounded transform rotate-45 animate-pulse-glow" style={{ animationDelay: "0.4s" }}></div>
              </div>
              
              <div className="relative mx-auto h-full py-6 px-4">
                <h1 className="text-6xl md:text-8xl font-bold text-senvia-500 glow">SENVIA</h1>
                
                <div className="flex items-center mt-2 justify-center gap-1">
                  <span className="relative flex h-3 w-3 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <p className="text-xs text-green-500">Online Agora</p>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-4 animate-fade-in">
            A sua agência de marketing focada em resultados
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Especializados em{" "}
            <span className="text-senvia-500 font-semibold">
              <TypeWriter strings={services} />
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div onClick={() => scrollToSection('servicos')} className="cursor-pointer">
              <ShineBorder
                borderWidth={2}
                className="border h-auto w-auto p-2 bg-white/5 backdrop-blur-md"
                color={["#0073ff", "#33a1ff", "#66c2ff"]}
              >
                <div className="px-8 py-3 bg-senvia-500 hover:bg-senvia-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 glow-box" style={{ color: '#ffffff' }}>
                  Os Nossos Serviços
                </div>
              </ShineBorder>
            </div>
            
            <button 
              onClick={() => scrollToSection('contacto')}
              className="px-8 py-3 bg-white hover:bg-senvia-50 text-senvia-500 rounded-full border border-senvia-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contacte-nos
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button onClick={() => scrollToSection('servicos')} className="text-senvia-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
