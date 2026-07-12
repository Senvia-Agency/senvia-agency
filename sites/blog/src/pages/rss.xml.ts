import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(context: { site: URL }) {
  const artigos = await getCollection('artigos', ({ data }) => !data.draft);
  const sorted = artigos.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: sorted.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/artigos/${entry.id}/`,
      author: entry.data.author,
      categories: [entry.data.category, ...entry.data.tags],
    })),
    customData: `<language>pt-PT</language>`,
  });
}