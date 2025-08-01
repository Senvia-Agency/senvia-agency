import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Zap, TrendingUp } from 'lucide-react';

const AIHeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      import('p5').then((p5Module) => {
        const p5 = p5Module.default;
        
        const sketch = (p: any) => {
          let particles: any[] = [];
          
          p.setup = () => {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent(canvasRef.current);
            
            // Create particles
            for (let i = 0; i < 100; i++) {
              particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(2, 8),
                speedX: p.random(-1, 1),
                speedY: p.random(-1, 1),
                alpha: p.random(0.3, 0.8)
              });
            }
          };
          
          p.draw = () => {
            p.clear();
            
            // Draw neural network connections
            p.stroke(0, 240, 255, 30);
            p.strokeWeight(1);
            for (let i = 0; i < particles.length; i++) {
              for (let j = i + 1; j < particles.length; j++) {
                const d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                if (d < 150) {
                  p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                }
              }
            }
            
            // Draw and update particles
            for (let particle of particles) {
              p.fill(0, 240, 255, particle.alpha * 255);
              p.noStroke();
              p.ellipse(particle.x, particle.y, particle.size);
              
              particle.x += particle.speedX;
              particle.y += particle.speedY;
              
              // Wrap around edges
              if (particle.x < 0) particle.x = p.width;
              if (particle.x > p.width) particle.x = 0;
              if (particle.y < 0) particle.y = p.height;
              if (particle.y > p.height) particle.y = 0;
            }
          };
          
          p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
          };
        };
        
        new p5(sketch);
      });
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const scrollToOffers = () => {
    const offersSection = document.getElementById('ai-offers');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60" style={{ zIndex: 2 }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* SENVIA Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/lovable-uploads/30e628f9-6630-4c7b-83e9-1171c7f1c7f7.png" 
            alt="SENVIA" 
            className="h-16 w-auto filter drop-shadow-lg"
          />
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transforme Seu Negócio
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            com IA do Futuro
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Automações Inteligentes para Vendas e Atendimento que Funcionam 24/7
        </p>
        
        {/* Key Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="flex items-center gap-2 text-cyan-400">
            <Bot className="w-6 h-6" />
            <span className="text-lg font-semibold">+300% Conversões</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <Zap className="w-6 h-6" />
            <span className="text-lg font-semibold">24/7 Automatizado</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <TrendingUp className="w-6 h-6" />
            <span className="text-lg font-semibold">ROI Garantido</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={scrollToOffers}
          size="lg" 
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-xl font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
        >
          Começar Agora
          <ArrowRight className="ml-2 w-6 h-6" />
        </Button>
        
        {/* Trust Indicator */}
        <p className="text-slate-400 mt-6 text-sm">
          Implementação em 48h • Suporte 24/7 • Garantia de Resultados
        </p>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-pulse opacity-60" style={{ zIndex: 3 }} />
      <div className="absolute top-40 right-16 w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-40" style={{ zIndex: 3 }} />
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50" style={{ zIndex: 3 }} />
    </section>
  );
};

export default AIHeroSection;