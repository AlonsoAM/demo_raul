import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AutenticacionNoConfiguradaError,
  CUENTA_DEMO,
  CredencialesInvalidasError,
  IDENTIDADES_PROVEEDOR,
  LATENCIA_SIMULADA_MS,
  ingresarConCorreo,
  ingresarConProveedor,
} from './auth.api'

async function resolver<T>(promesa: Promise<T>): Promise<T> {
  await vi.advanceTimersByTimeAsync(LATENCIA_SIMULADA_MS)
  return promesa
}

async function rechazo(promesa: Promise<unknown>): Promise<unknown> {
  const capturada = promesa.then(
    () => null,
    (e: unknown) => e,
  )
  await vi.advanceTimersByTimeAsync(LATENCIA_SIMULADA_MS)
  return capturada
}

describe('auth.api — ingresarConCorreo (H1-E1, H1-E6, H1-E7, H1-E12)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('la cuenta demo ingresa y devuelve la sesión por correo sin nombre (H1-E1)', async () => {
    const usuario = await resolver(
      ingresarConCorreo({ correo: CUENTA_DEMO.correo, contrasena: CUENTA_DEMO.contrasena }),
    )
    expect(usuario).toEqual({ nombre: null, correo: 'demo@agricolaandrea.com', via: 'correo' })
  })

  it('literales de la cuenta demo: demo@agricolaandrea.com / Demo2026!', async () => {
    const usuario = await resolver(
      ingresarConCorreo({ correo: 'demo@agricolaandrea.com', contrasena: 'Demo2026!' }),
    )
    expect(usuario.via).toBe('correo')
  })

  it('otro correo con otra contraseña se rechaza (H1-E6)', async () => {
    const error = await rechazo(
      ingresarConCorreo({ correo: 'maria.lopez@agricolaandrea.com', contrasena: 'Clave12345' }),
    )
    expect(error).toBeInstanceOf(CredencialesInvalidasError)
  })

  it('correo demo con contraseña incorrecta se rechaza (H1-E6)', async () => {
    const error = await rechazo(
      ingresarConCorreo({ correo: 'demo@agricolaandrea.com', contrasena: 'Otra2026!' }),
    )
    expect(error).toBeInstanceOf(CredencialesInvalidasError)
  })

  it('ambos fallos producen el mismo error único sin revelar el campo (H1-E7)', async () => {
    const e1 = (await rechazo(
      ingresarConCorreo({ correo: 'maria.lopez@agricolaandrea.com', contrasena: 'Clave12345' }),
    )) as Error
    const e2 = (await rechazo(
      ingresarConCorreo({ correo: 'demo@agricolaandrea.com', contrasena: 'Otra2026!' }),
    )) as Error
    const e3 = (await rechazo(
      ingresarConCorreo({ correo: 'maria.lopez@agricolaandrea.com', contrasena: 'Demo2026!' }),
    )) as Error
    expect(e1.constructor).toBe(e2.constructor)
    expect(e1.constructor).toBe(e3.constructor)
    expect(e1.name).toBe('CredencialesInvalidasError')
    expect(e1.message).toBe(e2.message)
    expect(e1.message).toBe(e3.message)
    expect(e1.message.toLowerCase()).not.toMatch(/correo|contrase/)
  })

  it('seis rechazos seguidos no bloquean: la cuenta demo sigue ingresando (H1-E12)', async () => {
    for (let i = 0; i < 6; i++) {
      const error = await rechazo(
        ingresarConCorreo({ correo: 'demo@agricolaandrea.com', contrasena: `Mala${i}!` }),
      )
      expect(error).toBeInstanceOf(CredencialesInvalidasError)
    }
    const usuario = await resolver(
      ingresarConCorreo({ correo: CUENTA_DEMO.correo, contrasena: CUENTA_DEMO.contrasena }),
    )
    expect(usuario.correo).toBe('demo@agricolaandrea.com')
  })
})

describe('auth.api — ingresarConProveedor (H2-E1, H2-E2, H2-E6)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Google devuelve la identidad de ejemplo (H2-E1)', async () => {
    expect(await resolver(ingresarConProveedor('google'))).toEqual({
      nombre: 'Carla Ríos',
      correo: 'carla.rios@gmail.com',
      via: 'google',
    })
  })

  it('GitHub devuelve la identidad de ejemplo (H2-E2)', async () => {
    expect(await resolver(ingresarConProveedor('github'))).toEqual({
      nombre: 'Mateo Quispe',
      correo: 'mateo.quispe@users.noreply.github.com',
      via: 'github',
    })
  })

  it('Microsoft devuelve la identidad de ejemplo (H2-E6)', async () => {
    expect(await resolver(ingresarConProveedor('microsoft'))).toEqual({
      nombre: 'Lucía Paredes',
      correo: 'lucia.paredes@outlook.com',
      via: 'microsoft',
    })
  })

  it('las tres identidades coinciden con IDENTIDADES_PROVEEDOR', () => {
    expect(Object.keys(IDENTIDADES_PROVEEDOR).sort()).toEqual(['github', 'google', 'microsoft'])
  })
})

describe('auth.api — flag VITE_AUTH_SIMULADA', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('con el flag en "true" la cuenta demo ingresa', async () => {
    vi.stubEnv('VITE_AUTH_SIMULADA', 'true')
    vi.useFakeTimers()
    try {
      const usuario = await resolver(
        ingresarConCorreo({ correo: CUENTA_DEMO.correo, contrasena: CUENTA_DEMO.contrasena }),
      )
      expect(usuario.via).toBe('correo')
    } finally {
      vi.useRealTimers()
    }
  })

  it('con el flag en "false" el ingreso por correo rechaza aunque las credenciales sean las demo', async () => {
    vi.stubEnv('VITE_AUTH_SIMULADA', 'false')
    await expect(
      ingresarConCorreo({ correo: CUENTA_DEMO.correo, contrasena: CUENTA_DEMO.contrasena }),
    ).rejects.toBeInstanceOf(AutenticacionNoConfiguradaError)
  })

  it('con el flag en "false" los tres proveedores rechazan', async () => {
    vi.stubEnv('VITE_AUTH_SIMULADA', 'false')
    for (const proveedor of ['google', 'github', 'microsoft'] as const) {
      await expect(ingresarConProveedor(proveedor)).rejects.toBeInstanceOf(
        AutenticacionNoConfiguradaError,
      )
    }
  })

  it('sin definir el flag también rechaza', async () => {
    vi.stubEnv('VITE_AUTH_SIMULADA', '')
    await expect(ingresarConProveedor('google')).rejects.toBeInstanceOf(
      AutenticacionNoConfiguradaError,
    )
  })
})
