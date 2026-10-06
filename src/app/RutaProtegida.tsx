import { Navigate, Outlet } from 'react-router'

import { useSesionStore } from '@/stores/useSesionStore'

/**
 * Guard de ruta (plan §3.8, A3/A4). Se usa como *layout-route*, sin `children`:
 *
 *   { element: <RutaProtegida />, children: [{ path: 'bienvenida', element: <BienvenidaPage /> }] }
 *
 * Sin sesión redirige a `/ingreso` (replace); con sesión renderiza `<Outlet />`.
 * El backend sigue siendo la fuente de verdad; esto solo evita mostrar la vista (A12).
 */
export function RutaProtegida() {
  const usuario = useSesionStore((s) => s.usuario)

  if (!usuario) {
    return <Navigate to="/ingreso" replace />
  }

  return <Outlet />
}
