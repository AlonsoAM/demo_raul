import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { CampoContrasena } from "./CampoContrasena"

function Wrapper() {
  const { register } = useForm<{ contrasena: string }>()
  return <CampoContrasena {...register("contrasena")} />
}

describe("CampoContrasena (U-7)", () => {
  it("H1-E8/E9: oculta por defecto, muestra y vuelve a ocultar", async () => {
    const user = userEvent.setup()
    render(<Wrapper />)

    const input = screen.getByLabelText("Contraseña", { selector: "input" })
    expect(input).toHaveAttribute("type", "password")

    await user.type(input, "Demo2026!")

    // Mostrar -> type=text con el valor legible
    await user.click(screen.getByRole("button", { name: "Mostrar contraseña" }))
    expect(input).toHaveAttribute("type", "text")
    expect(input).toHaveValue("Demo2026!")

    // Ocultar -> vuelve a password y conserva el valor
    await user.click(screen.getByRole("button", { name: "Ocultar contraseña" }))
    expect(input).toHaveAttribute("type", "password")
    expect(input).toHaveValue("Demo2026!")
    expect(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    ).toBeInTheDocument()
  })
})
