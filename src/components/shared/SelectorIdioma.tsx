import { useTranslation } from 'react-i18next'
import i18n, { IDIOMAS, type Idioma } from '@/lib/i18n'

/** Selector de idioma (A16 a): dos segmentos ES/EN; el activo sale de `resolvedLanguage`. */
export function SelectorIdioma() {
  const { t } = useTranslation()
  const actual = i18n.resolvedLanguage

  function elegir(codigo: Idioma) {
    void i18n.changeLanguage(codigo).catch((error: unknown) => {
      console.error('i18n: no se pudo cambiar el idioma', error)
    })
  }

  return (
    <div
      role="group"
      aria-label={t('ajustes.idioma.etiqueta')}
      className="inline-flex items-center gap-0.5 rounded-pill border border-border bg-surface-1 p-0.5"
    >
      {IDIOMAS.map((codigo) => {
        const activo = actual === codigo
        const etiqueta = t(`ajustes.idioma.${codigo}`)
        return (
          <button
            key={codigo}
            type="button"
            lang={codigo}
            aria-pressed={activo}
            aria-label={etiqueta}
            title={etiqueta}
            onClick={() => elegir(codigo)}
            className={`inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-pill px-3 text-sm font-extrabold transition-colors motion-reduce:transition-none ${
              activo
                ? 'bg-primary text-on-primary'
                : 'bg-transparent text-ink-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            {codigo.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
