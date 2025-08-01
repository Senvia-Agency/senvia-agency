import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Zap, TrendingUp } from 'lucide-react';
import AIModal from './AIModal';

const AIHeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const yOffset = -100; // Offset para compensar navbar fixa
      const y = offersSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#11161F' }}>
      {/* Animated Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/70" style={{ zIndex: 2 }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="text-[#00C3FF]">Inteligência Artificial</span>
          <br />
          sob medida para a sua empresa
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Soluções personalizadas de IA que automatizam processos, potencializam vendas e transformam a eficiência do seu negócio
        </p>
        
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg" 
            className="px-8 py-4 text-xl font-semibold rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white"
            style={{ backgroundColor: '#00C3FF' }}
          >
            Agendar Consultoria
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          
          <Button 
            onClick={scrollToOffers}
            size="lg" 
            variant="outline"
            className="px-8 py-4 text-xl font-semibold rounded-3xl border-2 border-[#00C3FF] text-[#00C3FF] hover:bg-[#00C3FF] hover:text-white transform hover:scale-105 transition-all duration-300"
          >
            Ver Serviços
          </Button>
        </div>
      </div>
      
      {/* Futuristic Glowing Elements */}
      <div className="absolute top-20 left-10 w-8 h-8 rounded-full animate-pulse opacity-80 blur-sm" style={{ backgroundColor: '#00C3FF', zIndex: 3 }} />
      <div className="absolute top-40 right-16 w-12 h-12 rounded-full animate-pulse opacity-60 blur-md" style={{ backgroundColor: '#00C3FF', zIndex: 3 }} />
      <div className="absolute bottom-32 left-20 w-6 h-6 rounded-full animate-pulse opacity-70 blur-sm" style={{ backgroundColor: '#00C3FF', zIndex: 3 }} />
      <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full animate-pulse opacity-90" style={{ backgroundColor: '#00C3FF', zIndex: 3 }} />
      <div className="absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full animate-pulse opacity-50 blur-lg" style={{ backgroundColor: '#00C3FF', zIndex: 3 }} />
      
      {/* AI Modal */}
      <AIModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default AIHeroSection;