import { useEffect, useRef, type ReactNode } from 'react'
import { CircleCheck, Info, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconoGithub } from '@/components/shared/IconoGithub'
import { IconoGoogle } from '@/components/shared/IconoGoogle'
import { IconoMicrosoft } from '@/components/shared/IconoMicrosoft'
import { TarjetaAcceso } from '@/components/shared/TarjetaAcceso'
import { Button } from '@/components/ui/button'
import { obtenerIniciales } from '@/lib/iniciales'
import type { UsuarioSesion, ViaIngreso } from '../types/autenticacion.types'

const ICONO_VIA: Record<ViaIngreso, ReactNode> = {
  correo: <CircleCheck className="size-[18px]" aria-hidden="true" />,
  google: <IconoGoogle className="size-[18px]" />,
  github: <IconoGithub className="size-[18px]" />,
  microsoft: <IconoMicrosoft className="size-[18px]" />,
}

interface TarjetaBienvenidaProps {
  usuario: UsuarioSesion
  onCerrarSesion: () => void
}

/** Pantalla de bienvenida: vía de ingreso, identidad del usuario y cierre de sesión (H3). */
export function TarjetaBienvenida({ usuario, onCerrarSesion }: TarjetaBienvenidaProps) {
  const { t } = useTranslation()
  const titulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titulo.current?.focus()
  }, [])

  const { nombre, correo, via } = usuario

  return (
    <TarjetaAcceso aria-labelledby="titulo-bienvenida">
      <span className="mb-6 inline-flex h-8 items-center gap-2 rounded-pill bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] px-3 text-sm leading-normal font-extrabold text-primary-text">
        {ICONO_VIA[via]}
        <span>{t(`autenticacion.bienvenida.via.${via}`)}</span>
      </span>

      <div className="mb-6 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-[72px] flex-none place-items-center rounded-full bg-[color-mix(in_srgb,var(--secondary)_14%,transparent)] text-[28px] font-extrabold text-secondary-text"
        >
          {obtenerIniciales(nombre, correo)}
        </span>
        <h1
          id="titulo-bienvenida"
          ref={titulo}
          tabIndex={-1}
          className="min-w-0 break-words text-[28px] leading-[1.15] font-extrabold tracking-[-0.01em] text-ink outline-none"
        >
          {nombre
            ? t('autenticacion.bienvenida.saludo', { nombre })
            : t('autenticacion.bienvenida.sesionIniciada')}
        </h1>
      </div>

      <dl className="mb-6 border-t border-border">
        {nombre && (
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-border py-3">
            <dt className="flex-none text-ink-muted">{t('autenticacion.bienvenida.nombre')}</dt>
            <dd className="min-w-0 break-words text-right">{nombre}</dd>
          </div>
        )}
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-border py-3">
          <dt className="flex-none text-ink-muted">{t('autenticacion.campos.correo')}</dt>
          <dd className="min-w-0 break-words text-right">{correo}</dd>
        </div>
      </dl>

      <p className="mb-6 flex gap-3 rounded-md border border-border bg-(--bg-page) px-4 py-3 text-sm leading-normal text-ink-muted">
        <Info className="mt-0.5 size-[18px] flex-none" aria-hidden="true" />
        <span>{t('autenticacion.bienvenida.nota')}</span>
      </p>

      <Button type="button" variant="contorno" className="w-full" onClick={onCerrarSesion}>
        <LogOut aria-hidden="true" />
        {t('autenticacion.acciones.cerrarSesion')}
      </Button>
    </TarjetaAcceso>
  )
}
