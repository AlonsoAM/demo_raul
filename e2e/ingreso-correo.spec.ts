import { expect, test, type Page } from '@playwright/test'

// S-1 · Ingreso con correo y contraseña (H1-E1..E12, H3-E1, H3-E5, H3-E6)

test.use({ locale: 'es-PE' })

const DEMO = { correo: 'demo@agricolaandrea.com', contrasena: 'Demo2026!' }
const CORREO_VALIDO = 'maria.lopez@agricolaandrea.com'

const campoCorreo = (page: Page) => page.getByLabel('Correo electrónico')
const campoContrasena = (page: Page) => page.getByLabel('Contraseña', { exact: true })
const botonIngresar = (page: Page) => page.getByRole('button', { name: /^Ingresar$|^Ingresando…$/ })

async function completar(page: Page, correo: string, contrasena: string) {
  if (correo) await campoCorreo(page).fill(correo)
  if (contrasena) await campoContrasena(page).fill(contrasena)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/ingreso')
  await expect(botonIngresar(page)).toBeVisible()
})

test.describe('validaciones (H1-E2..E5)', () => {
  test('correo "maria.lopez@" muestra el aviso de correo', async ({ page }) => {
    await completar(page, 'maria.lopez@', 'Clave12345')
    await botonIngresar(page).click()
    await expect(page.getByText('Ingrese un correo electrónico válido')).toBeVisible()
    await expect(page).toHaveURL(/\/ingreso$/)
  })

  test('contraseña vacía muestra "La contraseña es obligatoria"', async ({ page }) => {
    await completar(page, CORREO_VALIDO, '')
    await botonIngresar(page).click()
    await expect(page.getByText('La contraseña es obligatoria')).toBeVisible()
    await expect(page).toHaveURL(/\/ingreso$/)
  })

  test('contraseña de 7 caracteres muestra el mínimo de 8', async ({ page }) => {
    await completar(page, CORREO_VALIDO, 'Clave12')
    await botonIngresar(page).click()
    await expect(page.getByText('La contraseña debe tener al menos 8 caracteres')).toBeVisible()
    await expect(page).toHaveURL(/\/ingreso$/)
  })

  test('contraseña de 8 caracteres no muestra aviso de longitud', async ({ page }) => {
    await completar(page, CORREO_VALIDO, 'Clave123')
    await botonIngresar(page).click()
    await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible()
    await expect(page.getByText('La contraseña debe tener al menos 8 caracteres')).toHaveCount(0)
  })
})

test.describe('cuenta demo (H1-E1, H1-E11, H3-E1)', () => {
  test('muestra "Ingresando…" y llega a la bienvenida con el correo demo', async ({ page }) => {
    await completar(page, DEMO.correo, DEMO.contrasena)
    await botonIngresar(page).click()

    const pendiente = page.getByRole('button', { name: 'Ingresando…' })
    await expect(pendiente).toBeVisible()
    await expect(pendiente).toHaveAttribute('aria-disabled', 'true')

    await expect(page).toHaveURL(/\/bienvenida$/)
    await expect(page.getByRole('heading', { name: 'Sesión iniciada' })).toBeVisible()
    await expect(page.getByText(DEMO.correo)).toBeVisible()
    await expect(page.getByText('Cuenta de demostración')).toBeVisible()
    await expect(page.getByText('Nombre', { exact: true })).toHaveCount(0)
  })

  test('doble envío con Enter no genera un segundo ingreso', async ({ page }) => {
    await completar(page, DEMO.correo, DEMO.contrasena)
    await campoContrasena(page).press('Enter')
    await campoContrasena(page).press('Enter').catch(() => {})
    await expect(page).toHaveURL(/\/bienvenida$/)
    await expect(page.getByRole('heading', { name: 'Sesión iniciada' })).toBeVisible()
  })
})

test.describe('credenciales incorrectas (H1-E6, E7, E10)', () => {
  test('correo y contraseña desconocidos muestran el mensaje genérico', async ({ page }) => {
    await completar(page, CORREO_VALIDO, 'Clave12345')
    await botonIngresar(page).click()
    await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible()
    await expect(page).toHaveURL(/\/ingreso$/)
  })

  test('correo demo con otra contraseña muestra el mismo mensaje', async ({ page }) => {
    await completar(page, DEMO.correo, 'Otra2026!')
    await botonIngresar(page).click()
    await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible()
    await expect(page).toHaveURL(/\/ingreso$/)
  })

  test('seis intentos fallidos seguidos no bloquean el formulario', async ({ page }) => {
    await completar(page, CORREO_VALIDO, 'Clave12345')
    for (let i = 0; i < 6; i++) {
      await botonIngresar(page).click()
      await expect(page.getByRole('button', { name: 'Ingresando…' })).toBeVisible()
      await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Ingresar', exact: true })).toBeEnabled()
    }
    await expect(page).toHaveURL(/\/ingreso$/)
  })
})

test.describe('mostrar y ocultar contraseña (H1-E8)', () => {
  test('alterna entre texto y puntos', async ({ page }) => {
    await campoContrasena(page).fill(DEMO.contrasena)
    await expect(campoContrasena(page)).toHaveAttribute('type', 'password')

    await page.getByRole('button', { name: 'Mostrar contraseña' }).click()
    await expect(campoContrasena(page)).toHaveAttribute('type', 'text')
    await expect(campoContrasena(page)).toHaveValue(DEMO.contrasena)

    await page.getByRole('button', { name: 'Ocultar contraseña' }).click()
    await expect(campoContrasena(page)).toHaveAttribute('type', 'password')
  })
})

test.describe('bienvenida y cierre de sesión (H3-E1, E5, E6)', () => {
  test('cerrar sesión vuelve al ingreso con el formulario vacío', async ({ page }) => {
    await completar(page, DEMO.correo, DEMO.contrasena)
    await botonIngresar(page).click()
    await expect(page).toHaveURL(/\/bienvenida$/)

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()

    await expect(page).toHaveURL(/\/ingreso$/)
    await expect(campoCorreo(page)).toHaveValue('')
    await expect(campoContrasena(page)).toHaveValue('')
  })

  test('sin sesión, /bienvenida redirige al ingreso', async ({ page }) => {
    await page.goto('/bienvenida')
    await expect(page).toHaveURL(/\/ingreso$/)
  })
})
