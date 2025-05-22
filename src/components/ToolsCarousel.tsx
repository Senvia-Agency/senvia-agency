
import { useEffect, useRef, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// List of tools logos shown in the carousel
const tools = [
  { id: "photoshop", name: "Photoshop", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
  { id: "illustrator", name: "Illustrator", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
  { id: "figma", name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { id: "wordpress", name: "WordPress", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
  { id: "react", name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { id: "vuejs", name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { id: "googleads", name: "Google Ads", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Ads_logo.svg/512px-Google_Ads_logo.svg.png" },
  { id: "facebookads", name: "Facebook Ads", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/512px-Facebook_icon_2013.svg.png" },
  { id: "shopify", name: "Shopify", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg" },
  { id: "woocommerce", name: "WooCommerce", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg" },
  { id: "adobexd", name: "Adobe XD", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg" },
  { id: "tailwindcss", name: "TailwindCSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
];

const ToolsCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});

  // Handle image load error
  const handleImageError = (toolName: string) => {
    console.log(`Error loading image for ${toolName}`);
  };

  // Handle image load success
  const handleImageLoad = (toolName: string) => {
    setLoadedImages(prev => ({...prev, [toolName]: true}));
  };

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

        <div className="pt-10">
          <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
            <Carousel
              opts={{ loop: true }}
              plugins={AutoScroll({ playOnInit: true, speed: 1 })}
            >
              <CarouselContent className="ml-0">
                {tools.map((tool) => (
                  <CarouselItem
                    key={tool.id}
                    className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                  >
                    <div className="mx-8 flex shrink-0 items-center justify-center">
                      <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col items-center glow-box">
                        <img
                          src={tool.logo}
                          alt={`${tool.name} logo`}
                          onError={() => handleImageError(tool.name)}
                          onLoad={() => handleImageLoad(tool.name)}
                          className="h-16 md:h-20 w-auto object-contain mb-2"
                        />
                        <h3 className="text-md font-semibold text-senvia-700">{tool.name}</h3>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-blue-50 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blue-50 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsCarousel;
