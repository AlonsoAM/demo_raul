import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  CLAVE_TEMA,
  aplicarTema,
  cambiarTema,
  guardarTema,
  iniciarTema,
  leerTema,
} from '@/lib/tema'

const html = () => document.documentElement

describe('tema (U-4)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('H1-E16: sin valor guardado el defecto es "sistema" y no hay atributo', () => {
    expect(leerTema()).toBe('sistema')
    iniciarTema()
    expect(html().hasAttribute('data-theme')).toBe(false)
  })

  it('H1-E17: oscuro escribe data-theme=dark y persiste', () => {
    cambiarTema('oscuro')
    expect(html().getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem(CLAVE_TEMA)).toBe('oscuro')
  })

  it('H1-E17: claro escribe data-theme=light y persiste', () => {
    cambiarTema('claro')
    expect(html().getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem(CLAVE_TEMA)).toBe('claro')
  })

  it('H1-E18/RN-14: sistema quita el atributo y guarda "sistema"', () => {
    cambiarTema('oscuro')
    cambiarTema('sistema')
    expect(html().hasAttribute('data-theme')).toBe(false)
    expect(localStorage.getItem(CLAVE_TEMA)).toBe('sistema')
  })

  it('H1-E19: la preferencia guardada se recupera al iniciar', () => {
    guardarTema('oscuro')
    iniciarTema()
    expect(leerTema()).toBe('oscuro')
    expect(html().getAttribute('data-theme')).toBe('dark')

    guardarTema('claro')
    iniciarTema()
    expect(html().getAttribute('data-theme')).toBe('light')
  })

  it('valor corrupto en storage cae a "sistema"', () => {
    localStorage.setItem(CLAVE_TEMA, 'morado')
    expect(leerTema()).toBe('sistema')
    iniciarTema()
    expect(html().hasAttribute('data-theme')).toBe(false)
  })

  it('localStorage que lanza no rompe y avisa', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(leerTema()).toBe('sistema')
    expect(() => cambiarTema('oscuro')).not.toThrow()
    expect(html().getAttribute('data-theme')).toBe('dark')
    expect(aviso).toHaveBeenCalledTimes(2)
    aplicarTema('sistema')
  })
})
