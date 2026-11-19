/**
 * Configuração central da marca.
 * Tudo que muda de uma oficina para outra fica aqui: nome, contatos,
 * horários, imagens e textos dos CTAs. Os dados abaixo são DEMONSTRATIVOS.
 */

export type ImageAsset = {
  /** ID da foto no CDN do Unsplash (images.unsplash.com/photo-<id>) */
  unsplashId: string
  alt: string
  credit: string
  creditUrl: string
  /** proporção intrínseca para evitar layout shift */
  width: number
  height: number
  /** ponto focal para object-position */
  focus?: string
}

export const site = {
  brand: {
    name: 'TORQ',
    descriptor: 'Automotive Service',
    tagline: 'Precisão em cada detalhe.',
    /** marca fictícia usada para demonstração comercial */
    isDemo: true,
  },

  contact: {
    /**
     * Número do WhatsApp em formato internacional, só dígitos (ex.: 5511999999999).
     * Vazio = modo demonstração: o fluxo mostra a prévia da mensagem e permite copiar.
     */
    whatsapp: '',
    phoneDisplay: '(00) 0000-0000',
    email: 'contato@exemplo.com',
    addressLines: ['Rua Exemplo, 000 — Bairro Demonstrativo', 'Cidade/UF'],
    addressNote: 'Endereço demonstrativo. Não corresponde a um local real.',
  },

  hours: [
    { days: 'Segunda a sexta', time: '08h00 – 18h00' },
    { days: 'Sábado', time: '08h00 – 12h00' },
    { days: 'Domingo e feriados', time: 'Fechado' },
  ],
  hoursNote: 'Horários ilustrativos para demonstração.',

  cta: {
    primary: 'Agendar avaliação',
    secondary: 'Explorar serviços',
    whatsapp: 'Falar pelo WhatsApp',
  },

  /** Marca d'água oficial Or7 — informe o caminho do ativo quando fornecido (ex.: '/or7-mark.svg'). */
  or7Watermark: null as string | null,
  signature: 'Concept & Development by Or7.dev',
  signatureUrl: 'https://or7.dev',

  images: {
    hero: {
      unsplashId: '1615906655593-ad0386982a0f',
      alt: 'Mecânico inclinado sobre o cofre do motor, trabalhando com luvas em componentes do veículo',
      credit: 'Sten Rademaker',
      creditUrl: 'https://unsplash.com/photos/UZUzvJEvKnI',
      width: 3456,
      height: 5184,
      focus: '45% 40%',
    },
    workshop: {
      unsplashId: '1727893119356-1702fe921cf9',
      alt: 'Oficina ampla e organizada, com elevadores automotivos e veículos em manutenção',
      credit: 'Mehmet Talha Onuk',
      creditUrl: 'https://unsplash.com/photos/8t6tk7LYLrE',
      width: 6000,
      height: 3000,
      focus: '50% 50%',
    },
    tools: {
      unsplashId: '1637640125496-31852f042a60',
      alt: 'Gaveta de ferramentas com chaves combinadas e soquetes organizados',
      credit: 'Isabela Kronemberger',
      creditUrl: 'https://unsplash.com/photos/OegFhZfw6Ok',
      width: 4000,
      height: 6000,
      focus: '50% 50%',
    },
    contact: {
      unsplashId: '1619642751034-765dfdf7c58e',
      alt: 'Mãos com graxa apertando um componente do motor com uma chave metálica, em luz baixa',
      credit: 'Christian Buehner',
      creditUrl: 'https://unsplash.com/photos/Fd6osyVbtG4',
      width: 5000,
      height: 3750,
      focus: '55% 45%',
    },
  } satisfies Record<string, ImageAsset>,
} as const

export const hasWhatsApp = () => /^\d{10,15}$/.test(site.contact.whatsapp)
