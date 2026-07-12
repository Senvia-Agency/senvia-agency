import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Coleção de artigos do blog SENVIA.
 *
 * Verticals:
 *  - ia        → Inteligência Artificial empresarial
 *  - seguros   → Seguros PME / profissional
 *  - financas  → Finanças, crédito, contabilidade
 *  - pmes      → Produtividade e gestão para PMEs portuguesas
 *
 * Slug do arquivo vira URL: /artigos/<slug>
 */
const artigos = defineCollection({
  loader: glob({ base: './src/content/artigos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(20).max(120),
    description: z.string().min(50).max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Redação SENVIA'),
    category: z.enum(['ia', 'seguros', 'financas', 'pmes']),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    readingTime: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { artigos };
