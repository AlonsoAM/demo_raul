import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorCampo } from '@/components/shared/ErrorCampo'
import { ingresoSchema, type DatosIngreso } from '../schemas/ingreso.schema'
import type { ViaIngreso } from '../types/autenticacion.types'
import { AvisoCredenciales } from './AvisoCredenciales'
import { CampoContrasena } from './CampoContrasena'

interface FormularioIngresoProps {
  /** Vía de ingreso en curso; null si no hay ninguna (A8). */
  pendiente: ViaIngreso | null
  /** Clave del catálogo i18n del error de autenticación; null si no hay. */
  errorAutenticacion: string | null
  onEnviar: (datos: DatosIngreso) => void
}

/** Formulario de ingreso con correo y contraseña. Valida solo al enviar (A6). */
export function FormularioIngreso({
  pendiente,
  errorAutenticacion,
  onEnviar,
}: FormularioIngresoProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<DatosIngreso>({
    resolver: zodResolver(ingresoSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { correo: '', contrasena: '' },
  })

  const bloqueado = pendiente !== null

  // Durante un ingreso por proveedor no se muestran avisos de campo.
  useEffect(() => {
    if (pendiente !== null && pendiente !== 'correo') clearErrors()
  }, [pendiente, clearErrors])

  const alEnviar = handleSubmit((datos) => {
    if (bloqueado) return
    onEnviar(datos)
  })

  const errorCorreo = errors.correo?.message
    ? t(errors.correo.message)
    : undefined
  const errorContrasena = errors.contrasena?.message
    ? t(errors.contrasena.message)
    : undefined

  return (
    <form
      noValidate
      onSubmit={(evento) => {
        if (bloqueado) {
          evento.preventDefault()
          return
        }
        void alEnviar(evento)
      }}
    >
      <div className="mb-5">
        <Label htmlFor="correo" className="mb-2">
          {t('autenticacion.campos.correo')}
        </Label>
        <Input
          id="correo"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t('autenticacion.campos.correoEjemplo')}
          disabled={bloqueado}
          aria-invalid={errorCorreo ? true : undefined}
          aria-describedby={errorCorreo ? 'error-correo' : undefined}
          {...register('correo')}
        />
        <ErrorCampo id="error-correo">{errorCorreo}</ErrorCampo>
      </div>

      <div className="mb-5">
        <CampoContrasena
          id="contrasena"
          disabled={bloqueado}
          error={errorContrasena}
          {...register('contrasena')}
        />
      </div>

      {errorAutenticacion && (
        <AvisoCredenciales mensaje={t(errorAutenticacion)} />
      )}

      <Button
        type="submit"
        variant="principal"
        cargando={pendiente === 'correo'}
        aria-disabled={bloqueado || undefined}
      >
        {pendiente === 'correo'
          ? t('autenticacion.acciones.ingresando')
          : t('autenticacion.acciones.ingresar')}
      </Button>
    </form>
  )
}
