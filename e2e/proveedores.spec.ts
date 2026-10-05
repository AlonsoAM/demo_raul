import { expect, test } from '@playwright/test'

const PROVEEDORES = [
  { id: 'google', boton: 'Continuar con Google', nombre: 'Carla Ríos', correo: 'carla.rios@gmail.com', iniciales: 'CR', via: 'Ingreso con Google', escenarios: 'H2-E1/E2, H3-E2/E3' },
  { id: 'github', boton: 'Continuar con GitHub', nombre: 'Mateo Quispe', correo: 'mateo.quispe@users.noreply.github.com', iniciales: 'MQ', via: 'Ingreso con GitHub', escenarios: 'H2-E3..E5, H3-E4' },
  { id: 'microsoft', boton: 'Continuar con Microsoft', nombre: 'Lucía Paredes', correo: 'lucia.paredes@outlook.com', iniciales: 'LP', via: 'Ingreso con Microsoft', escenarios: 'H2-E6..E8, H3-E7/E8' },
] as const

const TODOS = ['Continuar con Google', 'Continuar con GitHub', 'Continuar con Microsoft']

for (const p of PROVEEDORES) {
  test(`S-2 ${p.escenarios}: ${p.boton} con formulario vacío ingresa y muestra la bienvenida`, async ({ page }) => {
    await page.goto('/ingreso')

    // Formulario vacío: sin avisos de campo.
    await page.getByRole('button', { name: p.boton }).click()

    // Ingresando… y los tres botones bloqueados con aria-disabled.
    await expect(page.getByRole('button', { name: 'Ingresando…' })).toHaveAttribute('aria-disabled', 'true')
    for (const otro of TODOS.filter((t) => t !== p.boton)) {
      await expect(page.getByRole('button', { name: otro })).toHaveAttribute('aria-disabled', 'true')
    }
    await expect(page.getByRole('alert')).toHaveCount(0)
    await expect(page.getByText('Ingrese un correo electrónico válido')).toHaveCount(0)

    // Sin doble envío: segundo clic (forzado) sobre un botón bloqueado no cambia nada.
    await page.getByRole('button', { name: 'Ingresando…' }).click({ force: true })
    await expect(page.getByRole('button', { name: 'Ingresando…' })).toHaveCount(1)
    await expect(page).toHaveURL(/\/ingreso$/)

    // Bienvenida con la identidad de ejemplo.
    await expect(page).toHaveURL(/\/bienvenida$/)
    await expect(page.getByRole('heading', { level: 1, name: `Hola, ${p.nombre}` })).toBeVisible()
    await expect(page.getByText('Nombre', { exact: true })).toBeVisible()
    await expect(page.getByText(p.correo, { exact: true })).toBeVisible()
    await expect(page.getByText(p.iniciales, { exact: true })).toBeVisible()
    await expect(page.getByText(p.via, { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()
  })
}
