import { memo } from 'react';

const clients = [
  { name: 'Clínica Renascer', logo: '/images/clients/logo-renascer.png', url: 'https://clinicarenascer.pt/' },
  { name: 'Estúdio Tiago Pereira', logo: '/images/clients/logo-tiago.png', url: 'https://estudiotiagopereira.pt/' },
  { name: 'Longev Studio', logo: '/images/clients/logo-longev.svg', url: 'https://longevstudio.com/' },
  { name: 'Dra. Cristina Sousa', logo: '/images/clients/logo-dracristina.png', url: 'https://dracristinasousa.com/' },
];

const doubled = [...clients, ...clients];

const ClientLogosSection = memo(() => {
  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          Projetos que Confiaram na SENVIA
        </h2>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-16 md:gap-24 w-max">
          {doubled.map((client, i) => (
            <a
              key={`${client.name}-${i}`}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center h-14 md:h-16 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={client.logo}
                alt={`Logo ${client.name}`}
                className="h-full w-auto max-w-[160px] object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

ClientLogosSection.displayName = 'ClientLogosSection';

export default ClientLogosSection;
