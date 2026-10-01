import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

import { RutaProtegida } from '@/app/RutaProtegida'
import { DisposicionAcceso } from '@/components/shared/DisposicionAcceso'
import { BienvenidaPage } from '@/features/autenticacion/pages/BienvenidaPage'
import { IngresoPage } from '@/features/autenticacion/pages/IngresoPage'

/** Rutas de la app (plan §3.8). Se exportan aparte para las pruebas con `createMemoryRouter`. */
export const rutas: RouteObject[] = [
  {
    element: <DisposicionAcceso />,
    children: [
      { index: true, element: <Navigate to="/ingreso" replace /> },
      { path: 'ingreso', element: <IngresoPage /> },
      {
        element: <RutaProtegida />,
        children: [{ path: 'bienvenida', element: <BienvenidaPage /> }],
      },
      { path: '*', element: <Navigate to="/ingreso" replace /> },
    ],
  },
]

export const router = createBrowserRouter(rutas)
