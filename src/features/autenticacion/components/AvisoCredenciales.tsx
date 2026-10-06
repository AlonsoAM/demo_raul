import type { ComponentProps } from "react"
import { CircleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvisoCredencialesProps
  extends Omit<ComponentProps<"div">, "children"> {
  /** Mensaje ya traducido; el componente no decide el texto ni qué campo falló (RN-6). */
  mensaje: string
}

/** Aviso de credenciales incorrectas, sobre el botón de ingreso (H1-E6, H1-E7, H1-E12). */
export function AvisoCredenciales({
  mensaje,
  className,
  ...props
}: AvisoCredencialesProps) {
  return (
    <div
      role="alert"
      className={cn(
        "mb-4 flex items-start gap-3 rounded-md border border-red-text bg-[color-mix(in_srgb,var(--accent-red)_14%,transparent)] px-4 py-3 text-red-text",
        className,
      )}
      {...props}
    >
      <CircleAlert className="mt-px size-6 shrink-0" aria-hidden="true" />
      <p className="m-0 text-sm font-semibold">{mensaje}</p>
    </div>
  )
}
