/** Proveedores de identidad externos disponibles para ingresar. */
export type Proveedor = 'google' | 'github' | 'microsoft'

/** Vía por la que se inició sesión: correo y contraseña o un proveedor. */
export type ViaIngreso = 'correo' | Proveedor

/** Usuario de la sesión activa (solo en memoria, sin persistencia). */
export interface UsuarioSesion {
  nombre: string | null
  correo: string
  via: ViaIngreso
}
