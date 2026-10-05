import { describe, expect, it } from 'vitest'

import en from './en.json'
import es from './es.json'

type Arbol = { [clave: string]: string | Arbol }

function aplanar(nodo: Arbol, prefijo = ''): Record<string, unknown> {
  const salida: Record<string, unknown> = {}
  for (const [clave, valor] of Object.entries(nodo)) {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave
    if (valor !== null && typeof valor === 'object') {
      Object.assign(salida, aplanar(valor as Arbol, ruta))
    } else {
      salida[ruta] = valor
    }
  }
  return salida
}

const planoEs = aplanar(es as Arbol)
const planoEn = aplanar(en as Arbol)
const clavesEs = Object.keys(planoEs).sort()
const clavesEn = Object.keys(planoEn).sort()

const variables = (texto: unknown): string[] =>
  typeof texto === 'string' ? (texto.match(/\{\{\s*[^}]+?\s*\}\}/g) ?? []).map((v) => v.replace(/\s+/g, '')).sort() : []

describe('Paridad de idiomas es/en (U-6)', () => {
  it('es.json y en.json tienen exactamente el mismo conjunto de claves', () => {
    const faltanEnEn = clavesEs.filter((c) => !(c in planoEn))
    const faltanEnEs = clavesEn.filter((c) => !(c in planoEs))
    expect(
      { faltanEnEn, faltanEnEs },
      `Claves sin par -> faltan en en.json: [${faltanEnEn.join(', ')}] | faltan en es.json: [${faltanEnEs.join(', ')}]`,
    ).toEqual({ faltanEnEn: [], faltanEnEs: [] })
    expect(clavesEn).toEqual(clavesEs)
  })

  it.each([
    ['es.json', planoEs],
    ['en.json', planoEn],
  ])('%s no tiene valores vacios ni solo espacios', (_nombre, plano) => {
    const invalidas = Object.entries(plano)
      .filter(([, v]) => typeof v !== 'string' || v.trim() === '')
      .map(([k]) => k)
    expect(invalidas, `Claves con valor vacio o no texto: [${invalidas.join(', ')}]`).toEqual([])
  })

  it('cada clave usa las mismas variables {{...}} en ambos idiomas', () => {
    const distintas = clavesEs
      .filter((c) => c in planoEn)
      .filter((c) => variables(planoEs[c]).join('|') !== variables(planoEn[c]).join('|'))
    expect(distintas, `Claves con variables distintas: [${distintas.join(', ')}]`).toEqual([])
  })
})
