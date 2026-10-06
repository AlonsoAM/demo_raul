import { expect, test, type Page } from '@playwright/test'

// S-3 (Const. A16 a): navegador en inglés, la app arranca en español; recorrido en inglés y persistencia.
test.use({ locale: 'en-US' })

const CORREO = 'demo@agricolaandrea.com'
const CLAVE = 'Demo2026!'

async function elegirIngles(page: Page) {
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
}

test.describe('Idioma (H1-E13, H1-E14, H1-E15)', () => {
  test('H1-E13: con el navegador en inglés arranca en español', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Ingresar', exact: true })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'false')
  })

  test('H1-E14: al elegir inglés los rótulos cambian y se recorre el ingreso hasta la bienvenida', async ({
    page,
  }) => {
    await page.goto('/')
    await elegirIngles(page)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('Email address')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()

    await page.getByLabel('Email address').fill(CORREO)
    await page.getByLabel('Password', { exact: true }).fill(CLAVE)
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
    await expect(page.getByText('Signed in', { exact: true })).toBeVisible()
    await expect(page.getByText(CORREO)).toBeVisible()
    await expect(page.getByText('Demo account')).toBeVisible()
  })

  test('H1-E15: la elección persiste al recargar y en una nueva página del mismo contexto', async ({
    page,
    context,
  }) => {
    await page.goto('/')
    await elegirIngles(page)
    expect(await page.evaluate(() => localStorage.getItem('idioma'))).toBe('en')

    await page.reload()
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    const otra = await context.newPage()
    await otra.goto('/')
    await expect(otra.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
    await expect(otra.locator('html')).toHaveAttribute('lang', 'en')
    await otra.close()
  })
})
