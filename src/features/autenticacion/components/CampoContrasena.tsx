import { useId, useState } from "react"
import type { ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorCampo } from "@/components/shared/ErrorCampo"

type CampoContrasenaProps = Omit<ComponentProps<"input">, "type"> & {
  /** Mensaje de error YA traducido; si no hay, el campo es válido. */
  error?: string
}

/**
 * Campo de contraseña con control mostrar/ocultar.
 * Compatible con react-hook-form: en React 19 `ref` llega como prop,
 * por lo que `{...register('contrasena')}` funciona sin forwardRef.
 */
export function CampoContrasena({
  error,
  id,
  className,
  ...props
}: CampoContrasenaProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const idGenerado = useId()
  const idCampo = id ?? idGenerado
  const idError = `${idCampo}-error`

  return (
    <div>
      <Label htmlFor={idCampo} className="mb-2">
        {t("autenticacion.campos.contrasena")}
      </Label>
      <div className="relative">
        <Input
          autoComplete="current-password"
          {...props}
          id={idCampo}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          className={`pr-14 ${className ?? ""}`.trim()}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={t(
            visible
              ? "autenticacion.campos.ocultarContrasena"
              : "autenticacion.campos.mostrarContrasena",
          )}
          aria-pressed={visible}
          className="absolute inset-y-0.5 right-0.5 flex w-12 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-[21px]" />
          ) : (
            <Eye aria-hidden="true" className="size-[21px]" />
          )}
        </button>
      </div>
      <ErrorCampo id={idError}>{error}</ErrorCampo>
    </div>
  )
}
