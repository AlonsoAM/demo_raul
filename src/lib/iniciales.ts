/**
 * Iniciales para el avatar de la bienvenida (plan §3.7).
 *
 * - Con nombre: primera letra de las dos primeras palabras, en mayúscula
 *   (`Carla Ríos` → `CR`).
 * - Sin nombre (`null`, vía correo): primera letra del correo en mayúscula
 *   (`demo@…` → `D`).
 *
 * Casos borde (el plan no los define; se resuelven sin romper):
 * - Espacios extra al inicio, al final o entre palabras se ignoran.
 * - Una sola palabra produce una sola inicial.
 * - Se toma el primer carácter tal cual (sin filtrar símbolos ni dígitos) y se
 *   usa `Array.from` para no partir caracteres fuera del plano básico.
 * - Nombre vacío o solo espacios se trata como sin nombre.
 * - Si tampoco hay correo utilizable, devuelve cadena vacía.
 */
export function obtenerIniciales(nombre: string | null, correo: string): string {
  const palabras = (nombre ?? '').trim().split(/\s+/).filter(Boolean);

  if (palabras.length > 0) {
    return palabras
      .slice(0, 2)
      .map((palabra) => Array.from(palabra)[0])
      .join('')
      .toLocaleUpperCase();
  }

  const [primera = ''] = Array.from(correo.trim());
  return primera.toLocaleUpperCase();
}
