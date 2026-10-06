import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { cambiarTema, leerTema, type Tema } from '@/lib/tema'

const OPCIONES: readonly { tema: Tema; Icono: LucideIcon }[] = [
  { tema: 'claro', Icono: Sun },
  { tema: 'oscuro', Icono: Moon },
  { tema: 'sistema', Icono: Monitor },
]

/** Selector de tema (A16 b): tres segmentos solo icono; `sistema` quita `data-theme`. */
export function SelectorTema() {
  const { t } = useTranslation()
  const [actual, setActual] = useState<Tema>(leerTema)

  function elegir(tema: Tema) {
    cambiarTema(tema)
    setActual(tema)
  }

  return (
    <div
      role="group"
      aria-label={t('ajustes.tema.etiqueta')}
      className="inline-flex items-center gap-0.5 rounded-pill border border-border bg-surface-1 p-0.5"
    >
      {OPCIONES.map(({ tema, Icono }) => {
        const activo = actual === tema
        const etiqueta = t(`ajustes.tema.${tema}`)
        return (
          <button
            key={tema}
            type="button"
            aria-pressed={activo}
            aria-label={etiqueta}
            title={etiqueta}
            onClick={() => elegir(tema)}
            className={`inline-flex size-14 cursor-pointer items-center justify-center rounded-pill transition-colors motion-reduce:transition-none ${
              activo
                ? 'bg-primary text-on-primary'
                : 'bg-transparent text-ink-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icono size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
