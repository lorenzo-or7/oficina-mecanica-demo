import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Pencil, RotateCcw } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { hasWhatsApp, site } from '../../config/site'
import { services } from '../../content/services'
import { useApp } from '../../context/AppContext'
import {
  buildMessage,
  emptyBooking,
  formatDateBR,
  formatPhone,
  normalizePlate,
  periodLabel,
  todayISO,
  validateStep,
  whatsappUrl,
  type BookingData,
  type Errors,
  type Period,
} from '../../lib/booking'
import { Button, ButtonLink } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'

const steps = ['Serviço', 'Veículo', 'Contato', 'Revisão']

function Field({
  label,
  hint,
  error,
  optional,
  children,
  id,
}: {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: ReactNode
  id: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-semibold">
        {label}
        {optional && (
          <span className="tech font-normal text-muted">
            <span className="sr-only">(</span>Opcional<span className="sr-only">)</span>
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Booking() {
  const { bookingService, bookingRequest } = useApp()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<BookingData>(emptyBooking)
  const [errors, setErrors] = useState<Errors>({})
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [dir, setDir] = useState(1)
  const reduce = useReducedMotion()
  const uid = useId()
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const prevStep = useRef(0)
  const pendingFocus = useRef(false)

  // um serviço escolhido em outra seção chega pré-selecionado
  useEffect(() => {
    if (!bookingRequest) return
    if (bookingService) {
      setData((d) => ({ ...d, service: bookingService }))
      setErrors({})
      setStep((s) => (s === 0 ? 1 : s))
    }
  }, [bookingRequest, bookingService])

  // move o foco para o título da etapa só quando a etapa muda (não no carregamento)
  useEffect(() => {
    if (prevStep.current === step) return
    prevStep.current = step
    pendingFocus.current = true
    const form = stepHeading.current?.closest('form')
    if (form && form.getBoundingClientRect().top < 0) form.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
  }, [step, reduce])

  // chamado quando a etapa anterior termina de sair: o novo título já está montado
  const onStepShown = () => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    stepHeading.current?.focus({ preventScroll: true })
  }

  const set = <K extends keyof BookingData>(k: K, v: BookingData[K]) => {
    setData((d) => ({ ...d, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const next = () => {
    const e = validateStep(step, data)
    setErrors(e)
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0]
      requestAnimationFrame(() => document.getElementById(`${uid}-${first}`)?.focus())
      return
    }
    setDir(1)
    setStep((s) => Math.min(3, s + 1))
  }
  const back = () => {
    setDir(-1)
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }
  const goTo = (s: number) => {
    setDir(s > step ? 1 : -1)
    setStep(s)
  }
  const reset = () => {
    setData(emptyBooking)
    setErrors({})
    setCopied('idle')
    setDir(-1)
    setStep(0)
  }

  const message = step === 3 ? buildMessage(data) : ''
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    setTimeout(() => setCopied('idle'), 3500)
  }

  const fid = (k: keyof BookingData) => `${uid}-${k}`
  const aria = (k: keyof BookingData, hint = false) => ({
    id: fid(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${fid(k)}-error` : hint ? `${fid(k)}-hint` : undefined,
  })

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -28 }),
  }

  return (
    <section id="agendar" aria-labelledby="agendar-title" className="relative border-t border-line bg-surface/40 py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          id="agendar"
          code="Agendamento"
          label="Solicitação online"
          title={['Solicite sua', 'avaliação.']}
          intro={
            <p className="text-lg leading-relaxed">
              Quatro etapas rápidas para montar o pedido. Ao final, você revisa a mensagem e envia pelo WhatsApp. A oficina responde
              confirmando a disponibilidade.
            </p>
          }
        />

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* progresso */}
          <aside className="lg:col-span-3">
            <ol className="grid grid-cols-4 gap-2 lg:flex lg:flex-col lg:gap-0" aria-label="Etapas do agendamento">
              {steps.map((label, i) => {
                const done = i < step
                const current = i === step
                return (
                  <li key={label} className="relative lg:pb-6 lg:last:pb-0">
                    {i < steps.length - 1 && (
                      <span aria-hidden className="absolute top-9 bottom-0 left-[17px] hidden w-px bg-line lg:block">
                        <motion.span
                          className="block h-full w-full origin-top bg-accent"
                          initial={false}
                          animate={{ scaleY: done ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={!done}
                      onClick={() => goTo(i)}
                      aria-current={current ? 'step' : undefined}
                      className="flex w-full flex-col items-start gap-2 text-left disabled:cursor-default lg:flex-row lg:items-center lg:gap-4"
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 font-mono text-sm transition-colors duration-300 ${
                          current
                            ? 'border-accent text-accent-ink'
                            : done
                              ? 'border-accent bg-accent text-on-accent'
                              : 'border-line-strong text-muted'
                        }`}
                      >
                        {done ? <Check size={16} aria-hidden /> : i + 1}
                      </span>
                      <span className={`text-xs font-semibold sm:text-sm ${current ? 'text-fg' : 'text-muted'}`}>
                        {label}
                        <span className="sr-only">{done ? ' (concluída, voltar para editar)' : current ? ' (etapa atual)' : ''}</span>
                      </span>
                    </button>
                    <span aria-hidden className="mt-2 block h-[3px] overflow-hidden rounded-full bg-line lg:hidden">
                      <motion.span
                        className="block h-full bg-accent"
                        initial={false}
                        animate={{ width: done || current ? '100%' : '0%' }}
                        transition={{ duration: 0.4 }}
                      />
                    </span>
                  </li>
                )
              })}
            </ol>
            <p className="tech mt-8 hidden text-muted lg:block">
              Nada é enviado ou armazenado por este site. Os dados servem apenas para montar a sua mensagem.
            </p>
          </aside>

          {/* formulário */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              if (step < 3) next()
            }}
            className="relative overflow-hidden rounded-[12px] border border-line bg-bg lg:col-span-9"
          >
            <div aria-hidden className="ruler opacity-60" />
            <AnimatePresence mode="wait" custom={dir} initial={false} onExitComplete={onStepShown}>
              <motion.fieldset
                key={step}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[26rem] min-w-0 flex-col gap-7 p-5 sm:p-8 lg:p-10"
              >
                <legend className="sr-only">
                  Etapa {step + 1} de 4: {steps[step]}
                </legend>
                <header className="flex items-end justify-between gap-4">
                  <h3 ref={stepHeading} tabIndex={-1} className="display text-4xl font-bold uppercase sm:text-5xl">
                    {['Qual serviço?', 'Seu veículo', 'Contato e preferência', 'Revise o pedido'][step]}
                  </h3>
                  <span className="tech shrink-0 text-muted">Etapa {step + 1} de 4</span>
                </header>

                {step === 0 && (
                  <div role="radiogroup" aria-label="Serviço" aria-describedby={errors.service ? `${fid('service')}-error` : undefined}>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {services.map((s, i) => {
                        const on = data.service === s.id
                        return (
                          <label
                            key={s.id}
                            className={`group relative flex min-h-16 cursor-pointer items-center gap-4 rounded-[8px] border px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                              on ? 'border-accent bg-elevated' : 'border-line hover:border-line-strong'
                            }`}
                          >
                            <input
                              type="radio"
                              name="service"
                              value={s.id}
                              checked={on}
                              onChange={() => set('service', s.id)}
                              className="sr-only"
                              id={i === 0 ? fid('service') : undefined}
                            />
                            <span
                              aria-hidden
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                                on ? 'border-accent' : 'border-line-strong'
                              }`}
                            >
                              <motion.span
                                className="h-2.5 w-2.5 rounded-full bg-accent"
                                initial={false}
                                animate={{ scale: on ? 1 : 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              />
                            </span>
                            <span className="flex flex-col">
                              <span className="font-semibold">{s.name}</span>
                              <span className="text-xs text-muted">{s.category}</span>
                            </span>
                          </label>
                        )
                      })}
                    </div>
                    {errors.service && (
                      <p id={`${fid('service')}-error`} role="alert" className="mt-3 text-sm font-medium text-danger">
                        {errors.service}
                      </p>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id={fid('brand')} label="Marca" error={errors.brand}>
                      <input
                        {...aria('brand')}
                        className="field"
                        value={data.brand}
                        onChange={(e) => set('brand', e.target.value)}
                        autoComplete="off"
                        maxLength={40}
                        placeholder="Ex.: a marca do seu carro"
                      />
                    </Field>
                    <Field id={fid('model')} label="Modelo" error={errors.model}>
                      <input
                        {...aria('model')}
                        className="field"
                        value={data.model}
                        onChange={(e) => set('model', e.target.value)}
                        autoComplete="off"
                        maxLength={60}
                        placeholder="Ex.: modelo e versão"
                      />
                    </Field>
                    <Field id={fid('year')} label="Ano" error={errors.year}>
                      <input
                        {...aria('year')}
                        className="field"
                        inputMode="numeric"
                        value={data.year}
                        onChange={(e) => set('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="Ex.: 2019"
                      />
                    </Field>
                    <Field id={fid('plate')} label="Placa" optional hint="Ajuda a oficina a identificar o veículo." error={errors.plate}>
                      <input
                        {...aria('plate', true)}
                        className="field font-mono uppercase"
                        value={data.plate}
                        onChange={(e) => set('plate', normalizePlate(e.target.value))}
                        autoComplete="off"
                        placeholder="ABC1D23"
                      />
                    </Field>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id={fid('name')} label="Nome" error={errors.name}>
                      <input
                        {...aria('name')}
                        className="field"
                        value={data.name}
                        onChange={(e) => set('name', e.target.value)}
                        autoComplete="name"
                        maxLength={80}
                      />
                    </Field>
                    <Field id={fid('phone')} label="Telefone com DDD" error={errors.phone}>
                      <input
                        {...aria('phone')}
                        className="field"
                        type="tel"
                        inputMode="tel"
                        value={data.phone}
                        onChange={(e) => set('phone', formatPhone(e.target.value))}
                        autoComplete="tel-national"
                        placeholder="(00) 00000-0000"
                      />
                    </Field>
                    <Field id={fid('date')} label="Data preferida" hint="Sujeita à confirmação da oficina." error={errors.date}>
                      <input
                        {...aria('date', true)}
                        className="field"
                        type="date"
                        min={todayISO()}
                        value={data.date}
                        onChange={(e) => set('date', e.target.value)}
                      />
                    </Field>
                    <div className="flex flex-col gap-1.5">
                      <span id={`${fid('period')}-label`} className="text-sm font-semibold">
                        Período preferido
                      </span>
                      <div
                        role="radiogroup"
                        aria-labelledby={`${fid('period')}-label`}
                        aria-describedby={errors.period ? `${fid('period')}-error` : undefined}
                        className="grid grid-cols-2 gap-2"
                      >
                        {(Object.keys(periodLabel) as Period[]).map((p, i) => (
                          <label
                            key={p}
                            className={`flex min-h-12 cursor-pointer items-center justify-center rounded-[6px] border text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                              data.period === p ? 'border-accent bg-elevated text-fg' : 'border-line-strong text-muted hover:text-fg'
                            }`}
                          >
                            <input
                              type="radio"
                              name="period"
                              className="sr-only"
                              value={p}
                              checked={data.period === p}
                              onChange={() => set('period', p)}
                              id={i === 0 ? fid('period') : undefined}
                            />
                            {periodLabel[p]}
                          </label>
                        ))}
                      </div>
                      {errors.period && (
                        <p id={`${fid('period')}-error`} role="alert" className="text-sm font-medium text-danger">
                          {errors.period}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Field id={fid('notes')} label="Observações" optional error={errors.notes} hint={`${data.notes.length}/500 caracteres`}>
                        <textarea
                          {...aria('notes', true)}
                          className="field min-h-28 resize-y"
                          value={data.notes}
                          maxLength={500}
                          onChange={(e) => set('notes', e.target.value)}
                          placeholder="Conte o que você percebeu: ruídos, luzes no painel, quando acontece…"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-6 xl:grid-cols-2">
                    <dl className="grid content-start gap-px self-start overflow-hidden rounded-[8px] border border-line bg-line">
                      {[
                        ['Serviço', services.find((s) => s.id === data.service)?.name, 0],
                        ['Veículo', `${data.brand} ${data.model}, ${data.year}`, 1],
                        ['Placa', data.plate ? normalizePlate(data.plate) : 'Não informada', 1],
                        ['Contato', `${data.name}, ${formatPhone(data.phone)}`, 2],
                        ['Preferência', `${formatDateBR(data.date)}, ${data.period ? periodLabel[data.period] : ''}`, 2],
                      ].map(([k, v, s]) => (
                        <div key={k as string} className="flex items-center justify-between gap-4 bg-surface px-4 py-3">
                          <div className="min-w-0">
                            <dt className="tech text-muted">{k}</dt>
                            <dd className="truncate font-semibold">{v}</dd>
                          </div>
                          <button
                            type="button"
                            onClick={() => goTo(s as number)}
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] text-muted hover:bg-elevated hover:text-fg"
                            aria-label={`Editar ${String(k).toLowerCase()}`}
                          >
                            <Pencil size={16} aria-hidden />
                          </button>
                        </div>
                      ))}
                    </dl>

                    <div className="flex flex-col gap-3">
                      <p className="tech text-muted" id={`${uid}-preview-label`}>
                        Prévia da mensagem
                      </p>
                      <pre
                        aria-labelledby={`${uid}-preview-label`}
                        className="max-h-80 overflow-auto rounded-[8px] border border-line bg-surface p-4 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap"
                      >
                        {message}
                      </pre>
                      <p className="rounded-[6px] border border-line-strong px-3 py-2.5 text-sm text-muted">
                        Esta é uma <strong className="text-fg">solicitação</strong>. O atendimento só fica confirmado depois da
                        resposta da oficina.
                      </p>
                    </div>
                  </div>
                )}

                {/* ações */}
                <div className="mt-auto flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? (
                    <Button variant="ghost" onClick={back} icon={undefined}>
                      <span className="inline-flex items-center gap-2">
                        <ArrowLeft size={17} aria-hidden /> Voltar
                      </span>
                    </Button>
                  ) : (
                    <span className="tech text-muted">Leva cerca de um minuto.</span>
                  )}

                  {step < 3 ? (
                    <Button type="submit" size="lg" icon={<ArrowRight size={18} />}>
                      Continuar
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <Button variant="ghost" onClick={reset} icon={<RotateCcw size={16} />}>
                        Nova solicitação
                      </Button>
                      <Button variant={hasWhatsApp() ? 'secondary' : 'primary'} size="lg" onClick={copy} icon={copied === 'ok' ? <Check size={18} /> : <Copy size={18} />}>
                        {copied === 'ok' ? 'Mensagem copiada' : 'Copiar mensagem'}
                      </Button>
                      {hasWhatsApp() && (
                        <ButtonLink
                          size="lg"
                          href={whatsappUrl(site.contact.whatsapp, message)}
                          target="_blank"
                          rel="noopener noreferrer"
                          icon={<ExternalLink size={18} />}
                        >
                          Enviar pelo WhatsApp
                        </ButtonLink>
                      )}
                    </div>
                  )}
                </div>
                <p aria-live="polite" className="sr-only">
                  {copied === 'ok' ? 'Mensagem copiada para a área de transferência.' : copied === 'fail' ? 'Não foi possível copiar.' : ''}
                </p>
                {step === 3 && copied === 'fail' && (
                  <p className="text-sm text-danger">
                    O navegador bloqueou a cópia automática. Selecione o texto da prévia e copie manualmente.
                  </p>
                )}
                {step === 3 && !hasWhatsApp() && (
                  <p className="tech text-muted">
                    Modo demonstração: nenhum número de WhatsApp está configurado. Copie a mensagem para ver o resultado.
                  </p>
                )}
              </motion.fieldset>
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
