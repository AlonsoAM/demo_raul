import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LoaderCircle } from "lucide-react"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-base font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-progress aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        // Acción principal: fill primario, sombra 3D que se "hunde" 4px al presionar.
        principal:
          "w-full bg-primary text-[17px] font-extrabold text-on-primary shadow-button aria-disabled:not-aria-busy:opacity-55 hover:bg-primary-hover active:not-aria-disabled:translate-y-1 active:not-aria-disabled:shadow-none",
        // Ingreso con proveedor: fondo de tarjeta, borde 2px y sombra inferior de 3px.
        proveedor:
          "w-full border-2 border-border bg-card font-extrabold text-card-foreground aria-disabled:not-aria-busy:opacity-55 shadow-[0_3px_0_var(--border)] hover:bg-surface-1 active:not-aria-disabled:translate-y-[3px] active:not-aria-disabled:shadow-none",
        contorno:
          "border-2 border-border-strong bg-transparent text-[17px] font-extrabold text-ink hover:bg-surface-2 aria-expanded:bg-muted",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-red-text hover:bg-destructive/15 focus-visible:outline-destructive",
        link: "text-primary-text underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 px-4 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-14 gap-2.5 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        proveedor: "h-[52px] gap-3 px-4 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-12",
      },
    },
    // Tamaño por defecto según variante: principal 56px, proveedor 52px (brief §7).
    compoundVariants: [
      { variant: "principal", size: "default", className: "h-14 gap-2.5 px-6" },
      {
        variant: "proveedor",
        size: "default",
        className: "h-[52px] gap-3 px-4 [&_svg:not([class*='size-'])]:size-5",
      },
      { variant: "contorno", size: "default", className: "h-14 px-4" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /**
     * Estado de procesamiento: muestra spinner, marca `aria-busy` y bloquea la
     * acción SIN usar `disabled` (así el botón conserva el foco visible).
     */
    cargando?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  cargando = false,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  // Con asChild el hijo es el único nodo permitido: no se inyecta spinner.
  const contenido =
    asChild || !cargando ? (
      children
    ) : (
      <>
        <LoaderCircle
          aria-hidden="true"
          className="motion-safe:animate-spin"
          data-icon="inline-start"
        />
        {children}
      </>
    )

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={cargando || undefined}
      aria-disabled={cargando || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={
        cargando
          ? (evento: React.MouseEvent<HTMLButtonElement>) => evento.preventDefault()
          : onClick
      }
      {...props}
    >
      {contenido}
    </Comp>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
