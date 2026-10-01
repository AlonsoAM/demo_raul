import type { SVGProps } from 'react'

/** Logo de Microsoft (cuatro cuadros con colores de marca, copiados del mockup). Lucide no ofrece logos de marca vigentes. */
export function IconoMicrosoft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  )
}
