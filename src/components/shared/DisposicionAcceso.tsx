import { Outlet } from 'react-router'
import { EncabezadoApp } from '@/components/shared/EncabezadoApp'

/**
 * Layout de las vistas de acceso (ingreso y bienvenida): fondo de página, encabezado
 * y la tarjeta centrada. El resplandor es el único efecto de fondo permitido aquí
 * (DESIGN.md §4.2): círculo de 720px derivado del primario, sin animación.
 */
export function DisposicionAcceso() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <EncabezadoApp />
      <main className="relative flex flex-1 items-start justify-center overflow-hidden px-4 pb-24 pt-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-120px] size-[720px] -translate-x-1/2 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_22%,transparent),transparent)]"
        />
        <Outlet />
      </main>
    </div>
  )
}
