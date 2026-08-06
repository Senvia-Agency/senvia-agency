export const SITE = {
  name: 'SENVIA',
  domain: 'senvia.pt',
  url: 'https://www.senvia.pt',
  blogUrl: 'https://www.senvia.pt/blog',
  appUrl: 'https://app.senvia.pt',
  locale: 'pt-PT',
  lang: 'pt',
  description:
    'SENVIA é uma AI Software House. Desenvolvimento de software à medida, sites, e-commerces, automações com IA e o nosso CRM proprietário SENVIA OS.',
  blogDescription:
    'Análises e guias práticos sobre Inteligência Artificial, Seguros, Finanças e gestão de PMEs em Portugal.',
  email: 'geral.senvia@gmail.com',
  location: 'Leiria, Portugal',
  ctaFormUrl: 'https://app.senvia.pt/c/senvia-agency/formulario-lp',
  ctaSiteFormUrl: 'https://app.senvia.pt/c/senvia-agency/formulario-site',
  defaultAuthor: 'Redação SENVIA',
} as const;

/**
 * Contacto direto por WhatsApp.
 *
 * Preencher `number` com o número em formato internacional, apenas dígitos,
 * sem "+" nem espaços (ex.: '351912345678').
 *
 * Enquanto `number` estiver vazio, `whatsappUrl()` devolve `null` e os CTAs de
 * WhatsApp fazem fallback automático para o formulário (SITE.ctaSiteFormUrl).
 * Nada quebra — basta preencher o número para os ativar.
 */
export const WHATSAPP = {
  number: '',
  defaultMessage: 'Olá! Vim pela página de sites da SENVIA e queria falar sobre o meu projeto.',
} as const;

export function whatsappUrl(message: string = WHATSAPP.defaultMessage): string | null {
  const digits = WHATSAPP.number.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: 'SENVIA OS', href: '/senvia-os' },
  { label: 'Serviços', hasDropdown: true },
  { label: 'Sobre Nós', href: '/sobre-nos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contactos', href: '/contacto' },
] as const;

export const SERVICE_LINKS = [
  { label: 'Sites & E-commerces', href: '/sites' },
  { label: 'Chatbots', href: '/chatbots' },
  { label: 'Softwares', href: '/softwares' },
];

export const BLOG_NAV_LINKS = [
  { label: 'Início', href: '/blog' },
  { label: 'IA', href: '/blog/categoria/ia' },
  { label: 'Seguros', href: '/blog/categoria/seguros' },
  { label: 'Finanças', href: '/blog/categoria/financas' },
  { label: 'PMEs', href: '/blog/categoria/pmes' },
  { label: 'Sobre', href: '/sobre-nos' },
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

export const ADSENSE_CLIENT = 'ca-pub-2464715822662169';

export const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/senvia.pt/', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/senvia.pt', icon: 'facebook' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/senvia-pt/', icon: 'linkedin' },
] as const;

export const STATS = [
  { value: '50+', label: 'Projetos Entregues' },
  { value: '120+', label: 'Automações Ativas' },
  { value: '95%', label: 'Taxa de Satisfação' },
] as const;
