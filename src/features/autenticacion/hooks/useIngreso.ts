import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  CredencialesInvalidasError,
  ingresarConCorreo as ingresarConCorreoApi,
  ingresarConProveedor as ingresarConProveedorApi,
} from '../api/auth.api'
import type { DatosIngreso } from '../schemas/ingreso.schema'
import type { Proveedor, UsuarioSesion, ViaIngreso } from '../types/autenticacion.types'
import { useSesionStore } from '@/stores/useSesionStore'

const RUTA_BIENVENIDA = '/bienvenida'

export interface UseIngreso {
  /** Vía con ingreso en curso; `null` si no hay ninguno. */
  pendiente: ViaIngreso | null
  /** Clave del catálogo i18n del error de autenticación; `null` si no hay. */
  errorAutenticacion: string | null
  ingresarConCorreo: (datos: DatosIngreso) => Promise<void>
  ingresarConProveedor: (proveedor: Proveedor) => Promise<void>
}

/**
 * Orquesta el ingreso por correo y por proveedor (plan §3.5).
 * Anti doble envío (A8): `useRef` porque dos clics en el mismo ciclo
 * pasan un chequeo por estado. Errores no silenciados (A9).
 */
export function useIngreso(): UseIngreso {
  const navigate = useNavigate()
  const iniciarSesion = useSesionStore((s) => s.iniciarSesion)
  const [pendiente, setPendiente] = useState<ViaIngreso | null>(null)
  const [errorAutenticacion, setErrorAutenticacion] = useState<string | null>(null)
  const enCursoRef = useRef(false)

  async function ejecutar(via: ViaIngreso, operacion: () => Promise<UsuarioSesion>): Promise<void> {
    if (enCursoRef.current) return
    enCursoRef.current = true
    setPendiente(via)
    setErrorAutenticacion(null)

    try {
      const usuario = await operacion()
      iniciarSesion(usuario)
      // No se limpia `pendiente`: la pantalla se desmonta, sin destello de formulario habilitado.
      await navigate(RUTA_BIENVENIDA)
    } catch (error) {
      if (error instanceof CredencialesInvalidasError) {
        setErrorAutenticacion('autenticacion.errores.credenciales')
      } else {
        // Nunca correo, contraseña ni tokens (Const. A1).
        console.error('ingreso: error inesperado', { via })
        setErrorAutenticacion('autenticacion.errores.generico')
      }
      setPendiente(null)
      enCursoRef.current = false
    }
  }

  return {
    pendiente,
    errorAutenticacion,
    ingresarConCorreo: (datos) => ejecutar('correo', () => ingresarConCorreoApi(datos)),
    ingresarConProveedor: (proveedor) =>
      ejecutar(proveedor, () => ingresarConProveedorApi(proveedor)),
  }
}
