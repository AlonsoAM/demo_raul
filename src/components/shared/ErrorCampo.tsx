import type { ComponentProps } from "react"
import { CircleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Aviso de error bajo un campo. El `id` se enlaza con `aria-describedby` del campo.
 * El texto llega ya traducido; si no hay mensaje no renderiza nada.
 */
export function ErrorCampo({
  id,
  className,
  children,
  ...props
}: ComponentProps<"p"> & { id: string }) {
  if (!children) return null

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "mt-2 flex items-start gap-2 text-sm font-bold text-red-text",
        className,
      )}
      {...props}
    >
      <CircleAlert aria-hidden="true" className="mt-px size-[18px] shrink-0" />
      <span>{children}</span>
    </p>
  )
}
