import type { ImageAsset } from '../config/site'

export type ServiceId =
  | 'diagnostico'
  | 'revisao'
  | 'freios-suspensao'
  | 'motor-transmissao'
  | 'oleo-filtros'
  | 'ar-condicionado'

export type Service = {
  id: ServiceId
  index: string
  name: string
  category: string
  short: string
  description: string
  checks: string[]
  benefits: string[]
  image?: ImageAsset
}

export const services: Service[] = [
  {
    id: 'diagnostico',
    index: '01',
    name: 'Diagnóstico eletrônico',
    category: 'Eletrônica embarcada',
    short: 'Leitura dos módulos do veículo com scanner para orientar a inspeção.',
    description:
      'O scanner se comunica com as centrais eletrônicas do carro e mostra códigos de falha, parâmetros em tempo real e alertas registrados. A leitura orienta a inspeção física: ela não substitui a avaliação do técnico, que confirma a origem do problema antes de qualquer proposta.',
    checks: [
      'Leitura de códigos de falha armazenados e pendentes',
      'Parâmetros de sensores com o motor em funcionamento',
      'Luzes de alerta do painel e histórico de eventos',
      'Conferência física dos componentes apontados',
    ],
    benefits: [
      'Ponto de partida objetivo para a avaliação',
      'Evita trocas de peças por tentativa',
      'Relatório explicado em linguagem clara',
    ],
    image: {
      unsplashId: '1632733711679-529326f6db12',
      alt: 'Técnico verificando a caixa de fusíveis com ferramenta de teste no cofre do motor',
      credit: 'Maxim Hopman',
      creditUrl: 'https://unsplash.com/photos/s4d_ESS0ylA',
      width: 5472,
      height: 3648,
      focus: '45% 50%',
    },
  },
  {
    id: 'revisao',
    index: '02',
    name: 'Revisão preventiva',
    category: 'Manutenção programada',
    short: 'Inspeção por etapas conforme a quilometragem e o uso do veículo.',
    description:
      'Uma revisão organizada por checklist, considerando o plano de manutenção do fabricante e a forma como o carro é usado no dia a dia. O objetivo é identificar desgastes antes que virem uma parada inesperada.',
    checks: [
      'Fluidos: óleo, arrefecimento, freio e direção',
      'Correias, mangueiras e vedações visíveis',
      'Freios, pneus e componentes de suspensão',
      'Iluminação, bateria e itens de segurança',
    ],
    benefits: [
      'Previsibilidade de custos e de manutenção',
      'Registro descritivo do que foi verificado',
      'Orientação sobre os próximos cuidados',
    ],
    image: {
      unsplashId: '1625047509248-ec889cbff17f',
      alt: 'Mecânico de uniforme cinza inspecionando o motor de um carro com o capô aberto',
      credit: 'Kate Ibragimova',
      creditUrl: 'https://unsplash.com/photos/bEGTsOCnHro',
      width: 6000,
      height: 3376,
      focus: '50% 40%',
    },
  },
  {
    id: 'freios-suspensao',
    index: '03',
    name: 'Freios e suspensão',
    category: 'Segurança e estabilidade',
    short: 'Pastilhas, discos, amortecedores e articulações sob medição.',
    description:
      'Avaliação do sistema de frenagem e do conjunto de suspensão, com medição de espessura de pastilhas e discos e verificação de folgas. Ruídos, vibrações e puxadas para um lado são sinais que merecem inspeção.',
    checks: [
      'Espessura de pastilhas, lonas e discos',
      'Fluido de freio e condição das mangueiras',
      'Amortecedores, molas, buchas e pivôs',
      'Folgas em terminais e barras de direção',
    ],
    benefits: ['Frenagem mais previsível', 'Desgaste uniforme dos pneus', 'Mais conforto e estabilidade'],
    image: {
      unsplashId: '1645445522156-9ac06bc7a767',
      alt: 'Mãos com luvas segurando a roda e o pneu de um carro suspenso no elevador',
      credit: 'Jimmy Nilsson Masth',
      creditUrl: 'https://unsplash.com/photos/9uHal2Dd9aE',
      width: 6000,
      height: 4000,
      focus: '55% 50%',
    },
  },
  {
    id: 'motor-transmissao',
    index: '04',
    name: 'Motor e transmissão',
    category: 'Trem de força',
    short: 'Do sistema de correias ao câmbio, com atenção a ruídos e vazamentos.',
    description:
      'Inspeção dos componentes que geram e transmitem força: correias e tensores, sistema de ignição e alimentação, embreagem e câmbio. Perda de força, trancos e ruídos novos são bons motivos para uma avaliação.',
    checks: [
      'Correias, polias e tensores',
      'Ignição, alimentação e admissão',
      'Vazamentos de óleo e de arrefecimento',
      'Embreagem, trocas de marcha e fluido do câmbio',
    ],
    benefits: [
      'Funcionamento mais suave',
      'Identificação precoce de vazamentos',
      'Proposta de reparo detalhada antes da execução',
    ],
    image: {
      unsplashId: '1486262715619-67b85e0b08d3',
      alt: 'Detalhe do sistema de correias e polias na frente de um motor',
      credit: 'Chad Kirchoff',
      creditUrl: 'https://unsplash.com/photos/xe-e69j6-Ds',
      width: 5472,
      height: 3078,
      focus: '45% 50%',
    },
  },
  {
    id: 'oleo-filtros',
    index: '05',
    name: 'Troca de óleo e filtros',
    category: 'Lubrificação',
    short: 'Óleo na especificação do fabricante e filtros substituídos.',
    description:
      'Troca do óleo do motor seguindo a especificação indicada no manual do veículo, com substituição dos filtros correspondentes. Aproveitamos para conferir o nível dos demais fluidos e sinais de vazamento.',
    checks: [
      'Especificação e volume de óleo indicados pelo fabricante',
      'Filtros de óleo, ar, combustível e cabine',
      'Bujão e vedação do cárter',
      'Nível dos demais fluidos',
    ],
    benefits: [
      'Proteção para os componentes internos do motor',
      'Ar mais limpo dentro da cabine',
      'Registro da troca com quilometragem',
    ],
    image: {
      unsplashId: '1487754180451-c456f719a1fc',
      alt: 'Mecânico despejando óleo novo no motor com auxílio de um funil',
      credit: 'Tim Mossholder',
      creditUrl: 'https://unsplash.com/photos/V37iTrYZz2E',
      width: 4928,
      height: 3264,
      focus: '60% 40%',
    },
  },
  {
    id: 'ar-condicionado',
    index: '06',
    name: 'Ar-condicionado automotivo',
    category: 'Climatização',
    short: 'Rendimento, higienização e verificação de componentes do sistema.',
    description:
      'Avaliação do sistema de climatização: temperatura de saída, funcionamento do compressor, condição do filtro de cabine e higienização dos dutos. Cheiro desagradável ou ar pouco frio indicam que vale verificar.',
    checks: [
      'Temperatura do ar nas saídas',
      'Acionamento do compressor e do eletroventilador',
      'Filtro de cabine e condição do evaporador',
      'Pressões de trabalho e possíveis vazamentos',
    ],
    benefits: ['Conforto térmico nos dias quentes', 'Ar com menos odores e impurezas', 'Desembaçamento mais eficiente'],
  },
]

export const serviceById = (id: ServiceId) => services.find((s) => s.id === id)!
