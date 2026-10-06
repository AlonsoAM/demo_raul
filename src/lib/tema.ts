/** Tema de la interfaz (Const. A16 b): `sistema` quita `data-theme` y manda `prefers-color-scheme`. */
export type Tema = 'claro' | 'oscuro' | 'sistema'

export const CLAVE_TEMA = 'tema'

const TEMAS: readonly Tema[] = ['claro', 'oscuro', 'sistema']

function esTema(valor: unknown): valor is Tema {
  return typeof valor === 'string' && (TEMAS as readonly string[]).includes(valor)
}

/** Lee el tema guardado; ausente, inválido o con storage no disponible → `sistema`. */
export function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA)
    return esTema(guardado) ? guardado : 'sistema'
  } catch (error) {
    console.warn('tema: no se pudo leer localStorage', error)
    return 'sistema'
  }
}

/** Aplica el tema sobre `<html>`. `sistema` QUITA el atributo (nunca lo escribe). */
export function aplicarTema(tema: Tema): void {
  const raiz = document.documentElement
  if (tema === 'claro') raiz.setAttribute('data-theme', 'light')
  else if (tema === 'oscuro') raiz.setAttribute('data-theme', 'dark')
  else raiz.removeAttribute('data-theme')
}

/** Persiste el tema (se guardan los tres literales, incluido `sistema`). */
export function guardarTema(tema: Tema): void {
  try {
    localStorage.setItem(CLAVE_TEMA, tema)
  } catch (error) {
    console.warn('tema: no se pudo guardar en localStorage', error)
  }
}

/** Aplica y guarda el tema elegido. */
export function cambiarTema(tema: Tema): void {
  aplicarTema(tema)
  guardarTema(tema)
}

/** Aplica el tema guardado al arrancar (se llama en `main.tsx`, antes de montar React). */
export function iniciarTema(): void {
  aplicarTema(leerTema())
}
