import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as authApi from '../api/auth.api'
import { IngresoPage } from './IngresoPage'

vi.mock('../api/auth.api', async (importOriginal) => {
  const real = await importOriginal<typeof import('../api/auth.api')>()
  return {
    ...real,
    ingresarConCorreo: vi.fn(real.ingresarConCorreo),
    ingresarConProveedor: vi.fn(real.ingresarConProveedor),
  }
})

const DEMO = { correo: 'demo@agricolaandrea.com', contrasena: 'Demo2026!' }

function renderizar() {
  const router = createMemoryRouter(
    [
      { path: '/ingreso', element: <IngresoPage /> },
      { path: '/bienvenida', element: <p>Pantalla de bienvenida</p> },
    ],
    { initialEntries: ['/ingreso'] },
  )
  const usuario = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  render(<RouterProvider router={router} />)
  return { router, usuario }
}

async function avanzar(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

async function llenar(
  usuario: ReturnType<typeof userEvent.setup>,
  correo: string,
  contrasena: string,
) {
  if (correo) await usuario.type(screen.getByLabelText('Correo electrónico'), correo)
  if (contrasena) await usuario.type(screen.getByLabelText('Contraseña', { exact: true }), contrasena)
}

const botonIngresar = () => screen.getByRole('button', { name: /^Ingresar$|^Ingresando…$/ })

describe('IngresoPage (I-1)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.mocked(authApi.ingresarConCorreo).mockClear()
    vi.mocked(authApi.ingresarConProveedor).mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('validación (H1-E2..E4)', () => {
    it('correo "maria.lopez@" muestra aviso de correo y no llama a la api', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, 'maria.lopez@', 'Clave12345')
      await usuario.click(botonIngresar())
      expect(await screen.findByText('Ingrese un correo electrónico válido')).toBeInTheDocument()
      expect(authApi.ingresarConCorreo).not.toHaveBeenCalled()
    })

    it('contraseña vacía muestra "La contraseña es obligatoria"', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, 'maria.lopez@agricolaandrea.com', '')
      await usuario.click(botonIngresar())
      expect(await screen.findByText('La contraseña es obligatoria')).toBeInTheDocument()
      expect(authApi.ingresarConCorreo).not.toHaveBeenCalled()
    })

    it('contraseña de 7 caracteres muestra el mínimo de 8', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, 'maria.lopez@agricolaandrea.com', 'Clave12')
      await usuario.click(botonIngresar())
      expect(
        await screen.findByText('La contraseña debe tener al menos 8 caracteres'),
      ).toBeInTheDocument()
      expect(authApi.ingresarConCorreo).not.toHaveBeenCalled()
    })

    it('contraseña de 8 caracteres no muestra aviso de longitud', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, 'maria.lopez@agricolaandrea.com', 'Clave123')
      await usuario.click(botonIngresar())
      await avanzar(1300)
      expect(
        screen.queryByText('La contraseña debe tener al menos 8 caracteres'),
      ).not.toBeInTheDocument()
    })
  })

  describe('credenciales (H1-E1, E6, E10)', () => {
    it('credenciales incorrectas muestran el mensaje genérico', async () => {
      const { usuario, router } = renderizar()
      await llenar(usuario, 'maria.lopez@agricolaandrea.com', 'Clave12345')
      await usuario.click(botonIngresar())
      await avanzar(1300)
      expect(await screen.findByText('Correo o contraseña incorrectos')).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/ingreso')
    })

    it('correo demo con contraseña distinta muestra el mismo mensaje', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, DEMO.correo, 'Otra2026!')
      await usuario.click(botonIngresar())
      await avanzar(1300)
      expect(await screen.findByText('Correo o contraseña incorrectos')).toBeInTheDocument()
    })

    it('la cuenta demo navega a la bienvenida', async () => {
      const { usuario, router } = renderizar()
      await llenar(usuario, DEMO.correo, DEMO.contrasena)
      await usuario.click(botonIngresar())
      await avanzar(1300)
      expect(await screen.findByText('Pantalla de bienvenida')).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/bienvenida')
    })

    it('seis rechazos seguidos siguen mostrando el mismo mensaje', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, 'maria.lopez@agricolaandrea.com', 'Clave12345')
      for (let i = 0; i < 6; i++) {
        await usuario.click(botonIngresar())
        await avanzar(1300)
        expect(await screen.findByText('Correo o contraseña incorrectos')).toBeInTheDocument()
      }
      expect(authApi.ingresarConCorreo).toHaveBeenCalledTimes(6)
    })
  })

  describe('pendiente (H1-E11)', () => {
    it('mientras procesa muestra "Ingresando…" y el botón queda aria-disabled', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, DEMO.correo, DEMO.contrasena)
      await usuario.click(botonIngresar())
      const boton = await screen.findByRole('button', { name: 'Ingresando…' })
      expect(boton).toHaveAttribute('aria-disabled', 'true')
      await avanzar(1300)
      expect(await screen.findByText('Pantalla de bienvenida')).toBeInTheDocument()
    })
  })

  describe('un solo ingreso (H2-E3..E5)', () => {
    it('doble clic en Ingresar llama a la api una vez', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, DEMO.correo, DEMO.contrasena)
      await usuario.dblClick(botonIngresar())
      await avanzar(1300)
      expect(authApi.ingresarConCorreo).toHaveBeenCalledTimes(1)
    })

    it('doble envío con Enter llama a la api una vez', async () => {
      const { usuario } = renderizar()
      await llenar(usuario, DEMO.correo, DEMO.contrasena)
      await usuario.keyboard('{Enter}{Enter}')
      await avanzar(1300)
      expect(authApi.ingresarConCorreo).toHaveBeenCalledTimes(1)
    })

    it('Google con formulario vacío no muestra avisos y entra con 1 llamada', async () => {
      const { usuario, router } = renderizar()
      await usuario.click(screen.getByRole('button', { name: /Continuar con Google/ }))
      expect(screen.queryByText('Ingrese un correo electrónico válido')).not.toBeInTheDocument()
      expect(screen.queryByText('La contraseña es obligatoria')).not.toBeInTheDocument()
      await avanzar(1300)
      expect(await screen.findByText('Pantalla de bienvenida')).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/bienvenida')
      expect(authApi.ingresarConProveedor).toHaveBeenCalledTimes(1)
      expect(authApi.ingresarConProveedor).toHaveBeenCalledWith('google')
      expect(authApi.ingresarConCorreo).not.toHaveBeenCalled()
    })

    it('Microsoft con doble clic llama a la api una vez', async () => {
      const { usuario } = renderizar()
      await usuario.dblClick(screen.getByRole('button', { name: /Continuar con Microsoft/ }))
      await avanzar(1300)
      expect(authApi.ingresarConProveedor).toHaveBeenCalledTimes(1)
    })

    it('durante un ingreso por proveedor, los otros botones quedan aria-disabled', async () => {
      const { usuario } = renderizar()
      await usuario.click(screen.getByRole('button', { name: /Continuar con GitHub/ }))
      expect(screen.getByRole('button', { name: /Continuar con Google/ })).toHaveAttribute(
        'aria-disabled',
        'true',
      )
      await avanzar(1300)
    })
  })
})
