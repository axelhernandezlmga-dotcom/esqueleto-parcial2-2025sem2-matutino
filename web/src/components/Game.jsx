/*
 * Qué hace este archivo: define funciones de apoyo para manejar el estado
 * compartido del "juego". No renderiza nada en pantalla, solo ofrece piezas
 * reutilizables que otros componentes (Start, Country, End) pueden importar.
 * Qué debe mirar el estudiante: cómo se traduce una consigna en constantes,
 * funciones pequeñas y validaciones sencillas. Cada utilidad está documentada
 * para entender qué problema resuelve.
 * Puntos clave (anchors): // PASO 1 (configuración de niveles) y siguientes en
 * cada función que valida datos o elige aleatorios.
 */

import { safeArray, unique } from '../common';

// PASO 1: definir en un lugar visible cuántos errores permite cada nivel.
// Este objeto sirve como referencia única para que todos los componentes
// utilicen la misma configuración.
export const LEVEL_CONFIG = {
  facil: {
    etiqueta: 'Fácil',
    erroresPermitidos: 8,
  },
  medio: {
    etiqueta: 'Medio',
    erroresPermitidos: 5,
  },
  dificil: {
    etiqueta: 'Difícil',
    erroresPermitidos: 3,
  },
};

// PASO 2: establecer un nivel seguro en caso de que nadie lo defina.
const DEFAULT_LEVEL = 'medio';

// PASO 3: función pública para crear el estado inicial coherente.
export function initState(level) {
  const nivelElegido = typeof level === 'string' ? level : DEFAULT_LEVEL;
  const configuracion = LEVEL_CONFIG[nivelElegido] ?? LEVEL_CONFIG[DEFAULT_LEVEL];

  return {
    errorsLeft: configuracion.erroresPermitidos,
    visited: [],
    level: nivelElegido,
  };
}

// PASO 4: normalizar cualquier state que venga del router.
export function safeState(locationState) {
  const fallback = initState(DEFAULT_LEVEL);
  const estadoRecibido = typeof locationState === 'object' && locationState !== null
    ? locationState
    : {};

  const errores = typeof estadoRecibido.errorsLeft === 'number'
    ? Math.max(0, estadoRecibido.errorsLeft)
    : fallback.errorsLeft;

  const visitados = unique(
    safeArray(estadoRecibido.visited)
      .filter((codigo) => typeof codigo === 'string' && codigo.trim().length > 0),
  );

  const nivel = typeof estadoRecibido.level === 'string'
    ? estadoRecibido.level
    : fallback.level;

  return {
    errorsLeft: errores,
    visited: visitados,
    level: nivel,
  };
}

// PASO 5: elegir un elemento aleatorio de una lista. Utilizamos operaciones
// explícitas (for, if) para que sea sencillo de seguir para principiantes.
export function pickRandom(items) {
  const lista = safeArray(items);
  if (lista.length === 0) {
    return undefined;
  }

  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

// PASO 6: mezclar una lista sin usar atajos. Creamos una copia y aplicamos
// el algoritmo de Fisher-Yates con pasos detallados.
export function shuffle(items) {
  const lista = safeArray(items).slice();

  for (let indiceActual = lista.length - 1; indiceActual > 0; indiceActual -= 1) {
    const indiceAleatorio = Math.floor(Math.random() * (indiceActual + 1));

    const temporal = lista[indiceActual];
    lista[indiceActual] = lista[indiceAleatorio];
    lista[indiceAleatorio] = temporal;
  }

  return lista;
}

// PASO 7: decidir si la opción elegida por la persona jugadora es incorrecta.
// La validación es muy transparente: revisamos si el código está entre las
// fronteras y si ya fue visitado.
export function isWrongChoice({ chosen, current, borders, visited }) {
  const codigoElegido = typeof chosen === 'string' ? chosen : '';
  const codigoActual = typeof current === 'string' ? current : '';
  const fronteras = safeArray(borders);
  const visitados = safeArray(visited);

  const esLaMisma = codigoElegido === codigoActual;
  const esFrontera = fronteras.includes(codigoElegido);
  const yaVisitado = visitados.includes(codigoElegido);

  if (codigoElegido.length === 0) {
    return true;
  }

  if (esLaMisma) {
    return true;
  }

  if (!esFrontera) {
    return true;
  }

  if (yaVisitado) {
    return true;
  }

  return false;
}
