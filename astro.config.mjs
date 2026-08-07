import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.senvia.pt',
  trailingSlash: 'ignore',
  server: {
    // Porta base do dev/preview. Trocar sem editar ficheiros:
    //   PowerShell -> $env:PORT=8083; npm run dev
    //   Git Bash   -> PORT=8083 npm run dev
    // Se estiver ocupada, o Astro passa sozinho para a seguinte livre.
    port: Number(process.env.PORT) || 4322,
    // NÃO fixar `host` aqui. Nesta máquina o localhost resolve para ::1
    // primeiro; fixar host:'127.0.0.1' liga-se só a IPv4 e parte o
    // http://localhost. O default liga-se a ::1 e o localhost funciona.
    // Para abrir no telemóvel (expõe na rede local): npm run dev -- --host
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'pt',
        locales: { pt: 'pt-PT' },
      },
      filter: (page) => !page.includes('/blog/artigos/') && !page.includes('/blog/categoria/'),
    }),
    mdx(),
  ],
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
