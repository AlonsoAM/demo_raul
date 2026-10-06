import { z } from 'zod'

// Los mensajes son claves del catálogo i18n (A16); el componente las traduce con t(clave).
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Pre-validación de UX: el backend (servicio de ingreso) revalida (A12).
export const ingresoSchema = z.object({
  correo: z
    .string()
    .trim()
    .regex(REGEX_CORREO, 'autenticacion.errores.correoInvalido'),
  contrasena: z
    .string()
    .min(1, { error: 'autenticacion.errores.contrasenaVacia', abort: true })
    .min(8, 'autenticacion.errores.contrasenaCorta'),
})

export type DatosIngreso = z.infer<typeof ingresoSchema>
