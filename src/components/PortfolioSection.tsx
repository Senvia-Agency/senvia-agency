import { useEffect, useRef, useState } from "react";
import { AnimatedTestimonials } from "./ui/animated-testimonials";

const portfolioItems = [
  {
    title: "Website Corporativo",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Um website moderno e profissional para uma empresa de consultoria financeira."
  },
  {
    title: "Loja Online",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Uma loja online completa para uma marca de moda sustentável."
  },
  {
    title: "Campanha de Marketing",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Uma campanha de marketing digital que aumentou o engajamento nas redes sociais em 300%."
  },
  {
    title: "Chatbot de Atendimento",
    category: "IA",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Um assistente virtual que otimizou o atendimento ao cliente, reduzindo o tempo de espera em 80%."
  },
  {
    title: "Sistema de Gestão",
    category: "Plataformas",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Uma plataforma personalizada para gestão financeira e controle de estoque."
  },
  {
    title: "App Mobile",
    category: "Desenvolvimento",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Um aplicativo móvel para uma startup de serviços de entrega."
  }
];

// Testimonial data
const testimonials = [
  {
    quote: "A SENVIA transformou completamente nossa presença online. O site que criaram superou todas as nossas expectativas.",
    name: "Carlos Oliveira",
    designation: "CEO da TechSolutions",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    quote: "A campanha de marketing digital desenvolvida pela SENVIA aumentou nossas conversões em 200%. Resultados incríveis!",
    name: "Ana Silva",
    designation: "Diretora de Marketing da GrowthBiz",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    quote: "Profissionalismo, criatividade e pontualidade. A equipe da SENVIA entendeu perfeitamente o que precisávamos.",
    name: "Marcelo Santos",
    designation: "Fundador da InnovateBrand",
    src: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    quote: "O aplicativo desenvolvido pela SENVIA revolucionou nosso atendimento ao cliente. Interface intuitiva e performance excepcional.",
    name: "Juliana Costa",
    designation: "COO da MobileTech",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    quote: "Parceria de sucesso! A SENVIA nos ajudou a implementar soluções tecnológicas que impulsionaram nosso crescimento.",
    name: "Roberto Almeida",
    designation: "Diretor de Inovação da FutureCorp",
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
];

const PortfolioSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [filteredItems, setFilteredItems] = useState(portfolioItems);
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = ["Todos", ...new Set(portfolioItems.map(item => item.category))];
    setCategories(uniqueCategories);
    
    // Setup intersection observer for animations
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

    // Auto rotate active item
    const interval = setInterval(() => {
      setActiveItem(prev => (prev + 1) % filteredItems.length);
    }, 5000);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      clearInterval(interval);
    };
  }, [filteredItems.length]);

  // Handle filter change
  useEffect(() => {
    setAnimation("animate-fade-out");
    
    setTimeout(() => {
      if (filter === "Todos") {
        setFilteredItems(portfolioItems);
      } else {
        setFilteredItems(portfolioItems.filter(item => item.category === filter));
      }
      setActiveItem(0);
      setAnimation("animate-fade-in");
    }, 300);
  }, [filter]);

  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white to-blue-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            <span className="text-gradient">Os Nossos Projetos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            Conheça alguns dos nossos trabalhos mais recentes e descubra como podemos ajudar o seu negócio.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-3 mb-12 animate-on-scroll">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === category
                  ? "bg-senvia-500 text-white shadow-md"
                  : "bg-white text-senvia-700 border border-senvia-200 hover:border-senvia-500"
              }`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={`relative min-h-[500px] ${animation}`}>
          {filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                {filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeItem === index
                        ? "col-span-4 md:col-span-3 row-span-2"
                        : "col-span-2 md:col-span-1"
                    }`}
                    onClick={() => handleItemClick(index)}
                  >
                    <div
                      className={`h-full rounded-lg overflow-hidden shadow-md transition-transform duration-300 ${
                        activeItem === index
                          ? "transform scale-100"
                          : "hover:scale-105"
                      }`}
                    >
                      <div className="relative h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 z-10"></div>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        {activeItem !== index && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-white z-20">
                            <h4 className="text-sm font-medium truncate">{item.title}</h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg animate-on-scroll">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src={filteredItems[activeItem].image}
                    alt={filteredItems[activeItem].title}
                    className="rounded-lg w-full md:w-1/3 aspect-video object-cover shadow-md"
                  />
                  <div>
                    <span className="text-senvia-500 font-medium">{filteredItems[activeItem].category}</span>
                    <h3 className="text-2xl font-bold mb-3">{filteredItems[activeItem].title}</h3>
                    <p className="text-muted-foreground">{filteredItems[activeItem].description}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 animate-on-scroll">
              <p className="text-muted-foreground">Nenhum projeto encontrado nesta categoria.</p>
            </div>
          )}
        </div>

        {/* Testimonials Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
              <span className="text-gradient">O Que Dizem Nossos Clientes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
              Veja o que nossos parceiros e clientes têm a dizer sobre os resultados que entregamos.
            </p>
          </div>
          
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
