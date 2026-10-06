import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { RutaProtegida } from '@/app/RutaProtegida'
import { useSesionStore } from '@/stores/useSesionStore'
import type { UsuarioSesion } from '../types/autenticacion.types'
import { BienvenidaPage } from './BienvenidaPage'
import { IngresoPage } from './IngresoPage'

const SESIONES: Record<string, UsuarioSesion> = {
  demo: { nombre: null, correo: 'demo@agricolaandrea.com', via: 'correo' },
  google: { nombre: 'Carla Ríos', correo: 'carla.rios@gmail.com', via: 'google' },
  github: {
    nombre: 'Mateo Quispe',
    correo: 'mateo.quispe@users.noreply.github.com',
    via: 'github',
  },
  microsoft: { nombre: 'Lucía Paredes', correo: 'lucia.paredes@outlook.com', via: 'microsoft' },
}

function renderizar(sesion: UsuarioSesion | null) {
  useSesionStore.setState({ usuario: sesion })
  const router = createMemoryRouter(
    [
      { path: '/ingreso', element: <IngresoPage /> },
      {
        element: <RutaProtegida />,
        children: [{ path: '/bienvenida', element: <BienvenidaPage /> }],
      },
    ],
    { initialEntries: ['/bienvenida'] },
  )
  const usuario = userEvent.setup()
  render(<RouterProvider router={router} />)
  return { router, usuario }
}

describe('BienvenidaPage (I-2)', () => {
  beforeEach(() => {
    useSesionStore.setState({ usuario: null })
  })

  it('H3-E1: cuenta demo muestra el correo y "Sesión iniciada", sin fila Nombre', () => {
    renderizar(SESIONES.demo)
    expect(screen.getByRole('heading', { level: 1, name: 'Sesión iniciada' })).toBeInTheDocument()
    expect(screen.getByText('demo@agricolaandrea.com')).toBeInTheDocument()
    expect(screen.getByText('Cuenta de demostración')).toBeInTheDocument()
    expect(screen.queryByText('Nombre')).not.toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it.each([
    ['H3-E2/E3', 'google', 'Carla Ríos', 'carla.rios@gmail.com', 'CR', 'Ingreso con Google'],
    [
      'H3-E4',
      'github',
      'Mateo Quispe',
      'mateo.quispe@users.noreply.github.com',
      'MQ',
      'Ingreso con GitHub',
    ],
    [
      'H3-E7/E8',
      'microsoft',
      'Lucía Paredes',
      'lucia.paredes@outlook.com',
      'LP',
      'Ingreso con Microsoft',
    ],
  ])('%s: %s muestra saludo, nombre, correo e iniciales', (_id, via, nombre, correo, iniciales, etiqueta) => {
    renderizar(SESIONES[via])
    expect(screen.getByRole('heading', { level: 1, name: `Hola, ${nombre}` })).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    // El nombre aparece en el saludo y en la fila Nombre; el correo solo en su fila.
    expect(screen.getAllByText(nombre).length).toBeGreaterThan(0)
    expect(screen.getByText(correo)).toBeInTheDocument()
    expect(screen.getByText(iniciales)).toBeInTheDocument()
    expect(screen.getByText(etiqueta)).toBeInTheDocument()
  })

  it('H3-E5: "Cerrar sesión" limpia la sesión y vuelve a /ingreso', async () => {
    const { router, usuario } = renderizar(SESIONES.google)
    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(useSesionStore.getState().usuario).toBeNull()
    expect(router.state.location.pathname).toBe('/ingreso')
    expect(await screen.findByLabelText('Correo electrónico')).toBeInTheDocument()
  })

  it('H3-E6: tras cerrar sesión el formulario de ingreso aparece vacío', async () => {
    const { usuario } = renderizar(SESIONES.demo)
    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(await screen.findByLabelText('Correo electrónico')).toHaveValue('')
    expect(screen.getByLabelText('Contraseña', { exact: true })).toHaveValue('')
  })

  it('H3-E5: sin sesión, /bienvenida redirige a /ingreso sin mostrar la tarjeta', async () => {
    const { router } = renderizar(null)
    expect(router.state.location.pathname).toBe('/ingreso')
    expect(await screen.findByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
  })
})
