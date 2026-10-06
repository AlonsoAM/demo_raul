import { useEffect, useRef, useState } from 'react'
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

/** Error serializable para el registro (A14): solo nombre y mensaje, sin entrada del usuario. */
function serializarError(error: unknown): { name: string; message: string } | string {
  return error instanceof Error ? { name: error.name, message: error.message } : String(error)
}

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
  const cerrarSesion = useSesionStore((s) => s.cerrarSesion)
  const [pendiente, setPendiente] = useState<ViaIngreso | null>(null)
  const [errorAutenticacion, setErrorAutenticacion] = useState<string | null>(null)
  const enCursoRef = useRef(false)
  const montadoRef = useRef(true)

  useEffect(() => {
    montadoRef.current = true
    return () => {
      montadoRef.current = false
    }
  }, [])

  async function ejecutar(via: ViaIngreso, operacion: () => Promise<UsuarioSesion>): Promise<void> {
    if (enCursoRef.current) return
    enCursoRef.current = true
    setPendiente(via)
    setErrorAutenticacion(null)

    function fallar(clave: string) {
      setErrorAutenticacion(clave)
      setPendiente(null)
      enCursoRef.current = false
    }

    let usuario: UsuarioSesion
    try {
      usuario = await operacion()
    } catch (error) {
      // Pantalla desmontada mientras la promesa estaba pendiente: no se toca estado.
      if (!montadoRef.current) return
      if (error instanceof CredencialesInvalidasError) {
        fallar('autenticacion.errores.credenciales')
      } else {
        // Nunca correo, contraseña ni tokens (Const. A1).
        console.error('ingreso: error inesperado', { via, error: serializarError(error) })
        fallar('autenticacion.errores.generico')
      }
      return
    }

    // Si el usuario salió de la pantalla durante la espera, no se inicia sesión ni se navega.
    if (!montadoRef.current) return

    iniciarSesion(usuario)
    try {
      // No se limpia `pendiente`: la pantalla se desmonta, sin destello de formulario habilitado.
      await navigate(RUTA_BIENVENIDA)
    } catch (error) {
      // Sin navegación no hay sesión a medias: se revierte y se avisa con el error genérico.
      console.error('ingreso: no se pudo navegar a la bienvenida', {
        via,
        error: serializarError(error),
      })
      cerrarSesion()
      if (montadoRef.current) fallar('autenticacion.errores.generico')
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
