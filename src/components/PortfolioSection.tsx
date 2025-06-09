
import { useEffect, useRef, useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";

const portfolioItems = [
  {
    title: "CRM Distância",
    category: "Plataformas",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Sistema completo de gestão de relacionamento com clientes para empresas de ensino à distância.",
    link: "https://crmdistancia.senvia.pt/",
    tags: ["CRM", "Gestão", "Educação"]
  },
  {
    title: "CRM DASP",
    category: "Plataformas",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Plataforma avançada de CRM personalizada para otimização de processos empresariais.",
    link: "https://crmdasp.senvia.pt/",
    tags: ["CRM", "Automação", "Negócios"]
  },
  {
    title: "Thais Lorrayne",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Website profissional e elegante para marca pessoal com design moderno e responsivo.",
    link: "https://thaislorrayne.senvia.pt/",
    tags: ["Portfolio", "Pessoal", "Design"]
  },
  {
    title: "Daniel Freitas",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Site profissional com identidade visual única e experiência de usuário otimizada.",
    link: "https://danielfreitas.senvia.pt/",
    tags: ["Portfolio", "Profissional", "UX"]
  }
];

const PortfolioSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [filteredItems, setFilteredItems] = useState(portfolioItems);

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
              }, index * 150);
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

  // Handle filter change
  useEffect(() => {
    if (filter === "Todos") {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === filter));
    }
  }, [filter]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-24 bg-background"
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
                  : "bg-card text-foreground border border-border hover:border-senvia-500"
              }`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="group relative bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 hover:border-senvia-500/50 transition-all duration-500 animate-on-scroll"
              >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-senvia-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-senvia-500/90 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative p-8 z-10">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-senvia-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Visit Button */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300 group/btn"
                  >
                    <span>Visitar Projeto</span>
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-senvia-500/10 rounded-full blur-3xl group-hover:bg-senvia-500/20 transition-colors duration-700" />
                <div className="absolute -bottom-10 -left-10 w-30 h-30 bg-senvia-400/10 rounded-full blur-2xl group-hover:bg-senvia-400/20 transition-colors duration-700" />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 animate-on-scroll">
              <p className="text-muted-foreground">Nenhum projeto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
