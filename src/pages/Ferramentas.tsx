
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToolsCarousel from "../components/ToolsCarousel";


const Ferramentas = () => {
  return (
    <div className="min-h-screen">
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Nossas Ferramentas</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Utilizamos as tecnologias mais avançadas e ferramentas de ponta para entregar soluções digitais 
              de alta qualidade que impulsionam o crescimento do seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <ToolsCarousel />

      {/* Technologies Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Tecnologias que Dominamos</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <h3 className="text-xl font-bold mb-4">Frontend</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>React, Vue.js, Angular</p>
                  <p>HTML5, CSS3, JavaScript</p>
                  <p>Tailwind CSS, Bootstrap</p>
                  <p>Responsive Design</p>
                </div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <h3 className="text-xl font-bold mb-4">Backend</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Node.js, Python, PHP</p>
                  <p>MySQL, PostgreSQL, MongoDB</p>
                  <p>REST APIs, GraphQL</p>
                  <p>Cloud Services (AWS, Azure)</p>
                </div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <h3 className="text-xl font-bold mb-4">Marketing</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Google Analytics, Meta Pixel</p>
                  <p>SEO Tools, Keyword Research</p>
                  <p>Email Marketing Platforms</p>
                  <p>Social Media Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ferramentas;
