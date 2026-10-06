import { act, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { useSesionStore } from '@/stores/useSesionStore'
import { rutas } from './router'

function renderizar(inicial: string[], indice?: number) {
  const router = createMemoryRouter(rutas, { initialEntries: inicial, initialIndex: indice })
  render(<RouterProvider router={router} />)
  return router
}

describe('router — /ingreso con sesión activa', () => {
  beforeEach(() => {
    useSesionStore.setState({ usuario: null })
  })

  it('sin sesión muestra el formulario de ingreso', async () => {
    const router = renderizar(['/ingreso'])
    expect(await screen.findByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/ingreso')
  })

  it('con sesión activa, /ingreso redirige a /bienvenida', async () => {
    useSesionStore.setState({
      usuario: { nombre: null, correo: 'demo@agricolaandrea.com', via: 'correo' },
    })
    const router = renderizar(['/ingreso'])
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sesión iniciada' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/bienvenida')
    expect(screen.queryByLabelText('Correo electrónico')).not.toBeInTheDocument()
  })

  it('la redirección reemplaza la entrada del historial (replace)', async () => {
    useSesionStore.setState({
      usuario: { nombre: null, correo: 'demo@agricolaandrea.com', via: 'correo' },
    })
    const router = renderizar(['/bienvenida'])
    await screen.findByRole('heading', { level: 1, name: 'Sesión iniciada' })
    await act(() => router.navigate('/ingreso'))
    // Distingue replace de push: una redirección con push dejaría 'PUSH' y un historial más largo.
    expect(router.state.historyAction).toBe('REPLACE')
    expect(router.state.location.pathname).toBe('/bienvenida')
  })
})
