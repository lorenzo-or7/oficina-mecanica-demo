import type { ServiceId } from './services'

export type SystemId = 'motor' | 'freios' | 'suspensao' | 'pneus' | 'ar' | 'eletrico'

export type VehicleSystem = {
  id: SystemId
  name: string
  /** posição do marcador sobre a ilustração (% da largura / altura do viewBox 1000×420) */
  x: number
  y: number
  summary: string
  symptoms: string[]
  checks: string[]
  service: ServiceId
}

export const systems: VehicleSystem[] = [
  {
    id: 'motor',
    name: 'Motor',
    x: 15.7,
    y: 60.5,
    summary: 'Gera a força do veículo e depende de lubrificação, arrefecimento e ignição em bom estado.',
    symptoms: [
      'Perda de força em subidas ou retomadas pode indicar necessidade de avaliação',
      'Luz de injeção acesa no painel merece leitura eletrônica',
      'Fumaça incomum no escapamento',
      'Marcha lenta irregular ou trepidação',
    ],
    checks: ['Leitura eletrônica dos módulos', 'Ignição e alimentação', 'Vazamentos e nível de fluidos', 'Correias e tensores'],
    service: 'motor-transmissao',
  },
  {
    id: 'freios',
    name: 'Freios',
    x: 23,
    y: 75.7,
    summary: 'Pastilhas, discos e fluido trabalham juntos para reduzir a velocidade com controle.',
    symptoms: [
      'Ruídos durante a frenagem podem indicar necessidade de inspeção',
      'Pedal mais baixo ou “borrachudo”',
      'Vibração no volante ao frear',
      'Carro puxando para um lado na frenagem',
    ],
    checks: ['Espessura de pastilhas e discos', 'Condição do fluido de freio', 'Mangueiras e pinças', 'Teste de frenagem'],
    service: 'freios-suspensao',
  },
  {
    id: 'ar',
    name: 'Ar-condicionado',
    x: 34.5,
    y: 51,
    summary: 'Mantém a cabine confortável e ajuda a desembaçar os vidros com segurança.',
    symptoms: [
      'Ar saindo pouco frio',
      'Cheiro desagradável ao ligar o sistema',
      'Ruído ao acionar o compressor',
      'Vidros demorando a desembaçar',
    ],
    checks: ['Temperatura nas saídas', 'Filtro de cabine', 'Funcionamento do compressor', 'Pressões e possíveis vazamentos'],
    service: 'ar-condicionado',
  },
  {
    id: 'eletrico',
    name: 'Sistema elétrico',
    x: 57,
    y: 70.5,
    summary: 'Bateria, alternador e chicotes alimentam a partida, a iluminação e os módulos eletrônicos.',
    symptoms: [
      'Partida difícil, principalmente pela manhã',
      'Luzes do painel oscilando',
      'Alertas eletrônicos intermitentes',
      'Acessórios falhando sem motivo aparente',
    ],
    checks: ['Teste de bateria e de carga', 'Alternador e motor de partida', 'Fusíveis e conectores', 'Leitura dos módulos eletrônicos'],
    service: 'diagnostico',
  },
  {
    id: 'suspensao',
    name: 'Suspensão',
    x: 77,
    y: 60,
    summary: 'Mantém os pneus em contato com o solo e absorve as irregularidades do caminho.',
    symptoms: [
      'Batidas secas em lombadas e buracos',
      'Carro balançando além do normal após ondulações',
      'Desgaste irregular dos pneus',
      'Volante desalinhado em linha reta',
    ],
    checks: ['Amortecedores e molas', 'Buchas, pivôs e bieletas', 'Folgas na direção', 'Geometria e alinhamento'],
    service: 'freios-suspensao',
  },
  {
    id: 'pneus',
    name: 'Pneus',
    x: 82.6,
    y: 81.5,
    summary: 'Único ponto de contato com o solo: influenciam frenagem, estabilidade e consumo.',
    symptoms: [
      'Desgaste maior em uma das bordas',
      'Vibração em velocidades constantes',
      'Perda frequente de pressão',
      'Bolhas ou cortes na lateral',
    ],
    checks: ['Profundidade dos sulcos', 'Pressão e condição das laterais', 'Balanceamento', 'Alinhamento e rodízio'],
    service: 'revisao',
  },
]
