import { expect, test, type Page } from '@playwright/test'

// S-4 (Const. A16 b): arranque en «sistema», los tres estados pintan ingreso y bienvenida, regreso a «sistema» y persistencia.
test.use({ locale: 'es-PE' })

const CORREO = 'demo@agricolaandrea.com'
const CLAVE = 'Demo2026!'
const FONDO_OSCURO = 'rgb(19, 31, 36)'
const FONDO_CLARO = 'rgb(247, 247, 247)'

const fondo = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor)

async function elegir(page: Page, nombre: 'Claro' | 'Oscuro' | 'Sistema') {
  const boton = page.getByRole('button', { name: nombre, exact: true })
  await boton.click()
  await expect(boton).toHaveAttribute('aria-pressed', 'true')
}

async function ingresar(page: Page) {
  await page.getByLabel('Correo electrónico').fill(CORREO)
  await page.getByLabel('Contraseña', { exact: true }).fill(CLAVE)
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
  await expect(page).toHaveURL(/\/bienvenida/)
}

test.describe('Tema (H1-E16, H1-E17, H1-E18, H1-E19)', () => {
  test.describe('SO oscuro', () => {
    test.use({ colorScheme: 'dark' })

    test('H1-E16: arranca en «Sistema» siguiendo al SO oscuro, sin data-theme', async ({ page }) => {
      await page.goto('/ingreso')
      await expect(page.getByRole('button', { name: 'Sistema', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/)
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)

      await page.emulateMedia({ colorScheme: 'light' })
      await expect.poll(() => fondo(page)).toBe(FONDO_CLARO)
    })

    test('H1-E17: Claro, Oscuro y Sistema pintan ingreso y bienvenida', async ({ page }) => {
      await page.goto('/ingreso')

      await elegir(page, 'Claro')
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
      await expect.poll(() => fondo(page)).toBe(FONDO_CLARO)

      await elegir(page, 'Oscuro')
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)

      await elegir(page, 'Claro')
      await ingresar(page)
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
      await expect.poll(() => fondo(page)).toBe(FONDO_CLARO)

      await elegir(page, 'Oscuro')
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)

      // Sistema (SO oscuro) también pinta oscuro en la bienvenida
      await elegir(page, 'Sistema')
      await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/)
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)
    })

    test('H1-E18: volver a «Sistema» quita el atributo y vuelve a seguir al SO', async ({ page }) => {
      await page.goto('/ingreso')
      await elegir(page, 'Claro')
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
      await expect.poll(() => fondo(page)).toBe(FONDO_CLARO)

      await elegir(page, 'Sistema')
      await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/)
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)

      await page.emulateMedia({ colorScheme: 'light' })
      await expect.poll(() => fondo(page)).toBe(FONDO_CLARO)
      await page.emulateMedia({ colorScheme: 'dark' })
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)
    })
  })

  test.describe('SO claro', () => {
    test.use({ colorScheme: 'light' })

    test('H1-E18: «Sistema» con SO claro pinta claro y sin data-theme', async ({ page }) => {
      await page.goto('/ingreso')
      await elegir(page, 'Oscuro')
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)

      await elegir(page, 'Sistema')
      await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/)
      await expect.poll(() => fondo(page)).toBe(FONDO_CLARO)
    })

    test('H1-E19: «Oscuro» persiste al recargar y en una nueva página del mismo contexto', async ({
      page,
      context,
    }) => {
      await page.goto('/ingreso')
      await elegir(page, 'Oscuro')
      expect(await page.evaluate(() => localStorage.getItem('tema'))).toBe('oscuro')

      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
      await expect(page.getByRole('button', { name: 'Oscuro', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      await expect.poll(() => fondo(page)).toBe(FONDO_OSCURO)

      const otra = await context.newPage()
      await otra.goto('/ingreso')
      await expect(otra.locator('html')).toHaveAttribute('data-theme', 'dark')
      await expect.poll(() => fondo(otra)).toBe(FONDO_OSCURO)
      await otra.close()
    })
  })
})
