/*
 * Qué hace este archivo: agrupa helpers muy simples que se repiten en distintos
 * componentes. Sirven para estandarizar operaciones básicas sin complicaciones.
 * Qué debe mirar el estudiante: cómo escribir utilidades puras, documentadas y
 * fáciles de testear mentalmente. Notar que no dependemos de librerías externas.
 * Puntos clave (anchors): // PASO 1 (validar arreglos), // PASO 2 (espera) y
 * // PASO 3 (quitar duplicados).
 */

// PASO 1: asegurar que tratamos cualquier valor como un arreglo válido.
export function safeArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null) {
    return [];
  }

  return [value];
}

// PASO 2: helper para simular demoras en la API. Se usa await sleep(ms).
export function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

// PASO 3: remover duplicados manteniendo el orden original.
export function unique(array) {
  const lista = safeArray(array);
  const resultado = [];

  for (let indice = 0; indice < lista.length; indice += 1) {
    const elemento = lista[indice];
    if (!resultado.includes(elemento)) {
      resultado.push(elemento);
    }
  }

  return resultado;
}
