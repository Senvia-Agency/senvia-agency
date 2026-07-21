import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.senvia.pt',
  trailingSlash: 'ignore',
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
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    server: { fs: { allow: ['..'] } },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
