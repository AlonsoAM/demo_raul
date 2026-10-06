import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { SelectorTema } from './SelectorTema'

const html = () => document.documentElement

describe('SelectorTema (U-8 · H1-E16..H1-E18, RN-14)', () => {
  it('arranca en «Sistema» presionado y sin data-theme', () => {
    render(<SelectorTema />)

    expect(screen.getByRole('group', { name: 'Tema' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sistema' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Oscuro' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Claro' })).toHaveAttribute('aria-pressed', 'false')
    expect(html()).not.toHaveAttribute('data-theme')
  })

  it('elegir «Oscuro» aplica data-theme="dark", marca la opción y persiste', async () => {
    const user = userEvent.setup()
    render(<SelectorTema />)

    await user.click(screen.getByRole('button', { name: 'Oscuro' }))

    expect(html()).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: 'Oscuro' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Sistema' })).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('tema')).toBe('oscuro')
  })

  it('elegir «Claro» aplica data-theme="light"', async () => {
    const user = userEvent.setup()
    render(<SelectorTema />)

    await user.click(screen.getByRole('button', { name: 'Claro' }))

    expect(html()).toHaveAttribute('data-theme', 'light')
    expect(screen.getByRole('button', { name: 'Claro' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('volver a «Sistema» quita data-theme y marca «Sistema»', async () => {
    const user = userEvent.setup()
    render(<SelectorTema />)

    await user.click(screen.getByRole('button', { name: 'Oscuro' }))
    await user.click(screen.getByRole('button', { name: 'Sistema' }))

    expect(html()).not.toHaveAttribute('data-theme')
    expect(screen.getByRole('button', { name: 'Sistema' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Oscuro' })).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('tema')).toBe('sistema')
  })

  it('restaura la opción guardada al montar', () => {
    localStorage.setItem('tema', 'oscuro')
    render(<SelectorTema />)

    expect(screen.getByRole('button', { name: 'Oscuro' })).toHaveAttribute('aria-pressed', 'true')
  })
})
