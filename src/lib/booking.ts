import { services, type ServiceId } from '../content/services'

export type Period = 'manha' | 'tarde'

export type BookingData = {
  service: ServiceId | ''
  brand: string
  model: string
  year: string
  plate: string
  name: string
  phone: string
  date: string
  period: Period | ''
  notes: string
}

export const emptyBooking: BookingData = {
  service: '',
  brand: '',
  model: '',
  year: '',
  plate: '',
  name: '',
  phone: '',
  date: '',
  period: '',
  notes: '',
}

export const periodLabel: Record<Period, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
}

export type Errors = Partial<Record<keyof BookingData, string>>

export const onlyDigits = (v: string) => v.replace(/\D/g, '')

/** Formata telefone brasileiro: (11) 91234-5678 ou (11) 1234-5678 */
export function formatPhone(raw: string): string {
  const d = onlyDigits(raw).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function normalizePlate(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
}

/** Aceita padrão antigo (ABC1234) e Mercosul (ABC1D23) */
export const isValidPlate = (p: string) => /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(normalizePlate(p))

export function todayISO(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

export function validateStep(step: number, data: BookingData, now = new Date()): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!data.service) e.service = 'Selecione o serviço que deseja solicitar.'
  }
  if (step === 1) {
    if (data.brand.trim().length < 2) e.brand = 'Informe a marca do veículo.'
    if (data.model.trim().length < 1) e.model = 'Informe o modelo do veículo.'
    const year = Number(data.year)
    const max = now.getFullYear() + 1
    if (!data.year) e.year = 'Informe o ano do veículo.'
    else if (!/^\d{4}$/.test(data.year) || year < 1950 || year > max)
      e.year = `Use um ano entre 1950 e ${max}.`
    if (data.plate.trim() && !isValidPlate(data.plate))
      e.plate = 'Placa em formato inválido. Use ABC1234 ou ABC1D23, ou deixe em branco.'
  }
  if (step === 2) {
    if (data.name.trim().length < 2) e.name = 'Informe como podemos chamar você.'
    const digits = onlyDigits(data.phone)
    if (!digits) e.phone = 'Informe um telefone para contato.'
    else if (digits.length < 10 || digits.length > 11) e.phone = 'Telefone incompleto. Inclua o DDD, por exemplo (11) 91234-5678.'
    if (!data.date) e.date = 'Escolha uma data de preferência.'
    else if (data.date < todayISO(now)) e.date = 'Escolha uma data a partir de hoje.'
    if (!data.period) e.period = 'Escolha o período de preferência.'
    if (data.notes.length > 500) e.notes = 'Use no máximo 500 caracteres.'
  }
  return e
}

export function buildMessage(data: BookingData): string {
  const service = services.find((s) => s.id === data.service)
  const lines = [
    'Olá! Gostaria de solicitar uma avaliação para meu veículo.',
    '',
    `Serviço: ${service?.name ?? '-'}.`,
    `Veículo: ${[data.brand.trim(), data.model.trim()].filter(Boolean).join(' ')}.`,
    `Ano: ${data.year}.`,
  ]
  if (data.plate.trim()) lines.push(`Placa: ${normalizePlate(data.plate)}.`)
  lines.push(`Data preferida: ${formatDateBR(data.date)}.`)
  if (data.period) lines.push(`Período: ${periodLabel[data.period]}.`)
  lines.push(`Nome: ${data.name.trim()}.`)
  lines.push(`Telefone: ${formatPhone(data.phone)}.`)
  if (data.notes.trim()) lines.push('', `Observações: ${data.notes.trim()}`)
  lines.push('', 'Aguardo a confirmação de disponibilidade.')
  return lines.join('\n')
}

export function whatsappUrl(number: string, message: string): string {
  return `https://wa.me/${onlyDigits(number)}?text=${encodeURIComponent(message)}`
}
