import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TarjetaAcceso } from '@/components/shared/TarjetaAcceso'
import { BotonProveedor } from '../components/BotonProveedor'
import { FormularioIngreso } from '../components/FormularioIngreso'
import { useIngreso } from '../hooks/useIngreso'
import type { Proveedor } from '../types/autenticacion.types'

const PROVEEDORES: readonly Proveedor[] = ['google', 'github', 'microsoft']

/** Página de ingreso: correo y contraseña, o proveedor externo (H1, H2). */
export function IngresoPage() {
  const { t } = useTranslation()
  const { pendiente, errorAutenticacion, ingresarConCorreo, ingresarConProveedor } = useIngreso()
  const titulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titulo.current?.focus()
  }, [])

  return (
    <TarjetaAcceso aria-labelledby="titulo-ingreso">
      <h1
        id="titulo-ingreso"
        ref={titulo}
        tabIndex={-1}
        className="mb-1 text-[28px] leading-[1.15] font-extrabold tracking-tight wrap-anywhere outline-none"
      >
        {t('autenticacion.ingreso.titulo')}
      </h1>
      <p className="mb-6 text-muted-foreground">{t('autenticacion.ingreso.subtitulo')}</p>

      <FormularioIngreso
        pendiente={pendiente}
        errorAutenticacion={errorAutenticacion}
        onEnviar={(datos) => void ingresarConCorreo(datos)}
      />

      <div
        aria-hidden="true"
        className="my-6 flex items-center gap-4 text-muted-foreground before:h-px before:flex-1 before:bg-border before:content-[''] after:h-px after:flex-1 after:bg-border after:content-['']"
      >
        <span>{t('autenticacion.ingreso.separador')}</span>
      </div>

      <div className="grid gap-3">
        {PROVEEDORES.map((proveedor) => (
          <BotonProveedor
            key={proveedor}
            proveedor={proveedor}
            cargando={pendiente === proveedor}
            bloqueado={pendiente !== null && pendiente !== proveedor}
            onClick={() => void ingresarConProveedor(proveedor)}
          />
        ))}
      </div>
    </TarjetaAcceso>
  )
}
