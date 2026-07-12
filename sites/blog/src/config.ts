/**
 * Config central do blog SENVIA.
 * Alterar aqui propaga para todos os layouts e componentes.
 */

export const SITE = {
  name: 'SENVIA Blog',
  shortName: 'SENVIA',
  domain: 'blog.senvia.pt',
  url: 'https://blog.senvia.pt',
  // Domínio principal da marca (para cross-linking)
  mainSiteUrl: 'https://www.senvia.pt',
  appUrl: 'https://app.senvia.pt',
  locale: 'pt-PT',
  lang: 'pt',
  description:
    'Análises e guias práticos sobre Inteligência Artificial, Seguros, Finanças e gestão de PMEs em Portugal.',
  defaultAuthor: 'Redação SENVIA',
  email: 'geral@senvia.pt',
} as const;

export const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'IA', href: '/categoria/ia' },
  { label: 'Seguros', href: '/categoria/seguros' },
  { label: 'Finanças', href: '/categoria/financas' },
  { label: 'PMEs', href: '/categoria/pmes' },
  { label: 'Sobre', href: '/sobre' },
] as const;

export const CATEGORIES = {
  ia: {
    label: 'Inteligência Artificial',
    short: 'IA',
    description:
      'Aplicações práticas de IA em empresas portuguesas: automação, chatbots, generativos e análise preditiva.',
    color: '#00c3ff',
  },
  seguros: {
    label: 'Seguros',
    short: 'Seguros',
    description:
      'Seguros empresariais, responsabilidade civil profissional, cibernéticos e saúde para colaboradores.',
    color: '#0099cc',
  },
  financas: {
    label: 'Finanças',
    short: 'Finanças',
    description:
      'Financiamento PME, contabilidade digital, tesouraria, crédito e investimento em tecnologia.',
    color: '#007599',
  },
  pmes: {
    label: 'PMEs',
    short: 'PMEs',
    description:
      'Produtividade, CRM, marketing, vendas e digitalização para pequenas e médias empresas portuguesas.',
    color: '#004e66',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

/**
 * ID do publisher AdSense.
 * Substituir quando a conta for aprovada.
 * Vem da env PUB_ID no Vercel ou hardcode aqui.
 */
export const ADSENSE_CLIENT = 'ca-pub-0000000000000000'; // placeholder

export const SOCIAL = [
  { label: 'X (Twitter)', href: 'https://twitter.com/Senvia_Agency' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/senvia' },
] as const;
