import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSesionStore } from '@/stores/useSesionStore'
import * as authApi from '../api/auth.api'
import type { UsuarioSesion } from '../types/autenticacion.types'
import { useIngreso } from './useIngreso'

const navigate = vi.fn<(ruta: string) => Promise<void>>()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('../api/auth.api', async (importOriginal) => {
  const real = await importOriginal<typeof import('../api/auth.api')>()
  return { ...real, ingresarConProveedor: vi.fn() }
})

const USUARIO: UsuarioSesion = { nombre: 'Carla Ríos', correo: 'carla.rios@gmail.com', via: 'google' }

function pendienteManual() {
  let resolver!: (u: UsuarioSesion) => void
  const promesa = new Promise<UsuarioSesion>((r) => {
    resolver = r
  })
  return { promesa, resolver }
}

describe('useIngreso — desmontaje y navegación fallida', () => {
  beforeEach(() => {
    useSesionStore.setState({ usuario: null })
    navigate.mockReset()
    navigate.mockResolvedValue(undefined)
    vi.mocked(authApi.ingresarConProveedor).mockReset()
  })

  it('si se desmonta con la promesa pendiente, no inicia sesión ni navega', async () => {
    const { promesa, resolver } = pendienteManual()
    vi.mocked(authApi.ingresarConProveedor).mockReturnValue(promesa)
    const { result, unmount } = renderHook(() => useIngreso())

    let ingreso!: Promise<void>
    act(() => {
      ingreso = result.current.ingresarConProveedor('google')
    })
    unmount()
    await act(async () => {
      resolver(USUARIO)
      await ingreso
    })

    expect(useSesionStore.getState().usuario).toBeNull()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('si navegar falla, revierte la sesión y muestra el error genérico', async () => {
    vi.mocked(authApi.ingresarConProveedor).mockResolvedValue(USUARIO)
    navigate.mockRejectedValue(new Error('fallo de navegación'))
    const consola = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useIngreso())

    await act(async () => {
      await result.current.ingresarConProveedor('google')
    })

    expect(navigate).toHaveBeenCalledWith('/bienvenida')
    expect(useSesionStore.getState().usuario).toBeNull()
    expect(result.current.errorAutenticacion).toBe('autenticacion.errores.generico')
    expect(result.current.pendiente).toBeNull()
    expect(consola).toHaveBeenCalledWith(
      'ingreso: no se pudo navegar a la bienvenida',
      expect.objectContaining({
        via: 'google',
        error: { name: 'Error', message: 'fallo de navegación' },
      }),
    )
    consola.mockRestore()
  })

  it('el flujo feliz inicia sesión y navega a la bienvenida', async () => {
    vi.mocked(authApi.ingresarConProveedor).mockResolvedValue(USUARIO)
    const { result } = renderHook(() => useIngreso())

    await act(async () => {
      await result.current.ingresarConProveedor('google')
    })

    expect(useSesionStore.getState().usuario).toEqual(USUARIO)
    expect(navigate).toHaveBeenCalledWith('/bienvenida')
  })
})
