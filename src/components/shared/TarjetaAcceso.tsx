import type { ComponentProps } from "react"
import { cn } from "cn"

/** Contenedor de tarjeta compartido por las pantallas de ingreso y bienvenida. */
export function TarjetaAcceso({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "relative w-full max-w-[440px] rounded-lg border border-border bg-card p-6 text-card-foreground shadow-elevated md:p-10",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
