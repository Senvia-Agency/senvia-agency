export const SITE = {
  name: 'SENVIA',
  domain: 'senvia.pt',
  url: 'https://www.senvia.pt',
  blogUrl: 'https://blog.senvia.pt',
  appUrl: 'https://app.senvia.pt',
  locale: 'pt-PT',
  lang: 'pt',
  description:
    'SENVIA é uma AI Software House. Desenvolvimento de software à medida, sites, e-commerces, automações com IA e o nosso CRM proprietário SENVIA OS.',
  email: 'geral.senvia@gmail.com',
  location: 'Leiria, Portugal',
  ctaFormUrl: 'https://app.senvia.pt/c/senvia-agency/formulario-lp',
  ctaSiteFormUrl: 'https://app.senvia.pt/c/senvia-agency/formulario-site',
} as const;

export const NAV_LINKS = [
  { label: 'SENVIA OS', href: '/senvia-os' },
  { label: 'Serviços', href: '/servicos', hasDropdown: true },
  { label: 'Sobre Nós', href: '/sobre-nos' },
  { label: 'Blog', href: 'external:blog' },
  { label: 'Contactos', href: '/#contactos' },
] as const;

export const SERVICE_LINKS = [
  { label: 'Sites & E-commerces', href: '/sites' },
  { label: 'Chatbots', href: '/chatbots' },
  { label: 'Softwares', href: '/softwares' },
];

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
