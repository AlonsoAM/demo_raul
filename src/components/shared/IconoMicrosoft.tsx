import type { SVGProps } from 'react'

/** Logo de Microsoft (cuatro cuadros, relleno `currentColor`). Lucide no ofrece logos de marca vigentes. */
export function IconoMicrosoft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M1 1h10v10H1z" />
      <path d="M13 1h10v10H13z" />
      <path d="M1 13h10v10H1z" />
      <path d="M13 13h10v10H13z" />
    </svg>
  )
}
