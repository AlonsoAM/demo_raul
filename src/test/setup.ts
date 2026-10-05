import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import i18n from '@/lib/i18n'
import { aplicarTema } from '@/lib/tema'

afterEach(async () => {
  cleanup()
  // changeLanguage cachea el idioma en localStorage: se limpia después para dejar el storage vacío.
  await i18n.changeLanguage('es')
  localStorage.clear()
  aplicarTema('sistema')
})
