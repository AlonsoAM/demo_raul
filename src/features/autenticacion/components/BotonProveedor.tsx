import type { MouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { IconoGithub } from '@/components/shared/IconoGithub'
import { IconoGoogle } from '@/components/shared/IconoGoogle'
import { IconoMicrosoft } from '@/components/shared/IconoMicrosoft'
import type { Proveedor } from '@/features/autenticacion/types/autenticacion.types'

const ICONOS: Record<Proveedor, ReactNode> = {
  google: <IconoGoogle aria-hidden="true" />,
  github: <IconoGithub aria-hidden="true" />,
  microsoft: <IconoMicrosoft aria-hidden="true" />,
}

interface BotonProveedorProps {
  proveedor: Proveedor
  /** Icono a la izquierda; por defecto, el del proveedor. */
  icono?: ReactNode
  /** Este proveedor está ingresando: spinner + «Ingresando…». */
  cargando: boolean
  /** Otro ingreso está en curso: `aria-disabled`, el clic se ignora (conserva el foco). */
  bloqueado: boolean
  onClick: () => void
}

/** Botón de ingreso con un proveedor externo (Google, GitHub, Microsoft). */
export function BotonProveedor({
  proveedor,
  icono,
  cargando,
  bloqueado,
  onClick,
}: BotonProveedorProps) {
  const { t } = useTranslation()

  const manejarClic = (evento: MouseEvent<HTMLButtonElement>) => {
    if (bloqueado) {
      evento.preventDefault()
      return
    }
    onClick()
  }

  return (
    <Button
      type="button"
      variant="proveedor"
      cargando={cargando}
      aria-disabled={bloqueado || cargando || undefined}
      onClick={manejarClic}
    >
      {/* Con `cargando`, el spinner de Button reemplaza al icono. */}
      {!cargando && (icono ?? ICONOS[proveedor])}
      {cargando ? t('autenticacion.acciones.ingresando') : t(`autenticacion.acciones.${proveedor}`)}
    </Button>
  )
}
