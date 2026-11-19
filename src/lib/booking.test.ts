import { describe, expect, it } from 'vitest'
import {
  buildMessage,
  emptyBooking,
  formatPhone,
  isValidPlate,
  validateStep,
  whatsappUrl,
  type BookingData,
} from './booking'

const now = new Date(2026, 10, 18)

const filled: BookingData = {
  ...emptyBooking,
  service: 'revisao',
  brand: 'Marca',
  model: 'Modelo X',
  year: '2019',
  plate: 'abc-1d23',
  name: 'Ana',
  phone: '11912345678',
  date: '2026-11-25',
  period: 'manha',
  notes: '',
}

describe('booking validation', () => {
  it('requires a service on step 0', () => {
    expect(validateStep(0, emptyBooking, now).service).toBeTruthy()
    expect(validateStep(0, filled, now)).toEqual({})
  })

  it('validates vehicle fields and optional plate', () => {
    expect(validateStep(1, filled, now)).toEqual({})
    expect(validateStep(1, { ...filled, plate: '' }, now)).toEqual({})
    expect(validateStep(1, { ...filled, plate: 'XX' }, now).plate).toBeTruthy()
    expect(validateStep(1, { ...filled, year: '1800' }, now).year).toBeTruthy()
    expect(validateStep(1, { ...filled, year: '2028' }, now).year).toBeTruthy()
  })

  it('validates contact fields', () => {
    expect(validateStep(2, filled, now)).toEqual({})
    const e = validateStep(2, { ...filled, phone: '1199', date: '2026-11-01', period: '' }, now)
    expect(e.phone).toBeTruthy()
    expect(e.date).toBeTruthy()
    expect(e.period).toBeTruthy()
  })
})

describe('formatters', () => {
  it('formats phones', () => {
    expect(formatPhone('11912345678')).toBe('(11) 91234-5678')
    expect(formatPhone('1132345678')).toBe('(11) 3234-5678')
  })
  it('accepts old and Mercosul plates', () => {
    expect(isValidPlate('ABC1234')).toBe(true)
    expect(isValidPlate('abc1d23')).toBe(true)
    expect(isValidPlate('AB12345')).toBe(false)
  })
})

describe('message', () => {
  it('builds a structured message without confirming the booking', () => {
    const msg = buildMessage(filled)
    expect(msg).toContain('Serviço: Revisão preventiva.')
    expect(msg).toContain('Veículo: Marca Modelo X.')
    expect(msg).toContain('Ano: 2019.')
    expect(msg).toContain('Placa: ABC1D23.')
    expect(msg).toContain('Data preferida: 25/11/2026.')
    expect(msg).toContain('Período: Manhã.')
    expect(msg).not.toMatch(/confirmado/i)
  })
  it('encodes the WhatsApp URL', () => {
    expect(whatsappUrl('+55 (11) 99999-0000', 'a b')).toBe('https://wa.me/5511999990000?text=a%20b')
  })
})
