import { beforeEach, describe, expect, it, vi } from 'vitest'

const CLAVE = 'autenticacion.acciones.ingresar'

/** Re-inicializa el módulo i18n con el navegador y el storage indicados. */
async function cargarI18n(idiomaNavegador: string, guardado?: string) {
  vi.resetModules()
  localStorage.clear()
  if (guardado) localStorage.setItem('idioma', guardado)
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(idiomaNavegador)
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue([idiomaNavegador])
  const modulo = await import('@/lib/i18n')
  await vi.waitFor(() => expect(modulo.default.isInitialized).toBe(true))
  return modulo.default
}

describe('i18n (U-5)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('H1-E13: arranca en español aunque el navegador esté en inglés', async () => {
    const i18n = await cargarI18n('en-US')
    expect(i18n.resolvedLanguage).toBe('es')
    expect(i18n.t(CLAVE)).toBe('Ingresar')
    expect(document.documentElement.lang).toBe('es')
  })

  it('H1-E14: cambiar a inglés traduce, persiste y actualiza <html lang>', async () => {
    const i18n = await cargarI18n('en-US')
    await i18n.changeLanguage('en')
    expect(i18n.t(CLAVE)).toBe('Sign in')
    expect(localStorage.getItem('idioma')).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('H1-E15: la elección guardada se recupera al reinicializar', async () => {
    const i18n = await cargarI18n('es-PE', 'en')
    expect(i18n.resolvedLanguage).toBe('en')
    expect(i18n.t(CLAVE)).toBe('Sign in')
  })
})
