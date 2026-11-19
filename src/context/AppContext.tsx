import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ServiceId } from '../content/services'
import { scrollToSection } from '../lib/scroll'

type AppState = {
  /** serviço pré-selecionado para o fluxo de agendamento */
  bookingService: ServiceId | ''
  /** incrementa a cada pedido de agendamento, para o formulário reagir */
  bookingRequest: number
  requestBooking: (service?: ServiceId) => void
  openService: ServiceId | null
  setOpenService: (id: ServiceId | null) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookingService, setBookingService] = useState<ServiceId | ''>('')
  const [bookingRequest, setBookingRequest] = useState(0)
  const [openService, setOpenService] = useState<ServiceId | null>(null)

  const requestBooking = useCallback((service?: ServiceId) => {
    if (service) setBookingService(service)
    setBookingRequest((n) => n + 1)
    setOpenService(null)
    // aguarda o fechamento de modais antes de rolar
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection('agendar')))
  }, [])

  const value = useMemo(
    () => ({ bookingService, bookingRequest, requestBooking, openService, setOpenService }),
    [bookingService, bookingRequest, requestBooking, openService],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp fora do AppProvider')
  return v
}
