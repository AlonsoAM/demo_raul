import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { UsuarioSesion } from '@/features/autenticacion/types/autenticacion.types'

import { useSesionStore } from './useSesionStore'

const usuarioPrueba: UsuarioSesion = {
  nombre: 'Ana Prueba',
  correo: 'ana@ejemplo.com',
  via: 'correo',
}

describe('useSesionStore (U-3)', () => {
  beforeEach(() => {
    useSesionStore.setState({ usuario: null })
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('arranca sin sesión (usuario null)', () => {
    expect(useSesionStore.getState().usuario).toBeNull()
  })

  it('iniciarSesion guarda la identidad', () => {
    useSesionStore.getState().iniciarSesion(usuarioPrueba)

    expect(useSesionStore.getState().usuario).toEqual(usuarioPrueba)
  })

  it('cerrarSesion limpia la identidad (H3-E5/E6)', () => {
    useSesionStore.getState().iniciarSesion(usuarioPrueba)
    useSesionStore.getState().cerrarSesion()

    expect(useSesionStore.getState().usuario).toBeNull()
  })

  it('no persiste nada en localStorage ni sessionStorage', () => {
    const setLocal = vi.spyOn(Storage.prototype, 'setItem')

    useSesionStore.getState().iniciarSesion(usuarioPrueba)
    useSesionStore.getState().cerrarSesion()
    useSesionStore.getState().iniciarSesion(usuarioPrueba)

    expect(setLocal).not.toHaveBeenCalled()
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
  })

  it('un estado nuevo (tras reset) arranca sin sesión aunque hubo una antes', () => {
    useSesionStore.getState().iniciarSesion(usuarioPrueba)
    useSesionStore.setState(useSesionStore.getInitialState(), true)

    expect(useSesionStore.getState().usuario).toBeNull()
  })
})
