import { create } from 'zustand'

import type { UsuarioSesion } from '@/features/autenticacion/types/autenticacion.types'

interface SesionState {
  /** Usuario de la sesión activa; `null` si no hay sesión. */
  usuario: UsuarioSesion | null
  iniciarSesion: (usuario: UsuarioSesion) => void
  cerrarSesion: () => void
}

/**
 * Sesión solo en memoria (plan A4): sin `persist`, nada en `localStorage`.
 * Al recargar la página la sesión se pierde y el usuario vuelve a ingresar.
 */
export const useSesionStore = create<SesionState>((set) => ({
  usuario: null,
  iniciarSesion: (usuario) => set({ usuario }),
  cerrarSesion: () => set({ usuario: null }),
}))
