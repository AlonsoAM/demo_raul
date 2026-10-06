import { describe, expect, it } from 'vitest'
import { ingresoSchema } from './ingreso.schema'

const CLAVE_VALIDA = 'Clave123'
const CORREO_VALIDO = 'maria.lopez@agricolaandrea.com'

function mensajes(datos: { correo: string; contrasena: string }, campo: string): string[] {
  const r = ingresoSchema.safeParse(datos)
  if (r.success) return []
  return r.error.issues.filter((i) => i.path[0] === campo).map((i) => i.message)
}

describe('ingresoSchema (U-1)', () => {
  describe('correo (H1-E2)', () => {
    it('acepta un correo válido', () => {
      expect(ingresoSchema.safeParse({ correo: CORREO_VALIDO, contrasena: CLAVE_VALIDA }).success).toBe(true)
    })

    it.each(['maria.lopez@', 'maria.lopez', ''])('rechaza "%s" con correoInvalido', (correo) => {
      expect(mensajes({ correo, contrasena: CLAVE_VALIDA }, 'correo')).toEqual([
        'autenticacion.errores.correoInvalido',
      ])
    })
  })

  describe('contraseña', () => {
    it('vacía → contrasenaVacia (H1-E3)', () => {
      expect(mensajes({ correo: CORREO_VALIDO, contrasena: '' }, 'contrasena')).toEqual([
        'autenticacion.errores.contrasenaVacia',
      ])
    })

    it('7 caracteres → contrasenaCorta (H1-E4)', () => {
      expect(mensajes({ correo: CORREO_VALIDO, contrasena: 'Clave12' }, 'contrasena')).toEqual([
        'autenticacion.errores.contrasenaCorta',
      ])
    })

    it('8 caracteres → sin error de longitud (H1-E5)', () => {
      expect(mensajes({ correo: CORREO_VALIDO, contrasena: 'Clave123' }, 'contrasena')).toEqual([])
    })
  })
})
