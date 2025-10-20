/*
 * Qué hace este archivo: muestra la pantalla principal del recorrido. Según el
 * código en la URL consulta la API, arma opciones y permite decidir el siguiente
 * destino. Es el corazón del simulacro porque combina routing, fetch y lógica.
 * Qué debe mirar el estudiante: cómo se enlazan useParams, useLocation y
 * useNavigate; cómo se construyen opciones paso a paso y cómo se actualiza el
 * estado compartido usando helpers del archivo Game.jsx.
 * Puntos clave (anchors): // PASO 1 (leer parámetro), // PASO 2 (traer datos),
 * // PASO 3 (armar opciones), // PASO 4 (manejar clics) y // PASO 5 (navegar).
 */

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  initState,
  isWrongChoice,
  pickRandom,
  safeState,
  shuffle,
} from './Game';
import { safeArray, unique } from '../common';

function Country() {
  // PASO 1: leo el parámetro :cca3 para saber qué país mostrar.
  const parametros = useParams();
  const codigoActual = parametros.cca3 ?? '';

  const location = useLocation();
  const estadoCompartido = safeState(location.state);

  const navigate = useNavigate();

  // Estados locales para manejar la UI.
  const [detallePais, setDetallePais] = useState(null);
  const [codigosDisponibles, setCodigosDisponibles] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState('');

  // Memorizar una lista de visitados que incluya el país actual.
  const visitadosConActual = useMemo(() => (
    unique([...estadoCompartido.visited, codigoActual])
  ), [estadoCompartido.visited, codigoActual]);

  useEffect(() => {
    // PASO 2: traigo datos del país actual y la lista completa para opciones.
    let estaMontado = true;

    async function cargarDatos() {
      setEstaCargando(true);
      setMensajeError('');

      try {
        const respuestaDetalle = await fetch(`/api/countries/${codigoActual}`);

        if (!respuestaDetalle.ok) {
          throw new Error('No encontramos información del país solicitado.');
        }

        const datosPais = await respuestaDetalle.json();

        const respuestaLista = await fetch('/api/countries');

        if (!respuestaLista.ok) {
          throw new Error('No pudimos obtener la lista total de países.');
        }

        const listaCodigos = await respuestaLista.json();

        if (!Array.isArray(listaCodigos)) {
          throw new Error('La API devolvió un formato inesperado.');
        }

        if (!estaMontado) {
          return;
        }

        setDetallePais(datosPais);
        setCodigosDisponibles(listaCodigos);

        // PASO 3: armo opciones (fronterizos + aleatorios) con máximo de 9.
        const fronteras = safeArray(datosPais.borders);
        const opcionesTemporales = [];
        const maximoOpciones = 9;

        for (let indice = 0; indice < fronteras.length; indice += 1) {
          if (opcionesTemporales.length >= maximoOpciones) {
            break;
          }

          const codigoFrontera = fronteras[indice];
          if (typeof codigoFrontera === 'string' && codigoFrontera.length > 0) {
            opcionesTemporales.push({
              codigo: codigoFrontera,
              descripcion: `${codigoFrontera} (frontera real)`,
              esFrontera: true,
            });
          }
        }

        const codigosEvitar = unique([
          ...visitadosConActual,
          datosPais.cca3,
          ...fronteras,
        ]);

        const codigosDisponiblesParaAleatorio = safeArray(listaCodigos)
          .filter((codigo) => !codigosEvitar.includes(codigo));

        while (
          opcionesTemporales.length < maximoOpciones
          && codigosDisponiblesParaAleatorio.length > 0
        ) {
          const candidato = pickRandom(codigosDisponiblesParaAleatorio);

          if (!candidato) {
            break;
          }

          opcionesTemporales.push({
            codigo: candidato,
            descripcion: `${candidato} (distractor)`,
            esFrontera: false,
          });

          const indiceEliminar = codigosDisponiblesParaAleatorio.indexOf(candidato);
          if (indiceEliminar >= 0) {
            codigosDisponiblesParaAleatorio.splice(indiceEliminar, 1);
          }
        }

        const opcionesFinales = shuffle(opcionesTemporales);

        if (opcionesFinales.length === 0) {
          opcionesFinales.push({
            codigo: datosPais.cca3,
            descripcion: 'Sin opciones disponibles',
            esFrontera: false,
          });
        }

        setOpciones(opcionesFinales);
      } catch (error) {
        if (estaMontado) {
          setMensajeError(error.message ?? 'Ocurrió un error inesperado.');
        }
      } finally {
        if (estaMontado) {
          setEstaCargando(false);
        }
      }
    }

    if (!codigoActual) {
      setDetallePais(null);
      setCodigosDisponibles([]);
      setOpciones([]);
      setEstaCargando(false);
      setMensajeError('La URL no especifica un código de país.');
      return undefined;
    }

    cargarDatos();

    return () => {
      estaMontado = false;
    };
  }, [codigoActual, visitadosConActual]);

  function manejarVolverAlInicio() {
    navigate('/', { state: initState(estadoCompartido.level) });
  }

  function manejarOpcion(candidato) {
    if (!detallePais) {
      return;
    }

    // PASO 4: manejo click correcto/incorrecto.
    const fueIncorrecto = isWrongChoice({
      chosen: candidato.codigo,
      current: detallePais.cca3,
      borders: detallePais.borders,
      visited: estadoCompartido.visited,
    });

    const visitadosActualizados = unique([
      ...visitadosConActual,
      candidato.codigo,
    ]);

    // PASO 5: actualizo visited y errorsLeft y navego según corresponda.
    if (fueIncorrecto) {
      const erroresRestantes = Math.max(0, estadoCompartido.errorsLeft - 1);

      if (erroresRestantes <= 0) {
        navigate('/end', {
          state: {
            visited: visitadosActualizados,
            level: estadoCompartido.level,
          },
        });
        return;
      }

      navigate(`/country/${candidato.codigo}`, {
        state: {
          errorsLeft: erroresRestantes,
          visited: visitadosActualizados,
          level: estadoCompartido.level,
        },
      });
      return;
    }

    navigate(`/country/${candidato.codigo}`, {
      state: {
        errorsLeft: estadoCompartido.errorsLeft,
        visited: visitadosActualizados,
        level: estadoCompartido.level,
      },
    });
  }

  function manejarNinguno() {
    if (!detallePais) {
      return;
    }

    const candidatos = safeArray(codigosDisponibles)
      .filter((codigo) => !visitadosConActual.includes(codigo) && codigo !== detallePais.cca3);

    const proximoCodigo = pickRandom(candidatos);

    if (!proximoCodigo) {
      setMensajeError('No quedan países disponibles para continuar.');
      return;
    }

    navigate(`/country/${proximoCodigo}`, {
      state: {
        errorsLeft: estadoCompartido.errorsLeft,
        visited: visitadosConActual,
        level: estadoCompartido.level,
      },
    });
  }

  if (estaCargando) {
    return <p>Cargando país actual...</p>;
  }

  if (mensajeError) {
    return (
      <section>
        <p style={{ color: 'crimson' }}>{mensajeError}</p>
        <button type="button" onClick={manejarVolverAlInicio}>
          Volver al inicio
        </button>
      </section>
    );
  }

  if (!detallePais) {
    return (
      <section>
        <p>No hay datos para mostrar.</p>
        <button type="button" onClick={manejarVolverAlInicio}>
          Volver al inicio
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2>
        {detallePais.name?.common ?? 'País sin nombre legible'} ({detallePais.cca3})
      </h2>

      {detallePais.flag?.svg && (
        <img
          src={detallePais.flag.svg}
          alt={`Bandera de ${detallePais.name?.common ?? detallePais.cca3}`}
          width={160}
        />
      )}

      <p>Nivel actual: {estadoCompartido.level}</p>
      <p>Errores restantes: {estadoCompartido.errorsLeft}</p>
      <p>Visitados: {visitadosConActual.join(', ')}</p>

      <div>
        {opciones.map((opcion) => (
          <button
            key={opcion.codigo}
            type="button"
            onClick={() => manejarOpcion(opcion)}
          >
            {opcion.descripcion}
          </button>
        ))}
      </div>

      <button type="button" onClick={manejarNinguno}>
        Ninguno
      </button>
    </section>
  );
}

export default Country;
