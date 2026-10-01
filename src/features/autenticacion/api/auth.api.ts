import type { DatosIngreso } from '../schemas/ingreso.schema'
import type { Proveedor, UsuarioSesion } from '../types/autenticacion.types'

// Frontera con el «backend» que aún no existe (A1): al llegar el backend real
// se reemplaza este archivo y el resto de la feature no cambia.
// Los datos de abajo son ejemplos públicos de demostración, no secretos (A5).

export const CUENTA_DEMO = {
  correo: 'demo@agricolaandrea.com',
  contrasena: 'Demo2026!',
} as const

export const IDENTIDADES_PROVEEDOR: Record<Proveedor, { nombre: string; correo: string }> = {
  google: { nombre: 'Carla Ríos', correo: 'carla.rios@gmail.com' },
  github: { nombre: 'Mateo Quispe', correo: 'mateo.quispe@users.noreply.github.com' },
  microsoft: { nombre: 'Lucía Paredes', correo: 'lucia.paredes@outlook.com' },
}

export const LATENCIA_SIMULADA_MS = 1200

/** Único rechazo «esperado» del ingreso: el mismo error para cualquier combinación (RN-6). */
export class CredencialesInvalidasError extends Error {
  constructor() {
    super('Credenciales inválidas')
    this.name = 'CredencialesInvalidasError'
  }
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

/** Ingreso con correo y contraseña: correo sin distinguir mayúsculas, contraseña exacta. */
export async function ingresarConCorreo(datos: DatosIngreso): Promise<UsuarioSesion> {
  await esperar(LATENCIA_SIMULADA_MS)
  const correoValido = datos.correo.trim().toLowerCase() === CUENTA_DEMO.correo
  const contrasenaValida = datos.contrasena === CUENTA_DEMO.contrasena
  if (!correoValido || !contrasenaValida) {
    throw new CredencialesInvalidasError()
  }
  return { nombre: null, correo: CUENTA_DEMO.correo, via: 'correo' }
}

/** Ingreso con proveedor externo: siempre exitoso con la identidad de ejemplo (RN-9). */
export async function ingresarConProveedor(proveedor: Proveedor): Promise<UsuarioSesion> {
  await esperar(LATENCIA_SIMULADA_MS)
  const identidad = IDENTIDADES_PROVEEDOR[proveedor]
  return { nombre: identidad.nombre, correo: identidad.correo, via: proveedor }
}
