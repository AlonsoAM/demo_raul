import { Sprout } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SelectorIdioma } from '@/components/shared/SelectorIdioma'
import { SelectorTema } from '@/components/shared/SelectorTema'

/**
 * Encabezado de la app (AF-6): marca a la izquierda; selectores de idioma y tema
 * a la derecha, visibles en ingreso y bienvenida. El nombre se oculta bajo 480px (A14).
 */
export function EncabezadoApp() {
  const { t } = useTranslation()

  return (
    <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 flex-none place-items-center rounded-md bg-primary text-on-primary shadow-button"
        >
          <Sprout className="size-6" />
        </span>
        <span className="hidden whitespace-nowrap text-lg font-extrabold min-[480px]:block">
          {t('marca.nombre')}
          <small className="block text-[13px] font-bold leading-[1.1] text-ink-muted">
            {t('marca.subtitulo')}
          </small>
        </span>
      </div>
      <div className="flex flex-none items-center gap-2">
        <SelectorIdioma />
        <SelectorTema />
      </div>
    </header>
  )
}
